import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildReverseProof, verifyTraceability } from '../src/reverse-proof.js';

describe('reverse-proof', () => {
  it('verifies complete traceability', () => {
    const proof = buildReverseProof(
      ['server.ts'],
      { 'server.ts': 'build server' },
      { 'server.ts': 'Article III' },
      { 'server.ts': 'FORGE' },
      { 'server.ts': 'cold_boot' },
      { 'server.ts': 'ha_000001' }
    );
    assert.equal(proof.allVerified, true);
    assert.equal(proof.orphanArtifacts.length, 0);
  });

  it('detects orphan artifacts', () => {
    const proof = buildReverseProof(
      ['server.ts', 'orphan.ts'],
      { 'server.ts': 'build server' },
      { 'server.ts': 'Article III' },
      { 'server.ts': 'FORGE' },
      { 'server.ts': 'cold_boot' },
      { 'server.ts': 'ha_000001' }
    );
    assert.equal(proof.allVerified, false);
    assert.ok(proof.orphanArtifacts.includes('orphan.ts'));
  });

  it('verifyTraceability returns valid for complete proof', () => {
    const proof = buildReverseProof(
      ['a.ts'],
      { 'a.ts': 'instruction' },
      { 'a.ts': 'clause' },
      { 'a.ts': 'agent' },
      { 'a.ts': 'state' },
      { 'a.ts': 'worm' }
    );
    const result = verifyTraceability(proof);
    assert.equal(result.valid, true);
    assert.equal(result.orphans.length, 0);
  });
});
