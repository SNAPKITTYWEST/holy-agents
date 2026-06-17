#!/usr/bin/env node

const args = process.argv.slice(2);
const agent = args[0] || 'SCRIBE';
const emoji = args[1] || '🔍📖';
const action = args[2] || 'idle';
const zone = args[3] || 'library';
const status = args[4] || 'running';
const message = args[5] || '';

const ZONES = {
  altar: [50, 100],
  library: [180, 120],
  court: [340, 120],
  forge: [500, 180],
  ledge: [650, 260],
  sentinel_gate: [420, 360]
};

const coords = ZONES[zone] || [0, 0];

const event = {
  event_id: `ha_${Date.now().toString(36)}`,
  timestamp: new Date().toISOString(),
  agent,
  role: agent === 'SCRIBE' ? 'theological_retrieval' : agent === 'JUDGE' ? 'logic_validator' : agent === 'PROPHET' ? 'warning_system' : agent === 'SENTINEL' ? 'security_gate' : 'worm_seal',
  status,
  emoji,
  action,
  location: { zone, x: coords[0], y: coords[1] },
  input: {},
  output: { message },
  verification: { lean_checked: false, sentinel_checked: false, ledge_sealed: false },
  worm: { sequence: 0, prev_hash: 'GENESIS', hash: 'pending' }
};

console.log(JSON.stringify(event, null, 2));
