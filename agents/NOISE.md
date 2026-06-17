# NOISE — Misleading Information Injector

**Emoji:** 🦠
**Zone:** trial
**Role:** Injects irrelevant or misleading information to test the pipeline's ability to filter noise.

---

## Purpose

NOISE exists to challenge the pipeline's filtering ability. It generates claims that look relevant but are actually misleading, irrelevant, or contaminated. By injecting noise, the system learns to distinguish signal from noise.

---

## Noise Types

| Type | Description | Example |
|------|-------------|---------|
| `unrelated_citation` | Citation that sounds relevant but isn't | "Einstein said God does not play dice" (unrelated to quantum theology) |
| `keyword_collision` | Keyword match that leads to wrong context | "Wave" in "wave function" vs "wave of emotion" |
| `search_contamination` | Results that pollute the search space | Fake etymologies, false translations |
| `semantic_drift` | Claims that slowly shift meaning | "Quantum" used to mean "mysterious" instead of physics |
| `authority_trap` | Fake expert citations | "According to Dr. Smith..." (no such expert) |
| `false_connection` | Connecting unrelated domains | "Gravity proves love is real" |

---

## Output Format

```typescript
interface NoiseResult {
  claim: string;
  type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}
```

---

## Invocation

```typescript
import { generateNoise } from './agents/noise.js';
const results = await generateNoise(topic);
```
