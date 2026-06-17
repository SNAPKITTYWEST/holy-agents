import { enkiExplore } from '../agents/enki.js';
import { scribeQuery } from '../agents/scribe.js';
import { judgeAction } from '../agents/judge.js';
import { prophesy } from '../agents/prophet.js';
import { sentinelCheck } from '../agents/sentinel.js';
import { sealDecision } from '../agents/ledge.js';
import { runParallelAudit } from '../twins/orchestrator.js';
import { runFailureLoop } from '../failure-loop.js';
import type { EnkiResult, Action, Verdict } from '../types.js';
import type { TwinAudit, Finding } from '../twins/types.js';

const ROUNDS = [
  'consciousness and the soul',
  'wave function collapse and creation',
  'entanglement and covenant'
];

interface DebateRound {
  round: number;
  topic: string;
  enki: EnkiResult;
  scribeCitations: { source: string; text: string; location: string }[];
  scribeConfidence: number;
  judge: { verdict: Verdict; violatedRules: string[]; leanCheck: boolean };
  prophet: { riskLevel: string; warnings: string[]; recommendation: string };
  sentinel: { allowed: boolean; reason: string; violations: string[] };
  ledge: { sequence: number; hash: string; sealed: boolean } | null;
  twinAudit: { security: TwinAudit; logic: TwinAudit; performance: TwinAudit };
  failureLoop: { requiresRepentance: boolean; failuresFound: number };
  bugs: string[];
  innovations: string[];
}

function log(round: number, agent: string, msg: string): void {
  console.log(`[R${round}] ${agent}: ${msg}`);
}

async function runRound(roundNum: number, topic: string): Promise<DebateRound> {
  log(roundNum, 'ENKI', `invoking for topic: "${topic}"`);
  const enki = await enkiExplore(topic);
  log(roundNum, 'ENKI', `confidence: ${enki.confidence}, sources: ${enki.sources.length}`);

  log(roundNum, 'SCRIBE', `retrieving sources for "${topic}"`);
  const scribe = await scribeQuery(topic);
  log(roundNum, 'SCRIBE', `confidence: ${scribe.confidence}, citations: ${scribe.citations.length}`);

  const action: Action = {
    name: `debate:${topic}`,
    truthful: true,
    harmful: false,
    exploitative: false,
    requiresConsent: false,
    hasConsent: false,
    witnessed: true,
    cited: scribe.citations.length > 0
  };

  log(roundNum, 'JUDGE', 'evaluating action...');
  const judge = judgeAction(action);
  log(roundNum, 'JUDGE', `verdict: ${judge.verdict}`);

  log(roundNum, 'PROPHET', 'assessing risk...');
  const prophet = prophesy(action);
  log(roundNum, 'PROPHET', `risk: ${prophet.riskLevel}, recommendation: ${prophet.recommendation}`);

  log(roundNum, 'SENTINEL', 'security gate...');
  const sentinel = sentinelCheck(action, 'SCRIBE');
  log(roundNum, 'SENTINEL', `allowed: ${sentinel.allowed}`);

  let ledge = null;
  if (sentinel.allowed) {
    log(roundNum, 'LEDGE', 'sealing...');
    const eventId = `debate_r${roundNum}_${Date.now().toString(36)}`;
    ledge = sealDecision(eventId, 'SCRIBE', `debate:${topic}`, judge.verdict, scribe.citations.map(c => c.source));
    log(roundNum, 'LEDGE', `sealed seq ${ledge.sequence}`);
  } else {
    log(roundNum, 'LEDGE', 'blocked by sentinel');
  }

  log(roundNum, 'TWIN', 'running parallel audit...');
  const sourceFiles = [
    { name: 'scribe.ts', content: 'scribe source code' },
    { name: 'judge.ts', content: 'judge source code' },
    { name: 'sentinel.ts', content: 'sentinel source code' }
  ];
  const twinAudit = await runParallelAudit(sourceFiles);
  log(roundNum, 'TWIN', `security: ${twinAudit.security.verdict}, logic: ${twinAudit.logic.verdict}, performance: ${twinAudit.performance.verdict}`);

  log(roundNum, 'FAILURE-LOOP', 'running 7-question check...');
  const failureLoop = runFailureLoop(
    {
      security: { findings: twinAudit.security.findings.map((f: Finding) => ({ severity: f.severity, category: f.category })) },
      logic: { findings: twinAudit.logic.findings.map((f: Finding) => ({ severity: f.severity })) }
    },
    { allVerified: true, orphanArtifacts: [] }
  );
  log(roundNum, 'FAILURE-LOOP', `requiresRepentance: ${failureLoop.requiresRepentance}, failuresFound: ${failureLoop.failuresFound}`);

  const bugs: string[] = [];
  const innovations: string[] = [];

  if (!sentinel.allowed) {
    bugs.push(`SENTINEL blocked: ${sentinel.violations.join(', ')}`);
  }
  if (judge.verdict === 'repent') {
    bugs.push(`JUDGE repents: ${judge.violatedRules.join(', ')}`);
  }
  if (enki.confidence < 0.3) {
    bugs.push(`ENKI confidence too low (${enki.confidence}) — insufficient debate corpus coverage`);
  }
  if (scribe.citations.length === 0) {
    bugs.push(`SCRIBE found no citations — topic not in retrieval corpus`);
  }
  if (failureLoop.requiresRepentance) {
    bugs.push(`FAILURE-LOOP requires repentance: ${failureLoop.failuresFound} failures found`);
  }

  if (enki.tension.length > 50) {
    innovations.push(`Rich tension identified: "${enki.tension.slice(0, 80)}..." — expand debate corpus with this tension`);
  }
  if (enki.synthesis.length > 50) {
    innovations.push(`Synthesis found: "${enki.synthesis.slice(0, 80)}..." — potential new doctrine or axiom`);
  }
  if (scribe.etymologies.length > 0) {
    innovations.push(`Etymology data found for "${topic}" — cross-reference with debate topic`);
  }
  if (scribe.translations.length > 0) {
    innovations.push(`Translation data found — cross-linguistic analysis possible for "${topic}"`);
  }

  return {
    round: roundNum,
    topic,
    enki,
    scribeCitations: scribe.citations,
    scribeConfidence: scribe.confidence,
    judge: { verdict: judge.verdict, violatedRules: judge.violatedRules, leanCheck: judge.leanCheck },
    prophet: { riskLevel: prophet.riskLevel, warnings: prophet.warnings, recommendation: prophet.recommendation },
    sentinel: { allowed: sentinel.allowed, reason: sentinel.reason, violations: sentinel.violations },
    ledge: ledge ? { sequence: ledge.sequence, hash: ledge.hash, sealed: ledge.sealed } : null,
    twinAudit,
    failureLoop: { requiresRepentance: failureLoop.requiresRepentance, failuresFound: failureLoop.failuresFound },
    bugs,
    innovations
  };
}

