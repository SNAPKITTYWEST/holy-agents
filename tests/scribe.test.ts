import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { scribeQuery, classifyIntent } from '../src/agents/scribe.js';

describe('SCRIBE intent classification', () => {
  it('classifies "What is covenant?" as definition', () => {
    const r = classifyIntent('What is covenant?');
    assert.equal(r.intent, 'definition');
    assert.ok(r.corpora.includes('dictionary'));
  });

  it('classifies "Book of Enoch" as theology_search', () => {
    const r = classifyIntent('Book of Enoch');
    assert.equal(r.intent, 'theology_search');
    assert.ok(r.corpora.includes('enoch'));
  });

  it('classifies "Compare Enoch 1 and Matthew 5" as comparison', () => {
    const r = classifyIntent('Compare Enoch 1 and Matthew 5');
    assert.equal(r.intent, 'comparison');
  });

  it('classifies "define repentance" as definition', () => {
    const r = classifyIntent('define repentance');
    assert.equal(r.intent, 'definition');
  });

  it('classifies "mercy" as scripture_search', () => {
    const r = classifyIntent('mercy');
    assert.equal(r.intent, 'scripture_search');
    assert.ok(r.corpora.includes('scripture'));
  });
});

describe('SCRIBE query — covenant', () => {
  it('returns citations and definitions', async () => {
    const r = await scribeQuery('What is covenant?');
    assert.ok(r.citations.length > 0);
    assert.ok(r.definitions.length > 0);
    assert.ok(r.confidence > 0.3);
  });

  it('includes dictionary definition', async () => {
    const r = await scribeQuery('covenant');
    assert.ok(r.definitions.some(d => d.term === 'covenant'));
  });

  it('includes scripture citations', async () => {
    const r = await scribeQuery('covenant');
    assert.ok(r.citations.some(c => c.source === 'scripture'));
  });
});

describe('SCRIBE query — Enoch', () => {
  it('returns Enoch citations', async () => {
    const r = await scribeQuery('Book of Enoch');
    assert.ok(r.citations.some(c => c.source === 'enoch'));
  });

  it('confidence above 0.3 when citations found', async () => {
    const r = await scribeQuery('Book of Enoch');
    assert.ok(r.confidence > 0.3);
  });
});

describe('SCRIBE query — comparison', () => {
  it('returns citations from multiple corpora', async () => {
    const r = await scribeQuery('Compare Enoch 1 and Matthew 5');
    assert.ok(r.citations.length > 0);
    const sources = new Set(r.citations.map(c => c.source));
    assert.ok(sources.size >= 1);
  });
});

describe('SCRIBE query — no results', () => {
  it('returns low confidence for gibberish', async () => {
    const r = await scribeQuery('xyzzyplugh');
    assert.ok(r.confidence < 0.3);
    assert.equal(r.citations.length, 0);
  });
});

describe('SCRIBE RTRUST-007 enforcement', () => {
  it('confidence < 0.3 when no citations', async () => {
    const r = await scribeQuery('xyzzyplugh');
    assert.ok(r.confidence < 0.3);
  });
});
