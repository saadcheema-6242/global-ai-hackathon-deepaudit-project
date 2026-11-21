// ============================================================
// DeepAudit AI — Core Type Definitions
// ============================================================

export type VerificationStatus = "verified" | "outdated" | "hallucinated" | "unverifiable";

export interface ExtractedClaim {
  id: string;
  text: string;
  category: "factual" | "statistical" | "temporal" | "technical" | "attribution";
}

export interface TavilySource {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
  score: number;
}

export interface ClaimVerification {
  claim: ExtractedClaim;
  status: VerificationStatus;
  confidence: number; // 0-100
  sources: TavilySource[];
  reasoning: string;
  correctedInfo?: string;
}

export interface AuditReport {
  id: string;
  inputText: string;
  timestamp: string;
  claims: ClaimVerification[];
  overallTrustScore: number; // 0-100
  totalClaims: number;
  verifiedCount: number;
  outdatedCount: number;
  hallucinatedCount: number;
  unverifiableCount: number;
  bifrostMetrics: BifrostMetrics;
}

export interface BifrostMetrics {
  totalTokensUsed: number;
  totalLatencyMs: number;
  modelUsed: string;
  guardrailsTriggered: string[];
  costEstimateUsd: number;
}

export interface AuditPreset {
  id: string;
  label: string;
  emoji: string;
  description: string;
  text: string;
  expectedOutcome: string;
}
