import { createHash, timingSafeEqual } from 'node:crypto';

export function sha256(data: string): string {
  return createHash('sha256').update(data, 'utf-8').digest('hex');
}

export function verifyHash(data: string, expectedHash: string): boolean {
  const computed = sha256(data);
  const a = Buffer.from(computed, 'hex');
  const b = Buffer.from(expectedHash, 'hex');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function computeEntryHash(entry: { seq: number; prev_hash: string; event_id: string; agent: string; action: string; verdict: string; timestamp: string }): string {
  const input = `${entry.seq}|${entry.prev_hash}|${entry.event_id}|${entry.agent}|${entry.action}|${entry.verdict}|${entry.timestamp}`;
  return sha256(input);
}
