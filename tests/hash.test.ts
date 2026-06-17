import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sha256, verifyHash, computeEntryHash } from '../src/hash.js';

describe('hash', () => {
  it('sha256 produces consistent output', () => {
    assert.equal(sha256('hello'), sha256('hello'));
  });

  it('sha256 produces different output for different input', () => {
    assert.notEqual(sha256('hello'), sha256('world'));
  });

  it('verifyHash returns true for matching hash', () => {
    const h = sha256('test data');
    assert.equal(verifyHash('test data', h), true);
  });

  it('verifyHash returns false for mismatched hash', () => {
    assert.equal(verifyHash('test data', '0000000000000000000000000000000000000000000000000000000000000000'), false);
  });

  it('computeEntryHash produces deterministic output', () => {
    const entry = { seq: 1, prev_hash: 'GENESIS', event_id: 'ha_000001', agent: 'SCRIBE', action: 'query', verdict: 'approve', timestamp: '2026-01-01T00:00:00Z' };
    assert.equal(computeEntryHash(entry), computeEntryHash(entry));
  });

  it('computeEntryHash changes with different seq', () => {
    const base = { seq: 1, prev_hash: 'GENESIS', event_id: 'ha_000001', agent: 'SCRIBE', action: 'query', verdict: 'approve', timestamp: '2026-01-01T00:00:00Z' };
    assert.notEqual(computeEntryHash(base), computeEntryHash({ ...base, seq: 2 }));
  });
});
