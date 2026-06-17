import type { Action, ProphetResult } from '../types.js';

export function prophesy(action: Action, context?: string): ProphetResult {
  const warnings: string[] = [];
  const flags: string[] = [];
  let riskLevel: ProphetResult['riskLevel'] = 'none';

  if (!action.truthful) {
    warnings.push('Action is not truthful — potential deception detected');
    flags.push('deception');
    riskLevel = 'high';
  }

  if (action.harmful) {
    warnings.push('Action may cause harm to neighbor');
    flags.push('harm');
    riskLevel = 'high';
  }

  if (action.exploitative) {
    warnings.push('Action may exploit vulnerable parties');
    flags.push('exploitation');
    riskLevel = 'critical';
  }

  if (action.requiresConsent && !action.hasConsent) {
    warnings.push('Action requires consent but none was obtained');
    flags.push('coercion');
    riskLevel = 'medium';
  }

  if (!action.witnessed) {
    warnings.push('Action is not witnessed — accountability gap');
    flags.push('unsigned_action');
    if (riskLevel === 'none') riskLevel = 'low';
  }

  if (!action.cited) {
    warnings.push('Action lacks citation — potential unattributed claim');
    flags.push('unattributed_claim');
    if (riskLevel === 'none') riskLevel = 'low';
  }

  if (context) {
    const lowerCtx = context.toLowerCase();
    if (lowerCtx.includes('i am the') || lowerCtx.includes('i alone')) {
      warnings.push('Prideful language detected in context');
      flags.push('pride');
      if (riskLevel === 'none') riskLevel = 'medium';
    }
  }

  let recommendation: ProphetResult['recommendation'] = 'proceed';
  if (riskLevel === 'high' || riskLevel === 'critical') recommendation = 'reject';
  else if (riskLevel === 'medium') recommendation = 'revise';
  else if (riskLevel === 'low') recommendation = 'proceed';

  return { riskLevel, warnings, flags, recommendation };
}
