type Actor = { userId: string; role: string; isActive: boolean } | null;
type ApprovalRab = { status: string; createdByUserId: string | null };

export function approvalPermissions(actor: Actor, rab: ApprovalRab) {
	return {
		canRequest: Boolean(actor?.isActive && actor.role === 'staff' && rab.status === 'draft'),
		canApprove: Boolean(
			actor?.isActive &&
			actor.role === 'director' &&
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
