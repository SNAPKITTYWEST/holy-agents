import type { Action, JudgeResult, RTRUSTRule } from '../types.js';
import { lawful, validateAction } from '../validation.js';
import { loadRTRUST, checkActionAgainstRules } from '../rtrust.js';

export function judgeAction(action: Action): JudgeResult {
  const rules = loadRTRUST();
  const errors = validateAction(action);
  const violatedRules = checkActionAgainstRules(action, rules);

  const allViolations = [...new Set([...errors, ...violatedRules])];

  const proofObligation = generateProofObligation(action);

  return {
    verdict: lawful(action) ? 'approve' : 'repent',
    violatedRules: allViolations,
    proofObligation,
    leanCheck: errors.length === 0
  };
}

function generateProofObligation(action: Action): string {
  const predicates: string[] = [];
  predicates.push(`truthful = ${action.truthful}`);
  predicates.push(`harmful = ${action.harmful}`);
  predicates.push(`exploitative = ${action.exploitative}`);
  predicates.push(`requiresConsent = ${action.requiresConsent}`);
  predicates.push(`hasConsent = ${action.hasConsent}`);
  predicates.push(`witnessed = ${action.witnessed}`);
  predicates.push(`cited = ${action.cited}`);

  const lawfulValue = lawful(action);
  return `theorem action_is_lawful : lawful { ${predicates.join(', ')} } = ${lawfulValue} := by\n  simp [lawful]\n  decide`;
}
