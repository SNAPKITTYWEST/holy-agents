import type { TwinAudit, Finding } from './types.js';
import { loadRTRUST, checkActionAgainstRules } from '../rtrust.js';

export function auditLogic(): TwinAudit {
  const findings: Finding[] = [];
  let idCounter = 0;

  const rules = loadRTRUST();

  if (rules.length === 0) {
    findings.push({
      id: `LOG-${String(++idCounter).padStart(3, '0')}`,
      severity: 'critical',
      category: 'constitution_missing',
      description: 'No RTRUST rules loaded — constitution is empty',
      remediation: 'Populate constitution/RTRUST.md with valid rules'
    });
  }

  const requiredPrinciples = ['truthfulness', 'justice', 'love', 'autonomy', 'accountability', 'mercy', 'attribution'];
  const loadedPrinciples = rules.map(r => r.principle);
  for (const p of requiredPrinciples) {
    if (!loadedPrinciples.includes(p)) {
      findings.push({
        id: `LOG-${String(++idCounter).padStart(3, '0')}`,
        severity: 'high',
        category: 'missing_principle',
        description: `RTRUST rule for principle "${p}" not found`,
        remediation: `Add RTRUST rule covering principle: ${p}`
      });
    }
  }

  const ruleIds = rules.map(r => r.rule_id);
  const duplicates = ruleIds.filter((id, i) => ruleIds.indexOf(id) !== i);
  if (duplicates.length > 0) {
    findings.push({
      id: `LOG-${String(++idCounter).padStart(3, '0')}`,
      severity: 'medium',
      category: 'duplicate_rules',
      description: `Duplicate rule IDs: ${duplicates.join(', ')}`,
      remediation: 'Remove duplicate RTRUST rules'
    });
  }

  const testAction = { harmful: true, exploitative: false, truthful: true };
  const violated = checkActionAgainstRules(testAction, rules);
  if (!violated.includes('RTRUST-003')) {
    findings.push({
      id: `LOG-${String(++idCounter).padStart(3, '0')}`,
      severity: 'high',
      category: 'logic_gap',
      description: 'Harmful action not detected by RTRUST-003',
      remediation: 'Verify RTRUST-003 rule logic'
    });
  }

  const high = findings.filter(f => f.severity === 'high' || f.severity === 'critical').length;
  const medium = findings.filter(f => f.severity === 'medium').length;
  const low = findings.filter(f => f.severity === 'low').length;

  return {
    twin: 'logic',
    verdict: high > 0 ? 'fail' : medium > 0 ? 'warn' : 'pass',
    findings,
    passed: rules.length,
    failed: high,
    warnings: medium + low,
    duration_ms: 0
  };
}
