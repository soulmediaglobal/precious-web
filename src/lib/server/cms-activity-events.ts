export const cmsActivityEvents = {
	'auth.login': { entityType: 'auth', label: 'Login CMS' },
	'auth.logout': { entityType: 'auth', label: 'Logout CMS' },
	'user.created': { entityType: 'user', label: 'Pembuatan user' },
	'user.profile_updated': { entityType: 'user', label: 'Perubahan profil user' },
	'user.access_updated': { entityType: 'user', label: 'Perubahan role atau status akses user' },
	'user.deleted': { entityType: 'user', label: 'Penghapusan user' },
	'client.created': { entityType: 'client', label: 'Pembuatan client' },
	'client.updated': { entityType: 'client', label: 'Perubahan client' },
	'client.deleted': { entityType: 'client', label: 'Penghapusan client' },
	'project.created': { entityType: 'project', label: 'Pembuatan project' },
	'project.updated': { entityType: 'project', label: 'Perubahan project' },
	'project.deleted': { entityType: 'project', label: 'Penghapusan project' },
	'portfolio.created': { entityType: 'portfolio', label: 'Pembuatan portfolio' },
	'portfolio.updated': { entityType: 'portfolio', label: 'Perubahan portfolio' },
	'portfolio.deleted': { entityType: 'portfolio', label: 'Penghapusan portfolio' },
	'team.created': { entityType: 'team', label: 'Pembuatan anggota team' },
	'team.updated': { entityType: 'team', label: 'Perubahan anggota team' },
	'team.deleted': { entityType: 'team', label: 'Penghapusan anggota team' },
	'file.uploaded': { entityType: 'file', label: 'Upload file' },
	'file.deleted': { entityType: 'file', label: 'Penghapusan file' },
	'rab.created': { entityType: 'rab', label: 'Pembuatan RAB' },
	'rab.updated': { entityType: 'rab', label: 'Perubahan RAB' },
	'rab.deleted': { entityType: 'rab', label: 'Penghapusan RAB' },
	'rab.approval_requested': { entityType: 'rab', label: 'Permintaan approval RAB' },
	'rab.approved': { entityType: 'rab', label: 'Approval internal RAB' }
} as const;

export const cmsActivityOutcomeLabels = {
	success: 'Berhasil',
	failure: 'Gagal',
	denied: 'Ditolak',
	pending: 'Proses dimulai, hasil belum tercatat',
	uncertain: 'Hasil belum dapat dipastikan'
} as const;

export type CmsActivityAction = keyof typeof cmsActivityEvents;
export type CmsActivityOutcome = keyof typeof cmsActivityOutcomeLabels;

// Never derive summaries from form data, credentials or raw error messages.
export function getCmsActivityEventDefinition(action: string, outcome: string) {
	if (!Object.hasOwn(cmsActivityEvents, action)) {
		throw new Error('Unsupported CMS activity action');
	}
	if (!Object.hasOwn(cmsActivityOutcomeLabels, outcome)) {
		throw new Error('Unsupported CMS activity outcome');
	}

	const safeAction = action as CmsActivityAction;
	const safeOutcome = outcome as CmsActivityOutcome;
	const definition = cmsActivityEvents[safeAction];

	return {
		action: safeAction,
		entityType: definition.entityType,
		outcome: safeOutcome,
		summary: `${definition.label} — ${cmsActivityOutcomeLabels[safeOutcome]}`
	};
}
