import type { EnkiResult, AdversaryResult, AdversaryChallenge, Verdict, SynthesisLabel } from '../types.js';

function labelCanBeFact(label: SynthesisLabel, confidence: number): boolean {
  return label === 'fact' && confidence > 0.8;
}

function checkWeakAnalogy(enki: EnkiResult): AdversaryChallenge | null {
  const t = enki.tension.toLowerCase();
  const hasStructuralWords = /both|similar|mirror|parallel|analog/.test(t);
  const hasGapWords = /but|however|unlike|differs|gap|unlike|cannot/.test(t);
  if (hasStructuralWords && hasGapWords) {
    return {
      target: 'tension',
      type: 'weak_analogy',
      description: `Tension identifies both similarity and gap — analogy may be structurally weak. Consider whether the parallel is genuine or superficial.`,
      severity: 'medium'
    };
  }
  return null;
}

function checkUncitedDoctrine(enki: EnkiResult): AdversaryChallenge | null {
  if (enki.synthesis_label === 'doctrine' && enki.sources.length === 0) {
    return {
      target: 'synthesis',
      type: 'uncited_doctrine',
      description: 'Synthesis labeled as doctrine but has no source citations. Doctrine requires tradition or textual backing.',
      severity: 'high'
    };
  }
  return null;
}

function checkOverclaiming(enki: EnkiResult): AdversaryChallenge | null {
  if (enki.confidence > 0.7 && enki.synthesis_label !== 'fact') {
    return {
      target: 'confidence',
      type: 'overclaiming',
      description: `Confidence (${enki.confidence}) exceeds threshold for non-fact synthesis label (${enki.synthesis_label}). Reduce confidence or upgrade evidence.`,
      severity: 'high'
    };
  }
  return null;
}

function checkTraditionCollapse(enki: EnkiResult): AdversaryChallenge | null {
  const text = (enki.quantumPerspective + ' ' + enki.biblicalPerspective + ' ' + enki.synthesis).toLowerCase();
  const traditions = ['christian', 'islamic', 'jewish', 'hindu', 'buddhist', 'secular'];
  const mentioned = traditions.filter(t => text.includes(t));
  if (mentioned.length > 1) {
    return {
      target: 'synthesis',
      type: 'tradition_collapse',
      description: `Multiple traditions mentioned (${mentioned.join(', ')}) without distinguishing their differences. Risk of false equivalence.`,
      severity: 'medium'
    };
  }
  return null;
}

function checkScientificMisuse(enki: EnkiResult): AdversaryChallenge | null {
  const text = enki.synthesis.toLowerCase();
  const sciTerms = ['quantum', 'entanglement', 'wave function', 'superposition', 'decoherence'];
  const used = sciTerms.filter(t => text.includes(t));
  if (used.length > 0 && enki.synthesis_label === 'fact') {
    return {
      target: 'synthesis',
      type: 'scientific_misuse',
      description: `Scientific terms (${used.join(', ')}) used in a synthesis labeled as fact. Scientific concepts require peer-reviewed verification before being treated as established fact.`,
      severity: 'high'
    };
  }
  return null;
}

function checkUncertaintyLanguage(enki: EnkiResult): AdversaryChallenge | null {
  const text = enki.synthesis.toLowerCase();
  const absoluteWords = ['is', 'are', 'was', 'means', 'proves', 'demonstrates', 'shows that'];
  const hasAbsolutes = absoluteWords.some(w => text.includes(` ${w} `));
  const hasUncertainty = /may|might|could|suggests|implies|possibly|perhaps|potentially/.test(text);
  if (hasAbsolutes && !hasUncertainty) {
    return {
      target: 'synthesis',
      type: 'uncertainty_language',
      description: 'Synthesis uses absolute language without uncertainty markers. Deep inquiry conclusions should express uncertainty.',
      severity: 'medium'
    };
  }
  return null;
}

function checkMetaphorAsProof(enki: EnkiResult): AdversaryChallenge | null {
  if (enki.synthesis_label === 'metaphor' || enki.synthesis_label === 'analogy') {
    const text = enki.synthesis.toLowerCase();
    const proofWords = ['therefore', 'thus', 'proves', 'demonstrates', 'confirms'];
    const usesProof = proofWords.some(w => text.includes(w));
    if (usesProof) {
      return {
        target: 'synthesis',
        type: 'metaphor_as_proof',
        description: 'Synthesis labeled as metaphor/analogy but uses proof language. Metaphors illustrate but do not prove.',
        severity: 'critical'
      };
    }
  }
  return null;
}

function computeVerdict(challenges: AdversaryChallenge[]): { verdict: Verdict; passed: boolean } {
  const critical = challenges.filter(c => c.severity === 'critical');
  const high = challenges.filter(c => c.severity === 'high');

  if (critical.length > 0) return { verdict: 'reject', passed: false };
  if (high.length >= 2) return { verdict: 'reject', passed: false };
  if (high.length === 1) return { verdict: 'repent', passed: false };
  return { verdict: 'approve', passed: true };
}

export async function adversaryCheck(enki: EnkiResult): Promise<AdversaryResult> {
  const challenges: AdversaryChallenge[] = [];

  const checks = [
    checkWeakAnalogy(enki),
    checkUncitedDoctrine(enki),
    checkOverclaiming(enki),
    checkTraditionCollapse(enki),
    checkScientificMisuse(enki),
    checkUncertaintyLanguage(enki),
    checkMetaphorAsProof(enki)
  ];

  for (const c of checks) {
    if (c) challenges.push(c);
  }

  const { verdict, passed } = computeVerdict(challenges);

  return { passed, challenges, verdict };
}
