# MISCONCEPTION — Reasoning Error Generator

**Emoji:** 🎭
**Zone:** trial
**Role:** Generates common reasoning errors humans make when evaluating claims.

---

## Purpose

MISCONCEPTION exists to expose the flaws in human reasoning. It generates common logical fallacies and cognitive biases that appear when people evaluate theological, scientific, or philosophical claims. By making these errors visible, the system can filter them out before they reach the LEDGE.

---

## Error Types

| Type | Description | Example |
|------|-------------|---------|
| `correlation_causation` | Assuming correlation implies causation | "Quantum mechanics and theology both mention observers, so they must be related" |
| `authority_evidence` | Treating authority as evidence | "Einstein believed in God, so quantum mechanics proves God exists" |
| `analogy_proof` | Treating analogy as logical proof | "Entanglement is like covenant, therefore covenant is real" |
| `popularity_truth` | Assuming popular belief is true | "Most people believe in free will, so it must exist" |
| `confidence_correctness` | Assuming confidence equals accuracy | "I'm certain this is true, so it must be" |
| `cherry_picking` | Selecting only supporting evidence | Ignoring counterexamples |
| `false_dilemma` | Presenting only two options | "Either quantum mechanics proves God or it doesn't" |
| `appeal_nature` | Arguing from naturalness | "It's natural to believe in God, so God must exist" |

---

## Output Format

```typescript
interface MisconceptionResult {
  claim: string;
  classification: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
}
```

---

## Invocation

```typescript
import { generateMisconceptions } from './agents/misconception.js';
const results = await generateMisconceptions(enkiClaim);
```
