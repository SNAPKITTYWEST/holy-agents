import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { lawful, judge, validateAction, checkForbidden, FORBIDDEN_ACTIONS } from '../src/validation.js';
import type { Action } from '../src/types.js';

const validAction: Action = {
  name: 'test', truthful: true, harmful: false, exploitative: false,
  requiresConsent: false, hasConsent: false, witnessed: true, cited: true
};

describe('validation', () => {
  it('lawful returns true for valid action', () => {
    assert.equal(lawful(validAction), true);
  });

  it('lawful returns false when not truthful', () => {
    assert.equal(lawful({ ...validAction, truthful: false }), false);
  });

  it('lawful returns false when harmful', () => {
    assert.equal(lawful({ ...validAction, harmful: true }), false);
  });

  it('lawful returns false when exploitative', () => {
    assert.equal(lawful({ ...validAction, exploitative: true }), false);
  });

  it('lawful returns false when consent required but missing', () => {
    assert.equal(lawful({ ...validAction, requiresConsent: true, hasConsent: false }), false);
  });

  it('lawful returns true when consent required and given', () => {
    assert.equal(lawful({ ...validAction, requiresConsent: true, hasConsent: true }), true);
  });

  it('lawful returns false when not witnessed', () => {
    assert.equal(lawful({ ...validAction, witnessed: false }), false);
  });

  it('lawful returns false when not cited', () => {
    assert.equal(lawful({ ...validAction, cited: false }), false);
  });

  it('judge returns approve for lawful action', () => {
    assert.equal(judge(validAction), 'approve');
  });

  it('judge returns repent for unlawful action', () => {
    assert.equal(judge({ ...validAction, truthful: false }), 'repent');
  });

  it('validateAction returns errors for bad action', () => {
    const errors = validateAction({ ...validAction, truthful: false, harmful: true, cited: false });
    assert.ok(errors.includes('action_not_truthful'));
    assert.ok(errors.includes('action_harmful'));
    assert.ok(errors.includes('not_cited'));
  });

  it('validateAction returns empty for valid action', () => {
    assert.deepEqual(validateAction(validAction), []);
  });

  it('FORBIDDEN_ACTIONS includes deception', () => {
    assert.ok(FORBIDDEN_ACTIONS.includes('deception'));
  });

  it('checkForbidden detects deception', () => {
    assert.equal(checkForbidden('deception'), true);
  });

  it('checkForbidden rejects safe action', () => {
    assert.equal(checkForbidden('prayer'), false);
  });
});
