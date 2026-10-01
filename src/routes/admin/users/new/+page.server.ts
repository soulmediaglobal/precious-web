import { randomUUID } from 'node:crypto';
import { error, fail, redirect } from '@sveltejs/kit';
import {
	assignableCmsRoles,
	canAccessUserManagement,
	cmsRoles,
	type CmsRole
} from '$lib/server/cms-user-access';
import {
	createCmsUserMembership,
	getCmsUser,
	insertCmsActivityLog,
	type CmsActivityActor
} from '$lib/server/db/queries';
import { createSupabaseAdminClient } from '$lib/server/supabase-admin';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (!canAccessUserManagement(locals.cmsUser)) {
		throw error(403, 'Lo tidak punya akses untuk menambah user.');
	}

	return { assignableRoles: assignableCmsRoles(locals.cmsUser) };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const actor = locals.cmsUser;

		if (!canAccessUserManagement(actor)) {
			throw error(403, 'Lo tidak punya akses untuk menambah user.');
		}

		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim();
		const position = String(formData.get('position') ?? '').trim();
		const email = String(formData.get('email') ?? '')
			.trim()
			.toLowerCase();
		const password = String(formData.get('password') ?? '');
		const requestedRole = String(formData.get('role') ?? '');
		const values = { name, position, email, role: requestedRole };

		if (!name || name.length > 120) {
			return fail(400, { message: 'Nama wajib diisi, maksimal 120 karakter.', values });
		}

		if (!position || position.length > 160) {
			return fail(400, { message: 'Posisi wajib diisi, maksimal 160 karakter.', values });
		}

		if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
			return fail(400, { message: 'Masukkan alamat email yang valid.', values });
		}

		if (password.length < 12) {
			return fail(400, { message: 'Password awal minimal 12 karakter.', values });
		}

		if (!cmsRoles.includes(requestedRole as CmsRole)) {
			return fail(400, { message: 'Role tidak valid.', values });
		}

		const role = requestedRole as CmsRole;

		if (!assignableCmsRoles(actor).includes(role)) {
			throw error(403, 'Lo tidak boleh memberikan role tersebut.');
		}

		const admin = createSupabaseAdminClient();
		const correlationId = randomUUID();
		let auditActor: CmsActivityActor = null;
		try {
			const currentActor = await getCmsUser(actor!.userId);
			if (
				!canAccessUserManagement(currentActor) ||
				currentActor?.deletionStartedAt ||
				!assignableCmsRoles(currentActor).includes(role)
			) {
				return fail(403, {
					message: 'Hak akses lo berubah. Akun belum dibuat.',
					values
				});
			}
			auditActor = {
				userId: currentActor!.userId,
				name: currentActor!.name,
				role: currentActor!.role
			};
			await insertCmsActivityLog({
				actor: auditActor,
				action: 'user.created',
				outcome: 'pending',
				entityId: null,
				correlationId
			});
		} catch {
			return fail(503, {
				message: 'Pencatatan aktivitas belum tersedia. Akun belum dibuat. Coba lagi nanti.',
				values
			});
		}

		async function recordCreationOutcome(
			outcome: 'failure' | 'uncertain' | 'denied',
			entityId: string | null = null
		) {
			try {
				await insertCmsActivityLog({
					actor: auditActor,
					action: 'user.created',
					outcome,
					entityId,
					correlationId
				});
			} catch {
				// The original pending event remains; never repeat the Auth operation here.
				console.error('CMS creation outcome audit unavailable', { correlationId });
			}
		}

		let createdUserId: string;

		try {
			const { data, error: createError } = await admin.auth.admin.createUser({
				email,
				password,
				email_confirm: true
			});

			if (createError || !data.user) {
				console.error('CMS Auth creation failed', {
					status: createError?.status,
					code: createError?.code
				});

				const definiteRejection =
					!data.user && [400, 401, 403, 422, 429].includes(createError?.status ?? 0);
				await recordCreationOutcome(
					definiteRejection ? 'failure' : 'uncertain',
					data.user?.id ?? null
				);
				return fail(502, {
					message: definiteRejection
						? 'Akun belum berhasil dibuat. Periksa apakah email sudah terdaftar dan password memenuhi kebijakan Supabase.'
						: 'Hasil pembuatan akun belum bisa dipastikan. Periksa daftar Users sebelum mencoba lagi.',
					values
				});
			}

			createdUserId = data.user.id;
		} catch {
			await recordCreationOutcome('uncertain');
			return fail(503, {
				message: 'Koneksi terputus saat membuat akun. Periksa daftar Users sebelum mencoba lagi.',
				values
			});
		}

		let membershipCreated = false;
		let forbidden = false;

		try {
			const result = await createCmsUserMembership(
				actor!.userId,
				createdUserId,
				role,
				{ name, position },
				correlationId
			);

			membershipCreated = result.status === 'ok';
			forbidden = result.status === 'forbidden';
		} catch {
			try {
				const persisted = await getCmsUser(createdUserId);

				if (persisted) {
					if (
						persisted.role === role &&
						persisted.name === name &&
						persisted.position === position &&
						persisted.isActive &&
						!persisted.deletionStartedAt
					) {
						membershipCreated = true;
					} else {
						await recordCreationOutcome('uncertain', createdUserId);
						return fail(503, {
							message:
								'Status akun berubah selama pembuatan. Periksa daftar Users sebelum mencoba lagi.',
							values
						});
					}
				}
			} catch {
				await recordCreationOutcome('uncertain', createdUserId);
				return fail(503, {
					message:
						'Status pembuatan akun belum bisa dipastikan. Periksa daftar Users setelah koneksi pulih sebelum mencoba lagi.',
					values
				});
			}
		}

		if (membershipCreated) {
			throw redirect(303, '/admin/users?created=1');
		}

		let rollbackSucceeded = false;

		try {
			const { error: rollbackError } = await admin.auth.admin.deleteUser(createdUserId);
			rollbackSucceeded = !rollbackError || rollbackError.code === 'user_not_found';

			if (rollbackError && !rollbackSucceeded) {
				console.error('CMS Auth rollback failed', {
					status: rollbackError.status,
					code: rollbackError.code
				});
			}
		} catch {
			console.error('CMS Auth rollback request failed');
		}

		if (!rollbackSucceeded) {
			await recordCreationOutcome('uncertain', createdUserId);
			return fail(503, {
				message:
					'Akses CMS tidak berhasil diberikan dan pembatalan akun Auth belum selesai. Administrator perlu memeriksa akun di Supabase Authentication sebelum mencoba lagi.',
				values
			});
		}

		await recordCreationOutcome(forbidden ? 'denied' : 'failure', createdUserId);
		return fail(forbidden ? 403 : 500, {
			message: forbidden
				? 'Hak akses lo berubah. Pembuatan akun telah dibatalkan.'
				: 'Membership CMS gagal dibuat. Akun Auth telah dibatalkan.',
			values
		});
	}
};
