import assert from 'node:assert/strict';
import {
	cmsActivityEvents,
	cmsActivityOutcomeLabels,
	getCmsActivityEventDefinition
} from '../src/lib/server/cms-activity-events';

for (const [action, definition] of Object.entries(cmsActivityEvents)) {
	for (const [outcome, label] of Object.entries(cmsActivityOutcomeLabels)) {
		const event = getCmsActivityEventDefinition(action, outcome);
		assert.deepEqual(event, {
			action,
			entityType: definition.entityType,
			outcome,
			summary: `${definition.label} — ${label}`
		});
		assert.ok(event.summary.length <= 240);
	}
}

assert.throws(() => getCmsActivityEventDefinition('unknown.action', 'success'));
assert.throws(() => getCmsActivityEventDefinition('auth.login', 'unknown'));
assert.throws(() => getCmsActivityEventDefinition('__proto__', 'success'));
assert.throws(() => getCmsActivityEventDefinition('auth.login', 'constructor'));

const sensitiveSample = 'password=DO_NOT_LOG token=DO_NOT_LOG';
assert.throws(() => getCmsActivityEventDefinition(sensitiveSample, 'success'));
assert.throws(() => getCmsActivityEventDefinition('auth.login', sensitiveSample));

const event = getCmsActivityEventDefinition('user.created', 'success');
assert.deepEqual(Object.keys(event).sort(), ['action', 'entityType', 'outcome', 'summary']);
assert.equal(event.summary.includes(sensitiveSample), false);

console.log(
	'PASS audit event catalog: allowlisted actions/outcomes, fixed summaries, rejected unknown input'
);
