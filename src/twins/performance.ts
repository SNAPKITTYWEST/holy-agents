import type { TwinAudit, Finding } from './types.js';

export function auditPerformance(sourceFiles: { name: string; content: string }[]): TwinAudit {
  const findings: Finding[] = [];
  let idCounter = 0;

  for (const file of sourceFiles) {
    const lines = file.content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (/while\s*\(\s*true\s*\)/.test(line) && !line.includes('break')) {
        findings.push({
          id: `PERF-${String(++idCounter).padStart(3, '0')}`,
          severity: 'high',
          category: 'infinite_loop',
          description: `${file.name}:${i + 1} — Potential infinite loop without break`,
          file: file.name, line: i + 1,
          remediation: 'Add termination condition or timeout'
        });
      }

      if (/JSON\.parse/.test(line) && !line.includes('try')) {
        const surrounding = lines.slice(Math.max(0, i - 2), Math.min(lines.length, i + 3)).join('\n');
        if (!surrounding.includes('try')) {
          findings.push({
            id: `PERF-${String(++idCounter).padStart(3, '0')}`,
            severity: 'medium',
            category: 'uncaught_parse',
            description: `${file.name}:${i + 1} — JSON.parse without try/catch`,
            file: file.name, line: i + 1,
            remediation: 'Wrap JSON.parse in try/catch'
          });
        }
      }

      if (/fs\.readFileSync/.test(line)) {
        findings.push({
          id: `PERF-${String(++idCounter).padStart(3, '0')}`,
          severity: 'low',
          category: 'sync_io',
          description: `${file.name}:${i + 1} — Synchronous file read`,
          file: file.name, line: i + 1,
          remediation: 'Consider async file operations'
        });
      }

      if (line.length > 200) {
        findings.push({
          id: `PERF-${String(++idCounter).padStart(3, '0')}`,
          severity: 'info',
          category: 'long_line',
          description: `${file.name}:${i + 1} — Line exceeds 200 characters (${line.length})`,
          file: file.name, line: i + 1,
          remediation: 'Consider breaking long lines'
        });
      }
    }
  }

  const high = findings.filter(f => f.severity === 'high').length;
  const medium = findings.filter(f => f.severity === 'medium').length;
  const low = findings.filter(f => f.severity === 'low').length;

  return {
    twin: 'performance',
    verdict: high > 0 ? 'fail' : medium > 0 ? 'warn' : 'pass',
    findings,
    passed: sourceFiles.length - (high > 0 ? 1 : 0),
    failed: high,
    warnings: medium + low,
    duration_ms: 0
  };
}
