import type { Action, SentinelResult, Verdict } from '../types.js';
import { checkForbidden, validateAction } from '../validation.js';
import { loadRTRUST, checkActionAgainstRules } from '../rtrust.js';

export function sentinelCheck(action: Action, agentSignature?: string): SentinelResult {
  const violations: string[] = [];

  if (!agentSignature) {
    violations.push('no_agent_signature');
  }

  const validationErrors = validateAction(action);
  violations.push(...validationErrors);

  const forbiddenMatch = checkForbidden(action.name);
  if (forbiddenMatch) {
    violations.push('forbidden_action');
  }

  const rules = loadRTRUST();
  const rtrustViolations = checkActionAgainstRules(action, rules);
  violations.push(...rtrustViolations);

  return {
    allowed: violations.length === 0,
    reason: violations.length === 0
      ? 'All checks passed'
      : `Violations: ${violations.join(', ')}`,
    violations,
    overrideUsed: false
  };
}

export function sentinelGate(verdict: Verdict, agent: string, citations: string[]): SentinelResult {
  const violations: string[] = [];

  if (verdict === 'reject') {
    violations.push('judge_rejected');
  }

  if (citations.length === 0) {
    violations.push('no_citations');
  }

  return {
    allowed: violations.length === 0,
    reason: violations.length === 0
      ? 'SENTINEL: action cleared'
      : `SENTINEL: blocked — ${violations.join(', ')}`,
    violations,
    overrideUsed: false
  };
}
