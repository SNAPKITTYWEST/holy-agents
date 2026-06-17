import type { AgentName, Verdict, LedgeResult } from '../types.js';
import { appendEntry, verifyChain } from '../worm.js';

export function sealDecision(eventId: string, agent: AgentName, action: string, verdict: Verdict, citations: string[]): LedgeResult {
  const entry = appendEntry(eventId, agent, action, verdict, citations);
  return {
    sequence: entry.seq,
    prevHash: entry.prev_hash,
    hash: entry.hash,
    sealed: true
  };
}

export function verifyLedger(): { valid: boolean; errors: string[] } {
  return verifyChain();
}
