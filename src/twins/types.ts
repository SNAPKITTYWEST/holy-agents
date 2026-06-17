export type TwinType = 'security' | 'logic' | 'performance';

export type TwinVerdict = 'pass' | 'fail' | 'warn';

export interface Finding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  description: string;
  file?: string;
  line?: number;
  remediation: string;
}

export interface TwinAudit {
  twin: TwinType;
  verdict: TwinVerdict;
  findings: Finding[];
  passed: number;
  failed: number;
  warnings: number;
  duration_ms: number;
}

export interface ParallelAuditResult {
  security: TwinAudit;
  logic: TwinAudit;
  performance: TwinAudit;
  overallVerdict: TwinVerdict;
  disagreements: string[];
}

export interface ReverseProofEntry {
  artifact: string;
  originatingInstruction: string;
  trustDeedClause: string;
  agent: string;
  stateTransition: string;
  wormEvent: string;
  verified: boolean;
}

export interface ReverseProof {
  entries: ReverseProofEntry[];
  allVerified: boolean;
  orphanArtifacts: string[];
}

export interface FailureScenario {
  id: string;
  question: string;
  answer: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  violatedClause?: string;
}

export interface FailureLoopResult {
  scenarios: FailureScenario[];
  failuresFound: number;
  requiresRepentance: boolean;
}

export interface RepentanceRecord {
  id: string;
  timestamp: string;
  originalFailure: string;
  violatedClause: string;
  rollbackComplete: boolean;
  reDerivationComplete: boolean;
  twinsReAudited: boolean;
  ledgeSealed: boolean;
}
