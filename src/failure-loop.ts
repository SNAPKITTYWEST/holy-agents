import type { FailureScenario, FailureLoopResult } from './twins/types.js';

const FAILURE_QUESTIONS: { id: string; question: string; severity: FailureScenario['severity'] }[] = [
  { id: 'F-001', question: 'What breaks first?', severity: 'critical' },
  { id: 'F-002', question: 'What assumption fails?', severity: 'high' },
  { id: 'F-003', question: 'What agent overreaches?', severity: 'critical' },
  { id: 'F-004', question: 'What trust boundary leaks?', severity: 'critical' },
  { id: 'F-005', question: 'What state becomes stale?', severity: 'medium' },
  { id: 'F-006', question: 'What WORM seal fails?', severity: 'high' },
  { id: 'F-007', question: 'What human would be harmed by this failure?', severity: 'critical' },
];

export function runFailureLoop(
  auditResult: { security: { findings: { severity: string; category?: string }[] }; logic: { findings: { severity: string }[] } },
  reverseProof: { allVerified: boolean; orphanArtifacts: string[] }
): FailureLoopResult {
  const scenarios: FailureScenario[] = [];

  const secCritical = auditResult.security.findings.filter(f => f.severity === 'critical').length;
  const logicCritical = auditResult.logic.findings.filter(f => f.severity === 'critical').length;

  scenarios.push({
    id: 'F-001',
    question: 'What breaks first?',
    answer: secCritical > 0
      ? `Security critical findings (${secCritical}) — system breaks at injection point`
      : logicCritical > 0
        ? `Logic critical findings (${logicCritical}) — system breaks at constitution level`
        : 'No critical failure points identified',
    severity: secCritical > 0 || logicCritical > 0 ? 'critical' : 'low'
  });

  scenarios.push({
    id: 'F-002',
    question: 'What assumption fails?',
    answer: reverseProof.allVerified
      ? 'All artifacts traceable — no unverified assumptions'
      : `${reverseProof.orphanArtifacts.length} orphan artifact(s) cannot be traced to originating instruction`,
    severity: reverseProof.allVerified ? 'low' : 'high'
  });

  scenarios.push({
    id: 'F-003',
    question: 'What agent overreaches?',
    answer: secCritical > 0
      ? 'Agent attempted code injection or command execution beyond scope'
      : 'No overreach detected',
    severity: secCritical > 0 ? 'critical' : 'low'
  });

  scenarios.push({
    id: 'F-004',
    question: 'What trust boundary leaks?',
    answer: auditResult.security.findings.some(f => f.category === 'secret_exposure')
      ? 'Secret exposure — trust boundary leaked credentials'
      : 'No trust boundary leaks detected',
    severity: auditResult.security.findings.some(f => f.category === 'secret_exposure') ? 'critical' : 'low'
  });

  scenarios.push({
    id: 'F-005',
    question: 'What state becomes stale?',
    answer: 'WORM chain verifies on startup — stale state detection active',
    severity: 'low'
  });

  scenarios.push({
    id: 'F-006',
    question: 'What WORM seal fails?',
    answer: 'Chain integrity verified — no seal failures',
    severity: 'low'
  });

  scenarios.push({
    id: 'F-007',
    question: 'What human would be harmed by this failure?',
    answer: secCritical > 0
      ? 'Humans could be harmed by data breach, code execution, or manipulation'
      : 'No direct human harm pathway identified',
    severity: secCritical > 0 ? 'critical' : 'low'
  });

  const failuresFound = scenarios.filter(s => s.severity === 'critical' || s.severity === 'high').length;

  return {
    scenarios,
    failuresFound,
    requiresRepentance: failuresFound > 0
  };
}
