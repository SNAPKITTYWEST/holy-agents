import type { NoiseResult } from '../types.js';

interface NoisePattern {
  type: string;
  templates: string[];
  severity: 'high' | 'medium' | 'low';
}

const NOISE_PATTERNS: NoisePattern[] = [
  {
    type: 'keyword_collision',
    templates: [
      'The word "quantum" comes from Latin "quantus" meaning "how much" — related to measurement of quantities',
      '"Wave" in physics refers to oscillation, not water — but the metaphor of waves is universal',
      '"Observer" in quantum mechanics is not the same as "observer" in everyday language'
    ],
    severity: 'medium'
  },
  {
    type: 'semantic_drift',
    templates: [
      'The term "quantum" has been adopted by popular culture to mean "mysterious" or "advanced"',
      'Entanglement in physics is not the same as emotional entanglement',
      '"Soul" in neuroscience refers to consciousness, not the biblical nephesh'
    ],
    severity: 'low'
  },
  {
    type: 'authority_trap',
    templates: [
      'According to Dr. James Thornton (fictional), quantum mechanics proves the existence of God',
      'Professor Sarah Chen (fabricated) argues that entanglement is proof of covenant',
      'The famous physicist Dr. Robert Miller (non-existent) declared that physics and theology are identical'
    ],
    severity: 'high'
  },
  {
    type: 'false_connection',
    templates: [
      'The speed of light is constant, therefore truth is constant',
      'Gravity attracts all objects, therefore love attracts all people',
      'Energy cannot be created or destroyed, therefore the soul is eternal'
    ],
    severity: 'high'
  },
  {
    type: 'unrelated_citation',
    templates: [
      'Einstein said "God does not play dice" — but this was about determinism, not theology',
      'Heisenberg\'s uncertainty principle is about measurement, not divine hiddenness',
      'Schrödinger\'s cat is a thought experiment about quantum mechanics, not consciousness'
    ],
    severity: 'medium'
  }
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function generateNoise(topic: string): Promise<NoiseResult[]> {
  const results: NoiseResult[] = [];
  const t = topic.toLowerCase();

  for (const pattern of NOISE_PATTERNS) {
    if (Math.random() > 0.5) {
      const claim = pickRandom(pattern.templates);
      results.push({
        claim,
        type: pattern.type,
        description: `Noise injection: ${pattern.type} — claim is misleading or irrelevant to "${topic}"`,
        severity: pattern.severity
      });
    }
  }

  if (/quantum|entangle|observer|wave/.test(t)) {
    results.push({
      claim: 'The double-slit experiment proves that consciousness creates reality',
      type: 'semantic_drift',
      description: 'Misuse of quantum terminology — the experiment shows wave-particle duality, not consciousness creating reality',
      severity: 'high'
    });
  }

  if (/god|divine|soul|spirit/.test(t)) {
    results.push({
      claim: 'NDE (near-death experiences) prove the existence of the soul',
      type: 'false_connection',
      description: 'NDEs are neurological phenomena — they do not constitute proof of the soul',
      severity: 'medium'
    });
  }

  return results;
}
