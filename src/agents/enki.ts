import type { EnkiResult, TensionMap, SynthesisLabel } from '../types.js';

interface DebateEntry {
  topic: string;
  domain_a: string;
  domain_b: string;
  quantum: string;
  biblical: string;
  tension: string;
  synthesis: string;
  synthesis_label: SynthesisLabel;
  unresolved: string[];
}

const DEBATE_CORPUS: DebateEntry[] = [
  {
    topic: 'wave function collapse and creation',
    domain_a: 'quantum_physics',
    domain_b: 'biblical_theology',
    quantum: 'The wave function describes all possible states of a system until observation causes collapse to a single state. The observer is not passive — observation participates in defining reality.',
    biblical: 'In the beginning God created the heavens and the earth. The act of creation is not passive — God speaks, and it is. The observer (God) participates in defining reality.',
    tension: 'Both frameworks place the observer at the center of reality-making. In quantum mechanics, the observer collapses possibility into actuality. In Genesis, God speaks possibility into actuality.',
    synthesis: 'Both suggest reality is not fixed until interacted with. The gap: quantum mechanics requires no intention, only measurement. Biblical creation requires will and purpose.',
    synthesis_label: 'analogy',
    unresolved: ['Is consciousness fundamental or emergent?', 'Does observation require intention?', 'Can physics and theology describe the same event?']
  },
  {
    topic: 'entanglement and covenant',
    domain_a: 'quantum_physics',
    domain_b: 'biblical_theology',
    quantum: 'Entangled particles share a state regardless of distance. Measuring one instantly determines the other. This violates classical locality but implies a deeper connectedness.',
    biblical: 'Covenant binds parties across time and space. God covenants with Abraham and his descendants — a bond that persists regardless of distance or generation.',
    tension: 'Entanglement is physical and undirected. Covenant is relational and intentional. Both describe a connection that transcends classical boundaries.',
    synthesis: 'Both describe non-local connection. Entanglement is symmetric and meaningless — neither particle "knows" the other. Covenant is asymmetric and meaningful — God knows the covenant partner.',
    synthesis_label: 'analogy',
    unresolved: ['Can meaning exist without consciousness?', 'Is non-locality a physical or metaphysical property?', 'Does covenant require a covenant-maker?']
  },
  {
    topic: 'uncertainty principle and divine hiddenness',
    domain_a: 'quantum_physics',
    domain_b: 'biblical_theology',
    quantum: 'Heisenberg\'s uncertainty principle states that certain pairs of properties cannot both be known precisely. The more accurately one is measured, the less accurately the other can be known.',
    biblical: 'God is described as both knowable and unknowable. "For my thoughts are not your thoughts" (Isaiah 55:8). Yet God reveals himself through covenant, prophecy, and incarnation.',
    tension: 'Both describe a fundamental limit to knowledge. In quantum mechanics, the limit is physical and mathematical. In theology, the limit is ontological.',
    synthesis: 'Both suggest that complete knowledge of certain realities is impossible from a single vantage point. The uncertainty principle is a mathematical truth. Divine hiddenness is a theological claim.',
    synthesis_label: 'metaphor',
    unresolved: ['Is divine hiddenness a feature or a bug?', 'Can mathematics describe transcendence?', 'Are there knowledge limits that apply to both physics and theology?']
  },
  {
    topic: 'many-worlds and eschatology',
    domain_a: 'quantum_physics',
    domain_b: 'biblical_theology',
    quantum: 'The many-worlds interpretation suggests every quantum measurement splits reality into parallel branches. All outcomes occur — just in different worlds.',
    biblical: 'Eschatology describes a single eschaton — a final judgment, a new creation, a definitive resolution. History moves toward a single endpoint.',
    tension: 'Many-worlds is radically pluralistic — every possibility is realized. Biblical eschatology is radically singular — one future, one judgment, one new creation.',
    synthesis: 'Both attempt to resolve the problem of unchosen possibilities. Many-worlds resolves it by actualizing all possibilities. Biblical eschatology resolves it by affirming that God\'s purpose encompasses all choices.',
    synthesis_label: 'metaphor',
    unresolved: ['Is plurality a feature of reality or a failure of measurement?', 'Does divine purpose require a single outcome?', 'Can both be true simultaneously?']
  },
  {
    topic: 'consciousness and the soul',
    domain_a: 'quantum_physics',
    domain_b: 'biblical_theology',
    quantum: 'The hard problem of consciousness: why does subjective experience exist? Some interpretations (von Neumann-Wigner) suggest consciousness causes collapse.',
    biblical: 'The soul is the breath of God (nephesh). Consciousness is not an accident of complexity but a gift of the Creator. The soul is the locus of moral agency.',
    tension: 'Quantum mechanics treats consciousness as either irrelevant or causally foundational. Biblical theology treats consciousness as the image of God.',
    synthesis: 'Both agree consciousness is fundamental and not reducible to simpler components. The gap: quantum mechanics cannot explain why consciousness exists. Biblical theology cannot explain how consciousness arises from physical processes.',
    synthesis_label: 'hypothesis',
    unresolved: ['Is consciousness physical or spiritual?', 'Can the hard problem be solved?', 'Does consciousness require a substrate?']
  },
  {
    topic: 'quantum vacuum and ex nihilo',
    domain_a: 'quantum_physics',
    domain_b: 'biblical_theology',
    quantum: 'The quantum vacuum is not empty — it seethes with virtual particles that pop in and out of existence. The vacuum has energy, structure, and dynamics.',
    biblical: 'Creation ex nihilo — God created from nothing. "By faith we understand that the universe was formed at God\'s command" (Hebrews 11:3).',
    tension: 'Quantum vacuum fluctuations suggest that "nothing" is unstable and generates something. Biblical creation ex nihilo insists that something cannot come from nothing without a Creator.',
    synthesis: 'Both address the origin of the universe from a state that preceded it. The quantum vacuum provides a mechanism. Biblical creation provides a cause.',
    synthesis_label: 'hypothesis',
    unresolved: ['Is the quantum vacuum "nothing" or "something"?', 'What caused the vacuum?', 'Can mechanism and cause coexist?']
  },
  {
    topic: 'decoherence and the fall',
    domain_a: 'quantum_physics',
    domain_b: 'biblical_theology',
    quantum: 'Decoherence explains how quantum superposition breaks down through interaction with the environment. The system loses its quantum properties and becomes classical.',
    biblical: 'The Fall describes how creation was subjected to futility. The original harmony was broken, and creation now groans.',
    tension: 'Decoherence is a physical process with no moral content. The Fall is a moral event with cosmic consequences.',
    synthesis: 'Both describe a transition from a unified state to a fragmented one. Decoherence is irreversible and mathematical. The Fall is irreversible and moral.',
    synthesis_label: 'metaphor',
    unresolved: ['Is fragmentation physical or moral?', 'Can a physical process parallel a moral event?', 'Is decoherence reversible in principle?']
  }
];

