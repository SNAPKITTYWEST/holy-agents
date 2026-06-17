const ZONES = {
  altar: { x: 50, y: 100, label: 'Altar' },
  library: { x: 180, y: 120, label: 'Library' },
  court: { x: 340, y: 120, label: 'Court' },
  forge: { x: 500, y: 180, label: 'Forge' },
  ledge: { x: 650, y: 260, label: 'Ledge' },
  sentinel_gate: { x: 420, y: 360, label: 'Sentinel Gate' }
};

const AGENTS = [
  { name: 'SCRIBE', emoji: '🔍📖', role: 'theological_retrieval', zone: 'library', color: '#4a9' },
  { name: 'JUDGE', emoji: '⚖️🧠', role: 'logic_validator', zone: 'court', color: '#a84' },
  { name: 'PROPHET', emoji: '🔥', role: 'warning_system', zone: 'forge', color: '#a44' },
  { name: 'SENTINEL', emoji: '🛡️', role: 'security_gate', zone: 'sentinel_gate', color: '#44a' },
  { name: 'LEDGE', emoji: '🧾🔐', role: 'worm_seal', zone: 'ledge', color: '#888' }
];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const logEl = document.getElementById('log');
const agentListEl = document.getElementById('agent-list');
const queryInput = document.getElementById('query');
const chainStatusEl = document.getElementById('chain-status');
const lastVerdictEl = document.getElementById('last-verdict');

let agentStates = {};
AGENTS.forEach(a => { agentStates[a.name] = { ...a, status: 'idle', x: ZONES[a.zone].x, y: ZONES[a.zone].y }; });

function resize() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}
resize();
window.addEventListener('resize', resize);

function renderAgentList() {
  agentListEl.innerHTML = AGENTS.map(a => `
    <div class="agent-card" id="card-${a.name}">
      <div class="agent-name"><span class="agent-emoji">${a.emoji}</span>${a.name}</div>
      <div class="agent-role">${a.role}</div>
      <div class="agent-zone">${ZONES[a.zone].label} (${ZONES[a.zone].x}, ${ZONES[a.zone].y})</div>
    </div>
  `).join('');
}

function addLog(agent, message) {
  const time = new Date().toLocaleTimeString();
  const cls = agent.toLowerCase();
  logEl.innerHTML += `<div class="log-entry"><span class="time">[${time}]</span> <span class="agent ${cls}">${agent}</span> ${message}</div>`;
  logEl.scrollTop = logEl.scrollHeight;
}

function drawZone(z, zoneData) {
  const x = zoneData.x;
  const y = zoneData.y;
  ctx.strokeStyle = '#1a1a1a';
  ctx.strokeRect(x - 40, y - 30, 80, 60);
  ctx.fillStyle = '#1a1a1a';
  ctx.font = '9px Courier New';
  ctx.textAlign = 'center';
  ctx.fillText(zoneData.label, x, y + 45);
}

function drawAgent(a) {
  const state = agentStates[a.name];
  ctx.font = '24px serif';
  ctx.textAlign = 'center';
  ctx.fillText(state.emoji, state.x, state.y + 8);
  ctx.font = '10px Courier New';
  ctx.fillStyle = state.status === 'running' ? a.color : '#333';
  ctx.fillText(a.name, state.x, state.y + 25);
}

let particles = [];
function drawParticles() {
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 2, 2);
  });
  ctx.globalAlpha = 1;
}

function spawnParticle(from, to, color) {
  const fx = ZONES[from].x, fy = ZONES[from].y;
  const tx = ZONES[to].x, ty = ZONES[to].y;
  for (let i = 0; i < 5; i++) {
    particles.push({
      x: fx, y: fy,
      vx: (tx - fx) / 60 + (Math.random() - 0.5) * 2,
      vy: (ty - fy) / 60 + (Math.random() - 0.5) * 2,
      life: 60, maxLife: 60,
      color
    });
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Object.entries(ZONES).forEach(([k, v]) => drawZone(k, v));
  AGENTS.forEach(a => drawAgent(a));
  drawParticles();
  requestAnimationFrame(render);
}

renderAgentList();
render();

async function runPipeline(query) {
  addLog('SCRIBE', `searching: "${query}"`);
  agentStates.SCRIBE.status = 'running';
  spawnParticle('altar', 'library', '#4a9');

  try {
    const res = await fetch('/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, source_type: query.includes('define') || query.includes('📚') ? 'dictionary' : query.includes('🌐') ? 'wikipedia' : 'scripture' })
    });
    const data = await res.json();

    agentStates.SCRIBE.status = 'idle';
    addLog('SCRIBE', `found ${data.scribe.citations.length} citation(s), confidence ${data.scribe.confidence}`);

    agentStates.JUDGE.status = 'running';
    addLog('JUDGE', `verdict: ${data.judge.verdict}`);
    spawnParticle('library', 'court', '#a84');
    agentStates.JUDGE.status = 'idle';

    agentStates.PROPHET.status = 'running';
    addLog('PROPHET', `risk: ${data.prophet.riskLevel}, flags: ${data.prophet.flags.join(', ') || 'none'}`);
    spawnParticle('court', 'forge', '#a44');
    agentStates.PROPHET.status = 'idle';

    agentStates.SENTINEL.status = 'running';
    addLog('SENTINEL', data.sentinel.allowed ? 'cleared' : `blocked: ${data.sentinel.reason}`);
    spawnParticle('forge', 'sentinel_gate', '#44a');
    agentStates.SENTINEL.status = 'idle';

    if (data.ledge) {
      agentStates.LEDGE.status = 'running';
      addLog('LEDGE', `sealed seq ${data.ledge.sequence}`);
      spawnParticle('sentinel_gate', 'ledge', '#888');
      agentStates.LEDGE.status = 'idle';
    }

    lastVerdictEl.textContent = `verdict: ${data.finalVerdict}`;
  } catch (err) {
    addLog('SYSTEM', `error: ${err.message}`);
    AGENTS.forEach(a => { agentStates[a.name].status = 'idle'; });
  }
}

queryInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && queryInput.value.trim()) {
    runPipeline(queryInput.value.trim());
    queryInput.value = '';
  }
});

async function refreshChain() {
  try {
    const res = await fetch('/worm');
    const data = await res.json();
    chainStatusEl.textContent = `chain: ${data.entries.length} entries`;
  } catch {
    chainStatusEl.textContent = 'chain: offline';
  }
}

refreshChain();
setInterval(refreshChain, 5000);
