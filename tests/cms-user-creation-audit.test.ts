import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transform } from 'esbuild';
import * as access from '../src/lib/server/cms-user-access';

const adminId = '00000000-0000-4000-8000-000000000051';
const createdId = '00000000-0000-4000-8000-000000000052';
const password = 'SYNTHETIC_PASSWORD_DO_NOT_LOG_123';
const actor = {
	userId: adminId,
	name: 'Synthetic Admin',
	role: 'admin' as const,
	isActive: true,
	deletionStartedAt: null
};

type AuditInput = {
	actor: unknown;
	action: string;
	outcome: string;
	entityId: string | null;
	correlationId: string;
};
type Options = {
	pendingFails?: boolean;
	authReject?: boolean;
	authThrows?: boolean;
};
type State = {
	options: Options;
	logs: AuditInput[];
	calls: string[];
};

let state: State;
const bridge = {
	access,
	queries: {
		getCmsUser: async (id: string) => {
			state.calls.push('membership.read');
			return id === adminId ? actor : null;
		},
		insertCmsActivityLog: async (input: AuditInput) => {
			state.calls.push(`audit.${input.outcome}`);
			if (input.outcome === 'pending' && state.options.pendingFails) {
				throw new Error('Synthetic audit outage');
			}
			state.logs.push(input);
			return { id: 'synthetic-event' };
		},
		createCmsUserMembership: async (
			actorUserId: string,
			userId: string,
			role: string,
			profile: unknown,
			correlationId: string
		) => {
			state.calls.push('membership.create');
			assert.equal(actorUserId, adminId);
			assert.equal(userId, createdId);
			assert.equal(role, 'staff');
			assert.deepEqual(profile, { name: 'Synthetic User', position: 'Synthetic Position' });
			state.logs.push({
				actor,
				action: 'user.created',
				outcome: 'success',
				entityId: userId,
				correlationId
			});
			return { status: 'ok' };
		}
	},
	admin: {
		auth: {
			admin: {
				createUser: async () => {
					state.calls.push('auth.create');
					if (state.options.authThrows) throw new Error('Synthetic network uncertainty');
					if (state.options.authReject) {
						return {
							data: { user: null },
							error: { status: 422, code: 'email_exists' }
						};
					}
					return { data: { user: { id: createdId } }, error: null };
				},
				deleteUser: async () => {
					state.calls.push('auth.delete');
					return { error: null };
				}
			}
		}
	}
};

const globals = globalThis as typeof globalThis & {
	__preciousCreationAuditTest?: typeof bridge;
};
const moduleUrl = (source: string) =>
	`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;

let source = readFileSync('src/routes/admin/users/new/+page.server.ts', 'utf8');
const replacements = [
	['@sveltejs/kit', import.meta.resolve('@sveltejs/kit')],
	[
		'$lib/server/cms-user-access',
		moduleUrl(`
		const access = globalThis.__preciousCreationAuditTest.access;
		export const assignableCmsRoles = access.assignableCmsRoles;
		export const canAccessUserManagement = access.canAccessUserManagement;
		export const cmsRoles = access.cmsRoles;
	`)
	],
	[
		'$lib/server/db/queries',
		moduleUrl(`
		const queries = globalThis.__preciousCreationAuditTest.queries;
		export const createCmsUserMembership = queries.createCmsUserMembership;
		export const getCmsUser = queries.getCmsUser;
		export const insertCmsActivityLog = queries.insertCmsActivityLog;
	`)
	],
	[
		'$lib/server/supabase-admin',
		moduleUrl(`
		export const createSupabaseAdminClient = () => globalThis.__preciousCreationAuditTest.admin;
	`)
	]
] as const;

for (const [before, after] of replacements) {
	assert.equal(source.split(`'${before}'`).length - 1, 1, `Expected one import: ${before}`);
	source = source.replace(`'${before}'`, `'${after}'`);
}
const compiled = await transform(source, { loader: 'ts', format: 'esm', target: 'node22' });
const originalFetch = globalThis.fetch;
const originalConsoleError = console.error;
const consoleEvents: unknown[][] = [];
assert.equal(globals.__preciousCreationAuditTest, undefined);

try {
	globals.__preciousCreationAuditTest = bridge;
	globalThis.fetch = async () => {
		throw new Error('Unexpected network request in mock test');
	};
	console.error = (...args: unknown[]) => {
		consoleEvents.push(args);
	};
	const route = await import(moduleUrl(compiled.code));

	async function run(options: Options = {}) {
		state = { options, logs: [], calls: [] };
		const form = new FormData();
		for (const [key, value] of Object.entries({
			name: 'Synthetic User',
			position: 'Synthetic Position',
			email: 'synthetic@example.test',
			password,
			role: 'staff'
		}))
			form.set(key, value);
		try {
			return await route.actions.default({
				locals: { cmsUser: actor },
				request: new Request('http://localhost/admin/users/new', { method: 'POST', body: form })
			});
		} catch (error) {
			if (error && typeof error === 'object' && 'status' in error && 'location' in error) {
				return error;
			}
			throw error;
		}
	}

	assert.equal((await run({ pendingFails: true })).status, 503);
	assert.equal(state!.calls.includes('auth.create'), false);
	assert.equal(state!.logs.length, 0);

	assert.equal((await run()).status, 303);
	assert.ok(state!.calls.indexOf('audit.pending') < state!.calls.indexOf('auth.create'));
	assert.deepEqual(
		state!.logs.map((event) => event.outcome),
		['pending', 'success']
	);
	assert.equal(state!.logs[0].correlationId, state!.logs[1].correlationId);
	assert.equal(state!.logs[0].entityId, null);
	assert.equal(state!.logs[1].entityId, createdId);
	assert.equal(JSON.stringify(state!.logs).includes(password), false);

	assert.equal((await run({ authReject: true })).status, 502);
	assert.deepEqual(
		state!.logs.map((event) => event.outcome),
		['pending', 'failure']
	);
	assert.equal(state!.calls.includes('membership.create'), false);

	assert.equal((await run({ authThrows: true })).status, 503);
	assert.deepEqual(
		state!.logs.map((event) => event.outcome),
		['pending', 'uncertain']
	);
	assert.equal(state!.calls.includes('membership.create'), false);
	assert.equal(state!.calls.includes('auth.delete'), false);
	assert.equal(JSON.stringify(consoleEvents).includes(password), false);

	console.log(
		'PASS creation audit route: pending gate, success correlation, Auth rejection and network uncertainty'
	);
} finally {
	delete globals.__preciousCreationAuditTest;
	globalThis.fetch = originalFetch;
	console.error = originalConsoleError;
}
