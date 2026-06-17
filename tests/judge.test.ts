import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { judgeAction } from '../src/agents/judge.js';
import type { Action } from '../src/types.js';

const validAction: Action = {
  name: 'test', truthful: true, harmful: false, exploitative: false,
  requiresConsent: false, hasConsent: false, witnessed: true, cited: true
};

describe('judge', () => {
  it('approves valid action', () => {
    const result = judgeAction(validAction);
    assert.equal(result.verdict, 'approve');
    assert.equal(result.leanCheck, true);
  });

  it('repents for untruthful action', () => {
    const result = judgeAction({ ...validAction, truthful: false });
    assert.equal(result.verdict, 'repent');
    assert.ok(result.violatedRules.length > 0);
  });

  it('repents for harmful action', () => {
    const result = judgeAction({ ...validAction, harmful: true });
    assert.equal(result.verdict, 'repent');
  });

  it('generates proof obligation', () => {
    const result = judgeAction(validAction);
    assert.ok(result.proofObligation.includes('theorem'));
  });
});
