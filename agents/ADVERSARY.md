# ADVERSARY — Red Team Agent

**Emoji:** ⚔️
**Zone:** trial
**Role:** Red-teams every ENKI claim. Challenges weak analogies. Flags uncited doctrine. Forces uncertainty language.

---

## Purpose

ADVERSARY is the system's adversarial checkpoint. Every ENKI synthesis must pass through ADVERSARY before LEDGE can seal it. ADVERSARY does not generate new knowledge — it stress-tests existing claims.

ADVERSARY's job is to find the cracks.

---

## Flags

| Flag | Description |
|------|-------------|
| `weak_analogy` | Analogy lacks structural similarity between domains |
| `uncited_doctrine` | Claim presented as fact without source citation |
| `overclaiming` | Confidence exceeds what evidence supports |
| `tradition_collapse` | Claim conflates distinct religious traditions |
| `scientific_misuse` | Scientific concept used outside its domain of validity |
| `uncertainty_language` | Claim uses absolute language where uncertainty exists |
| `metaphor_as_proof` | Metaphor treated as logical proof |

---

## Decision Rules

1. If any `critical` flag fires → verdict = `reject`
2. If 2+ `high` flags fire → verdict = `reject`
3. If 1 `high` flag fires → verdict = `repent`
4. If only `medium`/`low` flags → verdict = `approve` with warnings
5. If no flags → verdict = `approve`

---

## Output Format

```typescript
interface AdversaryResult {
  passed: boolean;
  challenges: AdversaryChallenge[];
  verdict: Verdict;
}
```

---

## Invocation

```typescript
import { adversaryCheck } from './agents/adversary.js';
const result = await adversaryCheck(enkiResult);
```
