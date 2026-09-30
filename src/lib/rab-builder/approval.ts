type Actor = { userId: string; role: string; isActive: boolean } | null;
type ApprovalRab = { status: string; createdByUserId: string | null };

const requestRoles = new Set(['manager', 'staff']);
const approvalRoles = new Set(['admin', 'director']);

export function approvalPermissions(actor: Actor, rab: ApprovalRab) {
	return {
		canRequest: Boolean(actor?.isActive && requestRoles.has(actor.role) && rab.status === 'draft'),
		canApprove: Boolean(
			actor?.isActive &&
			approvalRoles.has(actor.role) &&
			(rab.status === 'internal_review' ||
				(rab.status === 'draft' && rab.createdByUserId === actor.userId))
		)
	};
}

export const approvalLabels: Record<string, string> = {
	draft: 'Draft',
	internal_review: 'Review internal',
	internal_approved: 'Disetujui internal'
};
