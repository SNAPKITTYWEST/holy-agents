# Holy Agents

Faith-governed agent runtime for SnapKitty OS.

**No public claim without:** source → definition → Lean check → SENTINEL pass → WORM seal.

## Core Thesis

Holy Agents are not chatbots. They are covenant-bound software agents that must pass three gates before action:

1. **Scripture Gate** — does the action violate the biblical constitution?
2. **Logic Gate** — does the reasoning remain internally consistent?
3. **Witness Gate** — is the action signed, logged, and accountable?

## Agent Trinity

| Agent | Role | Function |
|-------|------|----------|
| **SCRIBE** | Theological retrieval | Searches scripture, commentary, dictionary, Wikipedia |
| **JUDGE** | Logic validator | Converts claims into Lean-checkable logic |
| **PROPHET** | Warning system | Detects contradiction, pride, exploitation, deception |
| **SENTINEL** | Security gate | Blocks unsafe, deceptive, or uncited output |
| **LEDGE** | WORM seal | Seals every decision to append-only log |

## Boot Flow

```
USER INTENT
↓
🔍📖 SCRIBE retrieves relevant constitution
↓
⚖️🧠 JUDGE formalizes logical rule
↓
🔥 PROPHET checks moral risk
↓
🛡️ SENTINEL checks security
↓
🧾 LEDGE seals decision
↓
ACTION EXECUTES OR REPENTS
```

## Quick Start

```bash
npm install
npm run build
npm run doctor
npm test
npm start
```

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/query` | Submit query through agent pipeline |
| GET | `/state` | Current agent state |
| GET | `/worm` | WORM chain |
| POST | `/worm/verify` | Verify chain integrity |
| GET | `/agents/:name` | Agent status |
| POST | `/agents/:name/action` | Agent action (avatar event) |

## Lean 4

Formal specification in `lean/TheologyValidator.lean` — checks whether actions violate declared RTRUST rules.

```bash
npm run verify
```

## License

MIT

![](https://sovereign-analytics.snapkittywest.workers.dev/canary/holy-agents)
