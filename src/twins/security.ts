import type { TwinAudit, Finding } from './types.js';

const FORBIDDEN_PATTERNS = [
  { pattern: /eval\s*\(/, category: 'code_injection', description: 'eval() usage detected — code injection risk', severity: 'critical' as const },
  { pattern: /new\s+Function\s*\(/, category: 'code_injection', description: 'new Function() detected — code injection risk', severity: 'critical' as const },
  { pattern: /exec\s*\(/, category: 'command_injection', description: 'exec() usage detected — command injection risk', severity: 'critical' as const },
  { pattern: /child_process/, category: 'command_injection', description: 'child_process import detected', severity: 'high' as const },
  { pattern: /\.env/, category: 'secret_exposure', description: '.env file reference detected', severity: 'medium' as const },
  { pattern: /password|secret|token|api_key/i, category: 'secret_exposure', description: 'Potential secret in source code', severity: 'high' as const },
  { pattern: /http:\/\//, category: 'insecure_transport', description: 'HTTP (not HTTPS) usage detected', severity: 'medium' as const },
  { pattern: /innerHTML/, category: 'xss', description: 'innerHTML usage — XSS risk', severity: 'high' as const },
  { pattern: /document\.write/, category: 'xss', description: 'document.write() — XSS risk', severity: 'medium' as const },
  { pattern: /Math\.random/, category: 'weak_randomness', description: 'Math.random() — not cryptographically secure', severity: 'low' as const },
];

export function auditSecurity(sourceFiles: { name: string; content: string }[]): TwinAudit {
  const findings: Finding[] = [];
  let idCounter = 0;

  for (const file of sourceFiles) {
    const lines = file.content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      for (const { pattern, category, description, severity } of FORBIDDEN_PATTERNS) {
        if (pattern.test(lines[i])) {
          findings.push({
            id: `SEC-${String(++idCounter).padStart(3, '0')}`,
            severity,
            category,
            description: `${file.name}:${i + 1} — ${description}`,
            file: file.name,
            line: i + 1,
            remediation: `Remove or replace ${category} pattern`
          });
        }
      }
    }
  }

  const critical = findings.filter(f => f.severity === 'critical').length;
  const high = findings.filter(f => f.severity === 'high').length;
  const medium = findings.filter(f => f.severity === 'medium').length;
  const low = findings.filter(f => f.severity === 'low').length;

  const verdict = critical > 0 ? 'fail' : high > 0 || medium > 0 ? 'warn' : 'pass';

  return {
    twin: 'security',
    verdict,
    findings,
    passed: sourceFiles.length - (critical > 0 ? 1 : 0),
    failed: critical,
    warnings: high + medium + low,
    duration_ms: 0
  };
}
