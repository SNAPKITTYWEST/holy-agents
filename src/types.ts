export type AgentName = 'SCRIBE' | 'JUDGE' | 'PROPHET' | 'SENTINEL' | 'LEDGE';

export type Verdict = 'approve' | 'reject' | 'repent';

export type RiskLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

export type SourceType = 'scripture' | 'dictionary' | 'wikipedia' | 'enoch' | 'apocrypha' | 'theology' | 'rtrust' | 'worm' | 'islamic' | 'judaic' | 'hindu' | 'quantum' | 'philosophy';

export type IntentType = 'definition' | 'scripture_search' | 'theology_search' | 'comparison' | 'rtrust_query' | 'unknown';

export type SynthesisLabel = 'metaphor' | 'analogy' | 'doctrine' | 'hypothesis' | 'fact';

export type ClaimType = 'fact' | 'hypothesis' | 'synthesis' | 'analogy' | 'misconception' | 'noise' | 'unverified';

export type VerdictType = 'supported' | 'contested' | 'unresolved' | 'rejected' | 'insufficient_evidence';

export interface IntentClassification {
  intent: IntentType;
  corpora: SourceType[];
  queryTerms: string[];
}

export interface Action {
  name: string;
  truthful: boolean;
  harmful: boolean;
  exploitative: boolean;
  requiresConsent: boolean;
  hasConsent: boolean;
  witnessed: boolean;
  cited: boolean;
}

export interface Citation {
  source: string;
  text: string;
  location: string;
}

export interface Definition {
  term: string;
  definition: string;
  part_of_speech: string;
}

export interface Etymology {
  term: string;
  root: string;
  origin: string;
  meaning: string;
  languages: string[];
}

export interface CrossLanguage {
  term: string;
  translations: { lang: string; word: string; meaning: string }[];
}

export interface PlainEnglish {
  answer: string;
  sources: string[];
}

export interface ScribeResult {
  citations: Citation[];
  definitions: Definition[];
  etymologies: Etymology[];
  translations: CrossLanguage[];
  plainEnglish: PlainEnglish | null;
  truthGate: boolean;
  summary: string;
  confidence: number;
}

export interface JudgeResult {
  verdict: Verdict;
  violatedRules: string[];
  proofObligation: string;
  leanCheck: boolean;
}

export interface ProphetResult {
  riskLevel: RiskLevel;
  warnings: string[];
  flags: string[];
  recommendation: 'proceed' | 'revise' | 'reject';
}

export interface SentinelResult {
  allowed: boolean;
  reason: string;
  violations: string[];
  overrideUsed: boolean;
}

export interface LedgeResult {
  sequence: number;
  prevHash: string;
  hash: string;
  sealed: boolean;
}

export interface AvatarEvent {
  event_id: string;
  timestamp: string;
  agent: AgentName;
  role: string;
  status: 'running' | 'complete' | 'failed';
  emoji: string;
  action: string;
  location: { zone: string; x: number; y: number };
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  verification: {
    lean_checked: boolean;
    sentinel_checked: boolean;
    ledge_sealed: boolean;
  };
  worm: {
    sequence: number;
    prev_hash: string;
    hash: string;
  };
}

export interface RTRUSTRule {
  rule_id: string;
  title: string;
  source: string;
  principle: string;
  forbidden_actions: string[];
  required_checks: string[];
  verdicts: string[];
}

export interface WormEntry {
  seq: number;
  prev_hash: string;
  hash: string;
  timestamp: string;
  event_id: string;
  agent: AgentName;
  action: string;
  verdict: Verdict;
  citations: string[];
}

export interface QueryRequest {
  query: string;
  source_type?: SourceType;
}

export interface ActionRequest {
  action: Action;
  agent: AgentName;
}

export interface PipelineResult {
  scribe: ScribeResult;
  judge: JudgeResult;
  prophet: ProphetResult;
  sentinel: SentinelResult;
  ledge: LedgeResult | null;
  finalVerdict: Verdict;
}

export interface EnkiResult {
  claim: string;
  quantumPerspective: string;
  biblicalPerspective: string;
  tension: string;
  synthesis: string;
  confidence: number;
  sources: string[];
  synthesis_label: SynthesisLabel;
}

export interface TensionMap {
  domain_a: string;
  domain_b: string;
  claim: string;
  support: string[];
  conflict: string[];
  unresolved_questions: string[];
  confidence: number;
  synthesis_label: SynthesisLabel;
}

export interface AdversaryResult {
  passed: boolean;
  challenges: AdversaryChallenge[];
  verdict: Verdict;
}

export interface AdversaryChallenge {
  target: string;
  type: AdversaryFlagType;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export type AdversaryFlagType =
  | 'weak_analogy'
  | 'uncited_doctrine'
  | 'overclaiming'
  | 'tradition_collapse'
  | 'scientific_misuse'
  | 'uncertainty_language'
  | 'metaphor_as_proof';

export interface MisconceptionResult {
  claim: string;
  classification: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
}

export interface NoiseResult {
  claim: string;
  type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export interface DebateRound {
  round: number;
  question: string;
  scribe: { citations: { source: string; text: string; location: string }[]; confidence: number };
  enki: { claim: string; synthesis: string; synthesis_label: SynthesisLabel; confidence: number; tensionMap: TensionMap };
  adversary: { passed: boolean; challenges: AdversaryChallenge[]; verdict: Verdict };
  misconception: MisconceptionResult[];
  noise: NoiseResult[];
  judge: { verdict: Verdict; violatedRules: string[]; leanCheck: boolean };
  prophet: { riskLevel: string; warnings: string[]; recommendation: string };
  sentinel: { allowed: boolean; reason: string; classification: ClaimType };
  ledge: { sequence: number; hash: string; sealed: boolean } | null;
  scores: { evidence: number; logic: number; citation: number; resistance: number; confidence: number };
  verdict: VerdictType;
}

export interface DebateResult {
  question: string;
  rounds: DebateRound[];
  finalVerdict: VerdictType;
  totalClaims: number;
  claimsByType: Record<ClaimType, number>;
  sealedHash: string | null;
}
