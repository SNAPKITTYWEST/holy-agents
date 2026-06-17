import * as http from 'node:http';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { querySource } from './agents/scribe.js';
import { judgeAction } from './agents/judge.js';
import { prophesy } from './agents/prophet.js';
import { sentinelCheck } from './agents/sentinel.js';
import { sealDecision, verifyLedger } from './agents/ledge.js';
import { getEntries } from './worm.js';
import { runParallelAudit } from './twins/orchestrator.js';
import { runFailureLoop } from './failure-loop.js';
import { buildReverseProof } from './reverse-proof.js';
import type { Action, AgentName, PipelineResult } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || '3848', 10);
const HOST = process.env.HOST || '127.0.0.1';
const DOCS_DIR = path.resolve(__dirname, '..', '..', 'docs');

let eventIdCounter = 0;
function nextEventId(): string {
  return `ha_${String(++eventIdCounter).padStart(6, '0')}`;
}

function parseBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > 100_000) { req.destroy(); reject(new Error('body too large')); return; }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
    req.on('error', reject);
  });
}

function json(res: http.ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function isPathSafe(filePath: string): boolean {
  const resolved = path.resolve(DOCS_DIR, filePath);
  return resolved.startsWith(DOCS_DIR + path.sep) || resolved === DOCS_DIR;
}

function serveStatic(res: http.ServerResponse, filePath: string): void {
  if (!isPathSafe(filePath)) { json(res, 403, { error: 'forbidden' }); return; }
  const fullPath = path.join(DOCS_DIR, filePath);
  if (!fs.existsSync(fullPath)) { json(res, 404, { error: 'not found' }); return; }
  const ext = path.extname(fullPath);
  const mime: Record<string, string> = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json' };
  res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain' });
  res.end(fs.readFileSync(fullPath));
}

function validateQueryBody(body: unknown): body is { query: string; source_type?: string } {
  return typeof body === 'object' && body !== null && typeof (body as Record<string, unknown>).query === 'string' && (body as Record<string, unknown>).query !== '';
}

function validateActionBody(body: unknown): body is { action: Action; agent?: string } {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  if (typeof b.action !== 'object' || b.action === null) return false;
  const a = b.action as Record<string, unknown>;
  return typeof a.name === 'string' && typeof a.truthful === 'boolean' && typeof a.harmful === 'boolean' && typeof a.exploitative === 'boolean';
}

const server = http.createServer(async (req, res) => {
  const method = req.method || 'GET';
  const url = req.url?.split('?')[0] || '/';

  try {
    if (method === 'GET' && url === '/health') {
      const chain = verifyLedger();
      return json(res, 200, { ok: true, version: '0.1.0', chain_valid: chain.valid, entries: getEntries().length });
    }

    if (method === 'GET' && url === '/') {
      return serveStatic(res, 'index.html');
    }

    if (method === 'GET' && url.startsWith('/docs/')) {
      return serveStatic(res, url.slice(6));
    }

    if (method === 'POST' && url === '/query') {
      let parsed: unknown;
      try { parsed = JSON.parse(await parseBody(req)); } catch { return json(res, 400, { error: 'invalid JSON' }); }
      if (!validateQueryBody(parsed)) return json(res, 400, { error: 'missing or invalid query field' });
      const query = parsed.query;
      const sourceType = parsed.source_type || 'scripture';

      const scribe = await querySource(query, sourceType as 'scripture' | 'dictionary' | 'wikipedia');
      const action: Action = {
        name: 'query',
        truthful: true,
        harmful: false,
        exploitative: false,
        requiresConsent: false,
        hasConsent: false,
        witnessed: true,
        cited: scribe.citations.length > 0
      };
      const judge = judgeAction(action);
      const prophet = prophesy(action);
      const sentinel = sentinelCheck(action, 'system');
      let ledge = null;
      if (sentinel.allowed) {
        ledge = sealDecision(nextEventId(), 'SCRIBE', `query:${query}`, judge.verdict, scribe.citations.map(c => c.source));
      }

      const artifacts = ['scribe.ts', 'judge.ts', 'prophet.ts', 'sentinel.ts', 'ledge.ts'];
      const reverseProof = buildReverseProof(
        artifacts,
        Object.fromEntries(artifacts.map(a => [a, `query:${query}`])),
        Object.fromEntries(artifacts.map(a => [a, 'Second Trust Deed Article III'])),
        Object.fromEntries(artifacts.map(a => [a, 'SCRIBE'])),
        Object.fromEntries(artifacts.map(a => [a, 'cold_boot'])),
        Object.fromEntries(artifacts.map(a => [a, ledge?.hash || 'pending']))
      );

      const result: PipelineResult & { reverseProof: { allVerified: boolean; orphanArtifacts: string[] } } = {
        scribe, judge, prophet, sentinel, ledge, finalVerdict: judge.verdict,
        reverseProof: { allVerified: reverseProof.allVerified, orphanArtifacts: reverseProof.orphanArtifacts }
      };
      return json(res, 200, result);
    }

    if (method === 'POST' && url === '/action') {
      let parsed: unknown;
      try { parsed = JSON.parse(await parseBody(req)); } catch { return json(res, 400, { error: 'invalid JSON' }); }
      if (!validateActionBody(parsed)) return json(res, 400, { error: 'missing or invalid action fields (name, truthful, harmful, exploitative required)' });
      const action = parsed.action as Action;
      const agent = (parsed.agent || 'JUDGE') as AgentName;
      const judge = judgeAction(action);
      const prophet = prophesy(action);
      const sentinel = sentinelCheck(action, agent);
      let ledge = null;
      if (sentinel.allowed) {
        ledge = sealDecision(nextEventId(), agent, action.name, judge.verdict, []);
      }
      return json(res, 200, { judge, prophet, sentinel, ledge, finalVerdict: judge.verdict });
    }

    if (method === 'GET' && url === '/state') {
      return json(res, 200, { agents: ['SCRIBE', 'JUDGE', 'PROPHET', 'SENTINEL', 'LEDGE'], status: 'ready' });
    }

    if (method === 'GET' && url === '/worm') {
      return json(res, 200, { entries: getEntries() });
    }

    if (method === 'POST' && url === '/worm/verify') {
      return json(res, 200, verifyLedger());
    }

    if (method === 'GET' && url.startsWith('/agents/')) {
      const name = url.split('/agents/')[1];
      return json(res, 200, { name, status: 'active' });
    }

    if (method === 'POST' && url === '/audit') {
      let parsed: unknown;
      try { parsed = JSON.parse(await parseBody(req)); } catch { return json(res, 400, { error: 'invalid JSON' }); }
      const srcFiles = ((parsed as Record<string, unknown>).files || []) as { name: string; content: string }[];
      const audit = await runParallelAudit(srcFiles);
      const reverseProof = buildReverseProof(
        srcFiles.map(f => f.name),
        Object.fromEntries(srcFiles.map(f => [f.name, 'audit request'])),
        Object.fromEntries(srcFiles.map(f => [f.name, 'Second Trust Deed Article IV'])),
        Object.fromEntries(srcFiles.map(f => [f.name, 'SENTINEL'])),
        Object.fromEntries(srcFiles.map(f => [f.name, 'audit'])),
        Object.fromEntries(srcFiles.map(f => [f.name, 'pending']))
      );
      const failureLoop = runFailureLoop(audit, reverseProof);
      return json(res, 200, { audit, failureLoop, reverseProof: { allVerified: reverseProof.allVerified, orphanArtifacts: reverseProof.orphanArtifacts }, productionCandidate: audit.overallVerdict === 'pass' && !failureLoop.requiresRepentance });
    }

    json(res, 404, { error: 'not found' });
  } catch (err) {
    json(res, 500, { error: 'internal error' });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Holy Agents running at http://${HOST}:${PORT}`);
});
