import type { ReverseProof, ReverseProofEntry } from './twins/types.js';

export function buildReverseProof(
  artifacts: string[],
  instructionMap: Record<string, string>,
  deedClauseMap: Record<string, string>,
  agentMap: Record<string, string>,
  stateMap: Record<string, string>,
  wormMap: Record<string, string>
): ReverseProof {
  const entries: ReverseProofEntry[] = [];
  const orphanArtifacts: string[] = [];

  for (const artifact of artifacts) {
    const instruction = instructionMap[artifact];
    const clause = deedClauseMap[artifact];
    const agent = agentMap[artifact];
    const state = stateMap[artifact];
    const worm = wormMap[artifact];

    if (!instruction || !clause || !agent || !state || !worm) {
      orphanArtifacts.push(artifact);
      entries.push({
        artifact,
        originatingInstruction: instruction || 'UNKNOWN',
        trustDeedClause: clause || 'UNKNOWN',
        agent: agent || 'UNKNOWN',
        stateTransition: state || 'UNKNOWN',
        wormEvent: worm || 'UNKNOWN',
        verified: false
      });
    } else {
      entries.push({
        artifact,
        originatingInstruction: instruction,
        trustDeedClause: clause,
        agent,
        stateTransition: state,
        wormEvent: worm,
        verified: true
      });
    }
  }

  return {
    entries,
    allVerified: entries.every(e => e.verified),
    orphanArtifacts
  };
}

export function verifyTraceability(proof: ReverseProof): { valid: boolean; orphans: string[] } {
  return {
    valid: proof.allVerified,
    orphans: proof.orphanArtifacts
  };
}
