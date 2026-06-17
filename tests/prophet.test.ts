import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { prophesy } from '../src/agents/prophet.js';
import type { Action } from '../src/types.js';

const validAction: Action = {
  name: 'test', truthful: true, harmful: false, exploitative: false,
  requiresConsent: false, hasConsent: false, witnessed: true, cited: true
};

describe('prophet', () => {
  it('returns none risk for valid action', () => {
    const result = prophesy(validAction);
    assert.equal(result.riskLevel, 'none');
    assert.equal(result.warnings.length, 0);
  });

  it('flags deception for untruthful action', () => {
    const result = prophesy({ ...validAction, truthful: false });
    assert.equal(result.riskLevel, 'high');
    assert.ok(result.flags.includes('deception'));
  });

  it('flags harm for harmful action', () => {
    const result = prophesy({ ...validAction, harmful: true });
    assert.equal(result.riskLevel, 'high');
    assert.ok(result.flags.includes('harm'));
  });

  it('flags exploitation', () => {
    const result = prophesy({ ...validAction, exploitative: true });
    assert.equal(result.riskLevel, 'critical');
    assert.ok(result.flags.includes('exploitation'));
  });

  it('flags coercion when consent required but missing', () => {
    const result = prophesy({ ...validAction, requiresConsent: true, hasConsent: false });
    assert.equal(result.riskLevel, 'medium');
    assert.ok(result.flags.includes('coercion'));
  });

  it('recommends reject for high risk', () => {
    const result = prophesy({ ...validAction, harmful: true });
    assert.equal(result.recommendation, 'reject');
  });
});
