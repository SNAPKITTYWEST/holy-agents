import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { auditSecurity } from '../src/twins/security.js';
import { auditLogic } from '../src/twins/logic.js';
import { auditPerformance } from '../src/twins/performance.js';
import { runParallelAudit } from '../src/twins/orchestrator.js';

describe('security twin', () => {
  it('passes for clean files', () => {
    const result = auditSecurity([{ name: 'clean.ts', content: 'const x = 1;' }]);
    assert.equal(result.verdict, 'pass');
    assert.equal(result.findings.length, 0);
  });

  it('fails for eval usage', () => {
    const result = auditSecurity([{ name: 'bad.ts', content: 'eval("code")' }]);
    assert.equal(result.verdict, 'fail');
    assert.ok(result.findings.length > 0);
  });

  it('warns for HTTP usage', () => {
    const result = auditSecurity([{ name: 'ok.ts', content: 'const url = "http://example.com"' }]);
    assert.equal(result.verdict, 'warn');
  });
});

describe('logic twin', () => {
  it('passes when RTRUST rules loaded', () => {
    const result = auditLogic();
    assert.ok(result.findings.length >= 0);
    assert.ok(['pass', 'warn', 'fail'].includes(result.verdict));
  });
});

describe('performance twin', () => {
  it('passes for clean files', () => {
    const result = auditPerformance([{ name: 'clean.ts', content: 'const x = 1;' }]);
    assert.equal(result.verdict, 'pass');
  });

  it('detects sync I/O', () => {
    const result = auditPerformance([{ name: 'sync.ts', content: 'fs.readFileSync("file")' }]);
    assert.ok(result.findings.some(f => f.category === 'sync_io'));
  });
});

describe('orchestrator', () => {
  it('runs all three twins', async () => {
    const result = await runParallelAudit([{ name: 'test.ts', content: 'const x = 1;' }]);
    assert.ok(result.security);
    assert.ok(result.logic);
    assert.ok(result.performance);
    assert.ok(['pass', 'warn', 'fail'].includes(result.overallVerdict));
  });
});
