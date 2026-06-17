#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const checks = [
  { name: 'node_modules exists', test: () => fs.existsSync('node_modules') },
  { name: 'dist/ exists', test: () => fs.existsSync('dist') },
  { name: 'constitution/RTRUST.md exists', test: () => fs.existsSync('constitution/RTRUST.md') },
  { name: 'constitution/SCRIPTURE_AXIOMS.md exists', test: () => fs.existsSync('constitution/SCRIPTURE_AXIOMS.md') },
  { name: 'constitution/FORBIDDEN_ACTIONS.md exists', test: () => fs.existsSync('constitution/FORBIDDEN_ACTIONS.md') },
  { name: 'agents/SCRIBE.md exists', test: () => fs.existsSync('agents/SCRIBE.md') },
  { name: 'agents/JUDGE.md exists', test: () => fs.existsSync('agents/JUDGE.md') },
  { name: 'agents/PROPHET.md exists', test: () => fs.existsSync('agents/PROPHET.md') },
  { name: 'agents/SENTINEL.md exists', test: () => fs.existsSync('agents/SENTINEL.md') },
  { name: 'agents/LEDGE.md exists', test: () => fs.existsSync('agents/LEDGE.md') },
  { name: 'lean/TheologyValidator.lean exists', test: () => fs.existsSync('lean/TheologyValidator.lean') },
  { name: 'emoji/holy_emoji_map.json exists', test: () => fs.existsSync('emoji/holy_emoji_map.json') },
  { name: 'src/types.ts exists', test: () => fs.existsSync('src/types.ts') },
  { name: 'src/validation.ts exists', test: () => fs.existsSync('src/validation.ts') },
  { name: 'src/rtrust.ts exists', test: () => fs.existsSync('src/rtrust.ts') },
  { name: 'src/hash.ts exists', test: () => fs.existsSync('src/hash.ts') },
  { name: 'src/worm.ts exists', test: () => fs.existsSync('src/worm.ts') },
  { name: 'src/server.ts exists', test: () => fs.existsSync('src/server.ts') },
  { name: 'src/agents/scribe.ts exists', test: () => fs.existsSync('src/agents/scribe.ts') },
  { name: 'src/agents/judge.ts exists', test: () => fs.existsSync('src/agents/judge.ts') },
  { name: 'src/agents/prophet.ts exists', test: () => fs.existsSync('src/agents/prophet.ts') },
  { name: 'src/agents/sentinel.ts exists', test: () => fs.existsSync('src/agents/sentinel.ts') },
  { name: 'src/agents/ledge.ts exists', test: () => fs.existsSync('src/agents/ledge.ts') },
  { name: 'docs/index.html exists', test: () => fs.existsSync('docs/index.html') },
  { name: 'docs/visualizer.js exists', test: () => fs.existsSync('docs/visualizer.js') },
  { name: 'docs/query.html exists', test: () => fs.existsSync('docs/query.html') },
  { name: 'docs/agents.html exists', test: () => fs.existsSync('docs/agents.html') },
  { name: 'docs/twins.html exists', test: () => fs.existsSync('docs/twins.html') },
  { name: 'docs/debate.html exists', test: () => fs.existsSync('docs/debate.html') },
  { name: 'docs/repl.html exists', test: () => fs.existsSync('docs/repl.html') },
  { name: 'docs/repl.js exists', test: () => fs.existsSync('docs/repl.js') },
  { name: 'docs/repl.css exists', test: () => fs.existsSync('docs/repl.css') },
  { name: 'docs/state/ascii_registry.json exists', test: () => fs.existsSync('docs/state/ascii_registry.json') },
  { name: 'docs index links to repl', test: () => { const c = fs.readFileSync('docs/index.html','utf-8'); return c.includes('repl.html'); } },
  { name: 'docs query links to repl', test: () => { const c = fs.readFileSync('docs/query.html','utf-8'); return c.includes('repl.html'); } },
  { name: 'docs debate links to repl', test: () => { const c = fs.readFileSync('docs/debate.html','utf-8'); return c.includes('repl.html'); } },
];

let pass = 0;
let fail = 0;
for (const check of checks) {
  try {
    if (check.test()) { pass++; console.log(`  ✓ ${check.name}`); }
    else { fail++; console.log(`  ✗ ${check.name}`); }
  } catch { fail++; console.log(`  ✗ ${check.name} (error)`); }
}

console.log(`\nDoctor: ${pass}/${pass + fail} checks passed`);
if (fail > 0) process.exit(1);
