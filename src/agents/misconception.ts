import type { MisconceptionResult } from '../types.js';

interface MisconceptionPattern {
  type: string;
  pattern: RegExp;
  severity: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
}

const PATTERNS: MisconceptionPattern[] = [
  {
    type: 'correlation_causation',
    pattern: /both.*therefore|similar.*so|like.*hence|mirror.*thus/i,
    severity: 'high',
    reason: 'Correlation or similarity does not imply causation or equivalence'
  },
  {
    type: 'authority_evidence',
    pattern: /einstein|newton|hawking|feynman|bohr|heisenberg|schrodinger/i,
    severity: 'medium',
    reason: 'Scientific authority does not constitute evidence for theological claims'
  },
  {
    type: 'analogy_proof',
    pattern: /analogy|metaphor|like|similar to|mirrors|parallel/i,
    severity: 'high',
    reason: 'Analogy illustrates but does not prove'
  },
  {
    type: 'confidence_correctness',
    pattern: /clearly|obviously|undoubtedly|certainly|definitely|proves|demonstrates/i,
    severity: 'medium',
    reason: 'Confidence does not equal correctness'
  },
  {
    type: 'false_dilemma',
    pattern: /either.*or|only two|no other|must be/i,
    severity: 'medium',
    reason: 'Reality may have more options than presented'
  },
  {
    type: 'appeal_nature',
    pattern: /natural|innate|instinctive|human nature/i,
    severity: 'low',
    reason: 'Naturalness does not imply truth'
  },
  {
    type: 'cherry_picking',
    pattern: /ignoring|overlooking|dismissing|excluding/i,
    severity: 'high',
    reason: 'Selective evidence weakens the claim'
  },
  {
    type: 'popularity_truth',
    pattern: /most people|everyone|widely believed|common knowledge/i,
    severity: 'low',
    reason: 'Popularity does not equal truth'
  }
];

function checkPatterns(text: string): MisconceptionResult[] {
  const results: MisconceptionResult[] = [];
  for (const p of PATTERNS) {
    if (p.pattern.test(text)) {
      results.push({
        claim: text.slice(0, 100),
        classification: p.type,
        severity: p.severity,
        reason: p.reason
      });
    }
  }
  return results;
}

export async function generateMisconceptions(enkiClaim: string, enkiSynthesis: string): Promise<MisconceptionResult[]> {
  const text = enkiClaim + ' ' + enkiSynthesis;
  const results = checkPatterns(text);

  if (results.length === 0 && enkiSynthesis.length > 50) {
    const hasBoth = /both/i.test(enkiSynthesis);
    const hasGap = /but|however|unlike|differs|gap/i.test(enkiSynthesis);
    if (hasBoth && hasGap) {
      results.push({
        claim: enkiSynthesis.slice(0, 100),
        classification: 'analogy_proof',
        severity: 'medium',
        reason: 'Synthesis identifies both similarity and gap — verify analogy is structural, not superficial'
      });
    }
  }

  return results;
}
