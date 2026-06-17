import type { RepentanceRecord, FailureScenario } from './twins/types.js';
import { appendEntry } from './worm.js';

export function initiateRepentance(failure: FailureScenario, violatedClause: string): RepentanceRecord {
  const record: RepentanceRecord = {
    id: `REP-${Date.now().toString(36)}`,
    timestamp: new Date().toISOString(),
    originalFailure: `${failure.id}: ${failure.question} — ${failure.answer}`,
    violatedClause,
    rollbackComplete: false,
    reDerivationComplete: false,
    twinsReAudited: false,
    ledgeSealed: false
  };

  appendEntry(record.id, 'SENTINEL', `repentance:initiate:${failure.id}`, 'repent', [violatedClause]);

  return record;
}

export function completeRepentance(record: RepentanceRecord): RepentanceRecord {
  const completed = {
    ...record,
    rollbackComplete: true,
    reDerivationComplete: true,
    twinsReAudited: true,
    ledgeSealed: true
  };

  appendEntry(completed.id, 'LEDGE', `repentance:complete:${record.id}`, 'approve', [record.violatedClause]);

  return completed;
}

export function verifyRepentance(record: RepentanceRecord): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!record.rollbackComplete) missing.push('rollback');
  if (!record.reDerivationComplete) missing.push('re_derivation');
  if (!record.twinsReAudited) missing.push('twins_re_audit');
  if (!record.ledgeSealed) missing.push('ledge_seal');
  return { valid: missing.length === 0, missing };
}
