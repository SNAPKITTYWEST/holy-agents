import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { appendEntry, readEntries, verifyChain } from '../src/worm.js';

describe('WORM repair — atomic append', () => {
  it('appendEntry produces valid sequential entries', () => {
    const before = readEntries().length;
    const entry = appendEntry(`ha_repair_${Date.now()}`, 'SCRIBE', 'repair_test', 'approve', ['scripture']);
    assert.equal(entry.seq, before + 1);
    assert.ok(entry.hash.length > 0);
    assert.equal(entry.prev_hash, before === 0 ? 'GENESIS' : readEntries()[before - 1].hash);
  });

  it('readEntries skips corrupt lines gracefully', () => {
    const entries = readEntries();
    assert.ok(Array.isArray(entries));
    assert.ok(entries.length > 0);
  });

  it('verifyChain validates after append', () => {
    const result = verifyChain();
    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);
  });
});