function scoreRelevance(query: string, entry: DebateEntry): number {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter(w => w.length >= 3);
  const text = (entry.topic + ' ' + entry.tension + ' ' + entry.synthesis).toLowerCase();
  let matches = 0;
  for (const w of words) {
    if (text.includes(w)) matches++;
  }
  return matches / Math.max(words.length, 1);
}

function buildTensionMap(entry: DebateEntry): TensionMap {
  return {
    domain_a: entry.domain_a,
    domain_b: entry.domain_b,
    claim: entry.tension,
    support: [entry.quantum, entry.biblical],
    conflict: [entry.synthesis],
    unresolved_questions: entry.unresolved,
    confidence: 0.5,
    synthesis_label: entry.synthesis_label
  };
}

export async function enkiExplore(query: string): Promise<EnkiResult & { tensionMap: TensionMap }> {
  const scored = DEBATE_CORPUS.map(e => ({ entry: e, score: scoreRelevance(query, e) }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0]?.entry;
  if (!best || scored[0].score === 0) {
    return {
      claim: query,
      quantumPerspective: 'No quantum perspective found.',
      biblicalPerspective: 'No biblical perspective found.',
      tension: 'No tension identified.',
      synthesis: 'Cannot synthesize without relevant entries.',
      confidence: 0.1,
      sources: [],
      synthesis_label: 'hypothesis',
      tensionMap: {
        domain_a: 'unknown',
        domain_b: 'unknown',
        claim: query,
        support: [],
        conflict: [],
        unresolved_questions: ['No data available'],
        confidence: 0.1,
        synthesis_label: 'hypothesis'
      }
    };
  }

  const confidence = Math.min(0.3 + scored[0].score * 0.5, 0.7);
  const tensionMap = buildTensionMap(best);

  return {
    claim: query,
    quantumPerspective: best.quantum,
    biblicalPerspective: best.biblical,
    tension: best.tension,
    synthesis: best.synthesis,
    confidence,
    sources: [`debate:${best.topic}`],
    synthesis_label: best.synthesis_label,
    tensionMap
  };
}

export { DEBATE_CORPUS, buildTensionMap };
