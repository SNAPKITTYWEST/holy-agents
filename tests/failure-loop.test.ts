import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runFailureLoop } from '../src/failure-loop.js';

const cleanAudit = {
  security: { findings: [] },
  logic: { findings: [] }
};
const cleanProof = { allVerified: true, orphanArtifacts: [] };

const badAudit = {
  security: { findings: [{ severity: 'critical', category: 'code_injection' }] },
  logic: { findings: [] }
};
const badProof = { allVerified: false, orphanArtifacts: ['orphan.ts'] };

describe('failure-loop', () => {
  it('passes for clean audit', () => {
    const result = runFailureLoop(cleanAudit, cleanProof);
    assert.equal(result.requiresRepentance, false);
    assert.equal(result.scenarios.length, 7);
  });

  it('requires repentance for critical findings', () => {
    const result = runFailureLoop(badAudit, badProof);
    assert.equal(result.requiresRepentance, true);
    assert.ok(result.failuresFound > 0);
  });

  it('covers all 7 failure questions', () => {
    const result = runFailureLoop(cleanAudit, cleanProof);
    const ids = result.scenarios.map(s => s.id);
    assert.ok(ids.includes('F-001'));
    assert.ok(ids.includes('F-007'));
  });
});
