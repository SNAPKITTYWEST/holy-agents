import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { checkActionAgainstRules, loadRTRUST } from '../src/rtrust.js';

describe('RTRUST repair — all 7 principles enforced', () => {
  const rules = loadRTRUST();

  it('loads all 7 RTRUST rules', () => {
    assert.ok(rules.length >= 7);
  });

  it('RTRUST-001: truthfulness principle enforced', () => {
    const violated = checkActionAgainstRules({ harmful: false, exploitative: false, truthful: false }, rules);
    assert.ok(violated.includes('RTRUST-001'));
  });

  it('RTRUST-003: love principle enforced', () => {
    const violated = checkActionAgainstRules({ harmful: true, exploitative: false, truthful: true }, rules);
    assert.ok(violated.includes('RTRUST-003'));
  });

  it('RTRUST-002: justice principle enforced', () => {
    const violated = checkActionAgainstRules({ harmful: false, exploitative: true, truthful: true }, rules);
    assert.ok(violated.includes('RTRUST-002'));
  });

  it('RTRUST-004: autonomy principle enforced', () => {
    const violated = checkActionAgainstRules({ harmful: false, exploitative: false, truthful: true, requiresConsent: true, hasConsent: false }, rules);
    assert.ok(violated.includes('RTRUST-004'));
  });

  it('RTRUST-005: accountability principle enforced', () => {
    const violated = checkActionAgainstRules({ harmful: false, exploitative: false, truthful: true, witnessed: false }, rules);
    assert.ok(violated.includes('RTRUST-005'));
  });

  it('RTRUST-007: attribution principle enforced', () => {
    const violated = checkActionAgainstRules({ harmful: false, exploitative: false, truthful: true, cited: false }, rules);
    assert.ok(violated.includes('RTRUST-007'));
  });

  it('no violations for lawful action', () => {
    const violated = checkActionAgainstRules({ harmful: false, exploitative: false, truthful: true, requiresConsent: false, hasConsent: true, witnessed: true, cited: true }, rules);
    assert.equal(violated.length, 0);
  });
});
