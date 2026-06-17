import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256, computeEntryHash } from './hash.js';
import type { WormEntry, Verdict, AgentName } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WORM_DIR = path.join(__dirname, '..', '..', 'worm');
const WORM_FILE = path.join(WORM_DIR, 'holy_agents.jsonl');

function ensureDir(): void {
  if (!fs.existsSync(WORM_DIR)) fs.mkdirSync(WORM_DIR, { recursive: true });
}

function readEntries(): WormEntry[] {
  ensureDir();
  if (!fs.existsSync(WORM_FILE)) return [];
  const lines = fs.readFileSync(WORM_FILE, 'utf-8').split('\n').filter(Boolean);
  return lines.map(l => JSON.parse(l));
}

function writeEntries(entries: WormEntry[]): void {
  ensureDir();
  const lines = entries.map(e => JSON.stringify(e)).join('\n') + '\n';
  fs.writeFileSync(WORM_FILE, lines, 'utf-8');
}

export function appendEntry(event_id: string, agent: AgentName, action: string, verdict: Verdict, citations: string[]): WormEntry {
  const entries = readEntries();
  const seq = entries.length + 1;
  const prevHash = entries.length === 0 ? 'GENESIS' : entries[entries.length - 1].hash;
  const timestamp = new Date().toISOString();
  const entry: WormEntry = {
    seq,
    prev_hash: prevHash,
    hash: '',
    timestamp,
    event_id,
    agent,
    action,
    verdict,
    citations
  };
  entry.hash = computeEntryHash({ seq, prev_hash: prevHash, event_id, agent, action, verdict, timestamp });
  entries.push(entry);
  writeEntries(entries);
  return entry;
}

export function getEntries(): WormEntry[] {
  return readEntries();
}

export function verifyChain(): { valid: boolean; errors: string[] } {
  const entries = readEntries();
  const errors: string[] = [];
  if (entries.length === 0) return { valid: true, errors: [] };
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.seq !== i + 1) errors.push(`entry ${i}: expected seq ${i + 1}, got ${entry.seq}`);
    const expectedPrev = i === 0 ? 'GENESIS' : entries[i - 1].hash;
    if (entry.prev_hash !== expectedPrev) errors.push(`entry ${i}: prev_hash mismatch`);
    const recomputed = computeEntryHash({
      seq: entry.seq, prev_hash: entry.prev_hash, event_id: entry.event_id,
      agent: entry.agent, action: entry.action, verdict: entry.verdict, timestamp: entry.timestamp
    });
    if (recomputed !== entry.hash) errors.push(`entry ${i}: hash mismatch`);
  }
  return { valid: errors.length === 0, errors };
}
