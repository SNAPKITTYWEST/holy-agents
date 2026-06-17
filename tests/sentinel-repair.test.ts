import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sentinelCheck } from '../src/agents/sentinel.js';
import type { Action } from '../src/types.js';

describe('SENTINEL repair — RTRUST rule enforcement', () => {
  it('blocks untruthful action via RTRUST-001', () => {
    const action: Action = {
      name: 'test', truthful: false, harmful: false, exploitative: false,
      requiresConsent: false, hasConsent: false, witnessed: true, cited: true
    };
    const result = sentinelCheck(action, 'agent_sig');
    assert.equal(result.allowed, false);
    assert.ok(result.violations.some(v => v === 'RTRUST-001'));
  });

  it('blocks harmful action via RTRUST-003', () => {
    const action: Action = {
      name: 'test', truthful: true, harmful: true, exploitative: false,
      requiresConsent: false, hasConsent: false, witnessed: true, cited: true
    };
    const result = sentinelCheck(action, 'agent_sig');
    assert.equal(result.allowed, false);
    assert.ok(result.violations.some(v => v === 'RTRUST-003'));
  });

  it('blocks exploitative action via RTRUST-002', () => {
    const action: Action = {
      name: 'test', truthful: true, harmful: false, exploitative: true,
      requiresConsent: false, hasConsent: false, witnessed: true, cited: true
    };
    const result = sentinelCheck(action, 'agent_sig');
    assert.equal(result.allowed, false);
    assert.ok(result.violations.some(v => v === 'RTRUST-002'));
  });

  it('allows lawful action', () => {
    const action: Action = {
      name: 'test', truthful: true, harmful: false, exploitative: false,
      requiresConsent: false, hasConsent: false, witnessed: true, cited: true
    };
    const result = sentinelCheck(action, 'agent_sig');
    assert.equal(result.allowed, true);
  });
});
