import assert from 'node:assert/strict';
import {
	assignableCmsRoles,
	canAccessLogManagement,
	canAccessUserManagement,
	canManageCmsRole
} from '../src/lib/server/cms-user-access';

const active = (role: 'admin' | 'director' | 'manager' | 'staff') => ({
	role,
	isActive: true
});

assert.equal(canAccessUserManagement(active('admin')), true);
assert.equal(canAccessUserManagement(active('director')), true);
assert.equal(canAccessUserManagement(active('manager')), false);
assert.equal(canAccessUserManagement(active('staff')), false);
assert.equal(canAccessUserManagement({ role: 'admin', isActive: false }), false);
assert.equal(canAccessUserManagement(null), false);

assert.deepEqual(assignableCmsRoles(active('admin')), ['admin', 'director', 'manager', 'staff']);
assert.deepEqual(assignableCmsRoles(active('director')), ['director', 'manager', 'staff']);
assert.deepEqual(assignableCmsRoles(active('manager')), []);
assert.deepEqual(assignableCmsRoles(active('staff')), []);

assert.equal(canManageCmsRole(active('admin'), 'admin'), true);
assert.equal(canManageCmsRole(active('admin'), 'director'), true);
assert.equal(canManageCmsRole(active('director'), 'admin'), false);
assert.equal(canManageCmsRole(active('director'), 'director'), true);
assert.equal(canManageCmsRole(active('director'), 'manager'), true);
assert.equal(canManageCmsRole(active('director'), 'staff'), true);
assert.equal(canManageCmsRole(active('manager'), 'staff'), false);

assert.equal(canAccessLogManagement(active('admin')), true);
assert.equal(canAccessLogManagement(active('director')), false);
assert.equal(canAccessLogManagement(active('manager')), false);
assert.equal(canAccessLogManagement(active('staff')), false);
for (const role of ['admin', 'director', 'manager', 'staff'] as const) {
	assert.equal(canAccessLogManagement({ role, isActive: false }), false);
}
assert.equal(canAccessLogManagement(null), false);
console.log('PASS CMS user access and Admin-only log access');