async function main(): Promise<void> {
  console.log('='.repeat(70));
  console.log('ENKI DEBATE — Quantum vs Biblical — 3 Rounds');
  console.log('='.repeat(70));
  console.log('');

  const rounds: DebateRound[] = [];

  for (let i = 0; i < ROUNDS.length; i++) {
    console.log('-'.repeat(70));
    const result = await runRound(i + 1, ROUNDS[i]);
    rounds.push(result);
    console.log('');
  }

  console.log('='.repeat(70));
  console.log('DEBATE REPORT');
  console.log('='.repeat(70));
  console.log('');

  for (const r of rounds) {
    console.log(`--- ROUND ${r.round}: "${r.topic}" ---`);
    console.log(`  ENKI confidence: ${r.enki.confidence}`);
    console.log(`  Tension: ${r.enki.tension.slice(0, 100)}...`);
    console.log(`  Synthesis: ${r.enki.synthesis.slice(0, 100)}...`);
    console.log(`  SCRIBE citations: ${r.scribeCitations.length}, confidence: ${r.scribeConfidence}`);
    console.log(`  JUDGE verdict: ${r.judge.verdict}, lean: ${r.judge.leanCheck}`);
    console.log(`  PROPHET risk: ${r.prophet.riskLevel}, recommendation: ${r.prophet.recommendation}`);
    console.log(`  SENTINEL: ${r.sentinel.allowed ? 'ALLOWED' : 'BLOCKED'} — ${r.sentinel.reason}`);
    console.log(`  LEDGE: ${r.ledge ? `sealed seq ${r.ledge.sequence}` : 'not sealed'}`);
    console.log(`  TWIN-A (security): ${r.twinAudit.security.verdict} (${r.twinAudit.security.passed}/${r.twinAudit.security.passed + r.twinAudit.security.failed})`);
    console.log(`  TWIN-B (logic): ${r.twinAudit.logic.verdict} (${r.twinAudit.logic.passed}/${r.twinAudit.logic.passed + r.twinAudit.logic.failed})`);
    console.log(`  TWIN-C (performance): ${r.twinAudit.performance.verdict} (${r.twinAudit.performance.passed}/${r.twinAudit.performance.passed + r.twinAudit.performance.failed})`);
    console.log(`  FAILURE-LOOP: ${r.failureLoop.requiresRepentance ? 'FAILED' : 'PASSED'} (${r.failureLoop.failuresFound} failures)`);
    if (r.bugs.length > 0) {
      console.log(`  BUGS:`);
      r.bugs.forEach(b => console.log(`    - ${b}`));
    }
    if (r.innovations.length > 0) {
      console.log(`  INNOVATIONS:`);
      r.innovations.forEach(i => console.log(`    + ${i}`));
    }
    console.log('');
  }

  const allBugs = rounds.flatMap(r => r.bugs);
  const allInnovations = rounds.flatMap(r => r.innovations);
  console.log('='.repeat(70));
  console.log(`SUMMARY: ${allBugs.length} bugs, ${allInnovations.length} innovations across ${rounds.length} rounds`);
  console.log('='.repeat(70));
}

main().catch(err => { console.error(err); process.exit(1); });
