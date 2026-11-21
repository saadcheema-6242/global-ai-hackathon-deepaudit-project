// ============================================================
// DeepAudit AI — Main Audit API Route
// POST /api/audit
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { callThroughBifrost } from "@/lib/bifrost";
import {
  parseClaimsFromLLMResponse,
  verifyClaim,
  calculateOverallTrustScore,
} from "@/lib/claim-extractor";
import { AuditReport, ClaimVerification } from "@/lib/types";

// ── Abuse controls ──
// Each request can trigger 1 LLM call + up to 10 Tavily searches on paid
// keys, so the endpoint is rate-limited and size-capped to prevent an
// anonymous caller from amplifying cost / exhausting quota.
const MAX_TEXT_LENGTH = 20_000;
const RATE_LIMIT_MAX = 10; // requests
const RATE_LIMIT_WINDOW_MS = 60_000; // per minute, per client

// Simple in-memory fixed-window limiter. Good enough for a single-instance
// demo; swap for a shared store (e.g. Upstash Redis) in real deployments.
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function getClientId(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(clientId: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(clientId);

  if (!bucket || now > bucket.resetAt) {
    rateBuckets.set(clientId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  try {
    const clientId = getClientId(request);
    if (isRateLimited(clientId)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string" || text.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide text with at least 10 characters to audit." },
        { status: 400 }
      );
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        {
          error: `Text is too long. Please keep it under ${MAX_TEXT_LENGTH.toLocaleString()} characters.`,
        },
        { status: 400 }
      );
    }

    const auditId = `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const startTime = Date.now();

    // ── Step 1: Extract claims via Bifrost Gateway ──
    const extractionPrompt = `You are a fact-checking claim extractor. Analyze the following text and extract all verifiable factual claims. For each claim, output a JSON array of objects with "text" (the exact claim) and "category" (one of: "factual", "statistical", "temporal", "technical", "attribution").

Only extract claims that can be checked against real-world sources. Skip opinions, instructions, and subjective statements.

TEXT TO ANALYZE:
"""
${text}
"""

Output ONLY valid JSON array, no markdown, no explanation.`;

    const bifrostResponse = await callThroughBifrost({
      prompt: extractionPrompt,
      systemPrompt:
        "You are a precise claim extraction engine. Output only valid JSON arrays.",
      temperature: 0.1,
      maxTokens: 2000,
    });

    // ── Step 2: Parse extracted claims ──
    const claims = parseClaimsFromLLMResponse(bifrostResponse.content);

    if (claims.length === 0) {
      return NextResponse.json(
        {
          error:
            "No verifiable factual claims were found in the provided text. Try submitting text with specific facts, dates, or technical assertions.",
        },
        { status: 400 }
      );
    }

    // ── Step 3: Verify each claim via Tavily ──
    const verifications: ClaimVerification[] = await Promise.all(
      claims.map((claim) => verifyClaim(claim))
    );

    // ── Step 4: Calculate overall trust score ──
    const overallTrustScore = calculateOverallTrustScore(verifications);

    // ── Step 5: Compile audit report ──
    const report: AuditReport = {
      id: auditId,
      inputText: text,
      timestamp: new Date().toISOString(),
      claims: verifications,
      overallTrustScore,
      totalClaims: verifications.length,
      verifiedCount: verifications.filter((v) => v.status === "verified").length,
      outdatedCount: verifications.filter((v) => v.status === "outdated").length,
      hallucinatedCount: verifications.filter((v) => v.status === "hallucinated")
        .length,
      unverifiableCount: verifications.filter(
        (v) => v.status === "unverifiable"
      ).length,
      bifrostMetrics: {
        ...bifrostResponse.metrics,
        totalLatencyMs: Date.now() - startTime,
      },
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error("Audit API error:", error);
    return NextResponse.json(
      { error: "An internal error occurred during the audit. Please try again." },
      { status: 500 }
    );
  }
}
