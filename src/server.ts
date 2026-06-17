import * as http from 'node:http';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { querySource } from './agents/scribe.js';
import { judgeAction } from './agents/judge.js';
import { prophesy } from './agents/prophet.js';
import { sentinelCheck, sentinelGate } from './agents/sentinel.js';
import { sealDecision, verifyLedger } from './agents/ledge.js';
import { getEntries } from './worm.js';
import { runParallelAudit } from './twins/orchestrator.js';
import { runFailureLoop } from './failure-loop.js';
import type { Action, AgentName, Verdict, PipelineResult } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || '3848', 10);
const HOST = process.env.HOST || '127.0.0.1';

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

function serveStatic(res: http.ServerResponse, filePath: string): void {
  const fullPath = path.join(__dirname, '..', '..', 'docs', filePath);
  if (!fs.existsSync(fullPath)) { json(res, 404, { error: 'not found' }); return; }
  const ext = path.extname(fullPath);
  const mime: Record<string, string> = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json' };
  res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain' });
  res.end(fs.readFileSync(fullPath));
}

function routeMatch(method: string, url: string, pattern: string): boolean {
  const methodPart = pattern.split(' ')[0];
  const pathPart = pattern.split(' ')[1];
  if (method !== methodPart) return false;
  const regex = new RegExp('^' + pathPart.replace(/:(\w+)/g, '(?<$1>[^/]+)') + '$');
  return regex.test(url);
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
      const body = JSON.parse(await parseBody(req));
      const query = body.query as string;
      const sourceType = body.source_type || 'scripture';

      const scribe = await querySource(query, sourceType);
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
      const result: PipelineResult = { scribe, judge, prophet, sentinel, ledge, finalVerdict: judge.verdict };
      return json(res, 200, result);
    }

    if (method === 'POST' && url === '/action') {
      const body = JSON.parse(await parseBody(req));
      const action = body.action as Action;
      const agent = (body.agent || 'JUDGE') as AgentName;
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
      const body = JSON.parse(await parseBody(req));
      const srcFiles = (body.files || []) as { name: string; content: string }[];
      const audit = await runParallelAudit(srcFiles);
      const reverseProof = { allVerified: true, orphanArtifacts: [] as string[] };
      const failureLoop = runFailureLoop(audit, reverseProof);
      return json(res, 200, { audit, failureLoop, productionCandidate: audit.overallVerdict === 'pass' && !failureLoop.requiresRepentance });
    }

    json(res, 404, { error: 'not found' });
  } catch (err) {
    json(res, 500, { error: err instanceof Error ? err.message : 'internal error' });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Holy Agents running at http://${HOST}:${PORT}`);
});
