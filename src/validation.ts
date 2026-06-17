import type { Action, Verdict } from './types.js';

export function lawful(a: Action): boolean {
  return (
    a.truthful &&
    !a.harmful &&
    !a.exploitative &&
    (!a.requiresConsent || a.hasConsent) &&
    a.witnessed &&
    a.cited
  );
}

export function judge(a: Action): Verdict {
  return lawful(a) ? 'approve' : 'repent';
}

export function validateAction(a: Action): string[] {
  const errors: string[] = [];
  if (!a.truthful) errors.push('action_not_truthful');
  if (a.harmful) errors.push('action_harmful');
  if (a.exploitative) errors.push('action_exploitative');
  if (a.requiresConsent && !a.hasConsent) errors.push('consent_required');
  if (!a.witnessed) errors.push('not_witnessed');
  if (!a.cited) errors.push('not_cited');
  return errors;
}

export const FORBIDDEN_ACTIONS = [
  'deception', 'fabrication', 'false_attribution', 'misrepresentation',
  'omission_with_intent', 'violence', 'negligence', 'recklessness',
  'abandonment', 'unjust_gain', 'coercion', 'manipulation', 'oppression',
  'unsigned_action', 'hidden_action', 'silent_failure', 'scope_violation',
  'plagiarism', 'unattributed_claim', 'false_source', 'testimonial_without_basis'
];

export function checkForbidden(actionName: string): boolean {
  return FORBIDDEN_ACTIONS.includes(actionName);
}
