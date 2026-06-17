import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sentinelCheck, sentinelGate } from '../src/agents/sentinel.js';
import type { Action, Verdict } from '../src/types.js';

const validAction: Action = {
  name: 'test', truthful: true, harmful: false, exploitative: false,
  requiresConsent: false, hasConsent: false, witnessed: true, cited: true
};

describe('sentinel', () => {
  it('allows valid action with signature', () => {
    const result = sentinelCheck(validAction, 'agent_sig');
    assert.equal(result.allowed, true);
  });

  it('blocks action without signature', () => {
    const result = sentinelCheck(validAction);
    assert.equal(result.allowed, false);
    assert.ok(result.violations.includes('no_agent_signature'));
  });

  it('blocks harmful action', () => {
    const result = sentinelCheck({ ...validAction, harmful: true }, 'sig');
    assert.equal(result.allowed, false);
  });

  it('sentinelGate allows with citations', () => {
    const result = sentinelGate('approve' as Verdict, 'SCRIBE', ['scripture']);
    assert.equal(result.allowed, true);
  });

  it('sentinelGate blocks without citations', () => {
    const result = sentinelGate('approve' as Verdict, 'SCRIBE', []);
    assert.equal(result.allowed, false);
  });
});
