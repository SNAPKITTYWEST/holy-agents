export type AgentName = 'SCRIBE' | 'JUDGE' | 'PROPHET' | 'SENTINEL' | 'LEDGE';

export type Verdict = 'approve' | 'reject' | 'repent';

export type RiskLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

export type SourceType = 'scripture' | 'dictionary' | 'wikipedia' | 'enoch' | 'apocrypha' | 'theology' | 'rtrust' | 'worm';

export type IntentType = 'definition' | 'scripture_search' | 'theology_search' | 'comparison' | 'rtrust_query' | 'unknown';

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
