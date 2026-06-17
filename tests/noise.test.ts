import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateNoise } from '../src/agents/noise.js';

describe('NOISE agent', () => {
  it('generates semantic_drift noise for quantum topics', async () => {
    const results = await generateNoise('quantum consciousness');
    assert.ok(results.length > 0);
    assert.ok(results.some(r => r.type === 'semantic_drift'));
  });

  it('generates false_connection noise for god topics', async () => {
    const results = await generateNoise('god and soul');
    assert.ok(results.length > 0);
    assert.ok(results.some(r => r.type === 'false_connection'));
  });

  it('generates random noise patterns', async () => {
    const results = await generateNoise('entanglement observer');
    assert.ok(results.length > 0);
    assert.ok(results.every(r => r.claim.length > 0));
    assert.ok(results.every(r => r.description.length > 0));
    assert.ok(results.every(r => ['high', 'medium', 'low'].includes(r.severity)));
  });

  it('always generates at least one noise for any topic', async () => {
    const results = await generateNoise('random topic');
    assert.ok(results.length > 0);
  });

  it('noise claims have valid structure', async () => {
    const results = await generateNoise('wave function collapse');
    for (const r of results) {
      assert.ok(typeof r.claim === 'string');
      assert.ok(typeof r.type === 'string');
      assert.ok(typeof r.description === 'string');
      assert.ok(['high', 'medium', 'low'].includes(r.severity));
    }
  });
});
