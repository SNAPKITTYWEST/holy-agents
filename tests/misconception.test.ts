import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateMisconceptions } from '../src/agents/misconception.js';

describe('MISCONCEPTION agent', () => {
  it('detects analogy_proof when synthesis uses analogy language', async () => {
    const results = await generateMisconceptions(
      'Entanglement and covenant are similar',
      'Entanglement is like covenant because both involve connection'
    );
    assert.ok(results.length > 0);
    assert.ok(results.some(r => r.classification === 'analogy_proof'));
  });

  it('detects confidence_correctness when synthesis uses absolute language', async () => {
    const results = await generateMisconceptions(
      'Quantum mechanics clearly proves God exists',
      'This clearly demonstrates that quantum mechanics proves the divine'
    );
    assert.ok(results.length > 0);
    assert.ok(results.some(r => r.classification === 'confidence_correctness'));
  });

  it('detects authority_evidence when citing scientists', async () => {
    const results = await generateMisconceptions(
      'Einstein believed in God',
      'Einstein said God does not play dice therefore God exists'
    );
    assert.ok(results.length > 0);
    assert.ok(results.some(r => r.classification === 'authority_evidence'));
  });

  it('returns empty for neutral text', async () => {
    const results = await generateMisconceptions(
      'The sky is blue',
      'Water is wet and flows downhill'
    );
    assert.equal(results.length, 0);
  });

  it('detects multiple patterns in same text', async () => {
    const results = await generateMisconceptions(
      'Both are similar therefore proves',
      'Both quantum and theology are similar, this clearly proves they are identical'
    );
    assert.ok(results.length >= 2);
  });
});
