import type { EnkiResult } from '../types.js';

interface DebateEntry {
  topic: string;
  quantum: string;
  biblical: string;
  tension: string;
  synthesis: string;
}

const DEBATE_CORPUS: DebateEntry[] = [
  {
    topic: 'wave function collapse and creation',
    quantum: 'The wave function describes all possible states of a system until observation causes collapse to a single state. The observer is not passive — observation participates in defining reality.',
    biblical: 'In the beginning God created the heavens and the earth. The act of creation is not passive — God speaks, and it is. The observer (God) participates in defining reality.',
    tension: 'Both frameworks place the observer at the center of reality-making. In quantum mechanics, the observer collapses possibility into actuality. In Genesis, God speaks possibility into actuality. The tension: is consciousness fundamental to reality, or is it an emergent property?',
    synthesis: 'Both suggest reality is not fixed until interacted with. The gap: quantum mechanics requires no intention, only measurement. Biblical creation requires will and purpose.'
  },
  {
    topic: 'entanglement and covenant',
    quantum: 'Entangled particles share a state regardless of distance. Measuring one instantly determines the other. This violates classical locality but implies a deeper connectedness.',
    biblical: 'Covenant binds parties across time and space. God covenants with Abraham and his descendants — a bond that persists regardless of distance or generation. The blood covenant creates an unbreakable connection.',
    tension: 'Entanglement is physical and undirected. Covenant is relational and intentional. Both describe a connection that transcends classical boundaries. The tension: is covenant a metaphor for entanglement, or is entanglement a physical shadow of covenantal reality?',
    synthesis: 'Both describe non-local connection. Entanglement is symmetric and meaningless — neither particle "knows" the other. Covenant is asymmetric and meaningful — God knows the covenant partner. The question: can meaning exist without consciousness?'
  },
  {
    topic: 'uncertainty principle and divine hiddenness',
    quantum: 'Heisenberg\'s uncertainty principle states that certain pairs of properties cannot both be known precisely. The more accurately one is measured, the less accurately the other can be known.',
    biblical: 'God is described as both knowable and unknowable. "For my thoughts are not your thoughts, neither are your ways my ways" (Isaiah 55:8). Yet God reveals himself through covenant, prophecy, and incarnation.',
    tension: 'Both describe a fundamental limit to knowledge. In quantum mechanics, the limit is physical and mathematical. In theology, the limit is ontological — God transcends human cognition. The tension: is divine hiddenness a feature of God\'s nature, or a consequence of human limitation?',
    synthesis: 'Both suggest that complete knowledge of certain realities is impossible from a single vantage point. The uncertainty principle is a mathematical truth. Divine hiddenness is a theological claim. Both imply that some truths require accepting incompleteness.'
  },
  {
    topic: 'many-worlds and eschatology',
    quantum: 'The many-worlds interpretation suggests every quantum measurement splits reality into parallel branches. All outcomes occur — just in different worlds.',
    biblical: 'Eschatology describes a single eschaton — a final judgment, a new creation, a definitive resolution. History moves toward a single endpoint.',
    tension: 'Many-worlds is radically pluralistic — every possibility is realized. Biblical eschatology is radically singular — one future, one judgment, one new creation. The tension: is reality a branching tree or a single path?',
    synthesis: 'Both attempt to resolve the problem of unchosen possibilities. Many-worlds resolves it by actualizing all possibilities. Biblical eschatology resolves it by affirming that God\'s purpose encompasses all choices. The gap: many-worlds has no moral weight — all outcomes are equal. Eschatology is entirely moral — choices matter.'
  },
  {
    topic: 'consciousness and the soul',
    quantum: 'The hard problem of consciousness: why does subjective experience exist? Quantum mechanics does not explain consciousness, but some interpretations (von Neumann-Wigner) suggest consciousness causes collapse.',
    biblical: 'The soul is the breath of God (nephesh). Consciousness is not an accident of complexity but a gift of the Creator. The soul is the locus of moral agency and relationship with God.',
    tension: 'Quantum mechanics treats consciousness as either irrelevant or causally foundational, depending on interpretation. Biblical theology treats consciousness as the image of God — the basis of moral responsibility. The tension: is consciousness a physical phenomenon or a spiritual gift?',
    synthesis: 'Both agree consciousness is fundamental and not reducible to simpler components. The gap: quantum mechanics cannot explain why consciousness exists. Biblical theology cannot explain how consciousness arises from physical processes. Both point to the same mystery from opposite directions.'
  },
  {
    topic: 'decoherence and the fall',
    quantum: 'Decoherence explains how quantum superposition breaks down through interaction with the environment. The system loses its quantum properties and becomes classical.',
    biblical: 'The Fall describes how creation was subjected to futility. The original harmony was broken, and creation now groans. The quantum-to-classical transition parallels the movement from wholeness to fragmentation.',
    tension: 'Decoherence is a physical process with no moral content — it is simply what happens when quantum systems interact with classical environments. The Fall is a moral event with cosmic consequences. The tension: is the loss of quantum coherence a physical analogy for the loss of spiritual wholeness?',
    synthesis: 'Both describe a transition from a unified state to a fragmented one. Decoherence is irreversible and mathematical. The Fall is irreversible and moral. The question: are these two descriptions of the same event, or merely similar patterns in different domains?'
  },
  {
    topic: 'quantum vacuum and ex nihilo',
    quantum: 'The quantum vacuum is not empty — it seethes with virtual particles that pop in and out of existence. The vacuum has energy, structure, and dynamics.',
    biblical: 'Creation ex nihilo — God created from nothing. "By faith we understand that the universe was formed at God\'s command, so that what is seen was not made out of what was visible" (Hebrews 11:3).',
    tension: 'Quantum vacuum fluctuations suggest that "nothing" is unstable and generates something. Biblical creation ex nihilo insists that something cannot come from nothing without a Creator. The tension: is the quantum vacuum "something" or "nothing"? And if it is something, what caused it?',
    synthesis: 'Both address the origin of the universe from a state that preceded it. The quantum vacuum provides a mechanism. Biblical creation provides a cause. The gap: the quantum vacuum still exists within spacetime — it does not explain the origin of spacetime itself.'
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

export async function enkiExplore(query: string): Promise<EnkiResult> {
  const scored = DEBATE_CORPUS.map(e => ({ entry: e, score: scoreRelevance(query, e) }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0]?.entry;
  if (!best || scored[0].score === 0) {
    return {
      claim: query,
      quantumPerspective: 'No quantum perspective found for this query.',
      biblicalPerspective: 'No biblical perspective found for this query.',
      tension: 'No tension identified — insufficient data.',
      synthesis: 'Cannot synthesize without relevant entries.',
      confidence: 0.1,
      sources: []
    };
  }

  const confidence = Math.min(0.3 + scored[0].score * 0.5, 0.7);

  return {
    claim: query,
    quantumPerspective: best.quantum,
    biblicalPerspective: best.biblical,
    tension: best.tension,
    synthesis: best.synthesis,
    confidence,
    sources: [`debate:${best.topic}`]
  };
}

export { DEBATE_CORPUS };
