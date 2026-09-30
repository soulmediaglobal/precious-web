export const cmsRoles = ['admin', 'director', 'manager', 'staff'] as const;

export type CmsRole = (typeof cmsRoles)[number];

type Actor = {
	role: CmsRole;
	isActive: boolean;
} | null;

export function canAccessUserManagement(actor: Actor) {
	return Boolean(actor?.isActive && (actor.role === 'admin' || actor.role === 'director'));
}

export function assignableCmsRoles(actor: Actor): CmsRole[] {
	if (!actor?.isActive) return [];

	if (actor.role === 'admin') {
		return [...cmsRoles];
	}

	if (actor.role === 'director') {
		return ['director', 'manager', 'staff'];
	}

	return [];
}

export function canManageCmsRole(actor: Actor, targetRole: CmsRole) {
	return canAccessUserManagement(actor) && assignableCmsRoles(actor).includes(targetRole);
}
