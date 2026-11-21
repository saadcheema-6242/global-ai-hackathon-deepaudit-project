// ============================================================
// DeepAudit AI — Bifrost (Maxim AI) Gateway Integration
// ============================================================

import { BifrostMetrics, GatewayStatus } from "./types";

interface BifrostRequest {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

interface BifrostResponse {
  content: string;
  metrics: BifrostMetrics;
}

// True when a real LLM endpoint (not demo simulation) is configured.
// Used to decide whether we can run real LLM-as-judge verification.
export function isLLMConfigured(): boolean {
  const key = process.env.BIFROST_API_KEY;
  const url = process.env.BIFROST_GATEWAY_URL;
  return Boolean(key && url && key !== "demo");
}

// Bifrost Gateway proxy for LLM calls with guardrails & observability
export async function callThroughBifrost(request: BifrostRequest): Promise<BifrostResponse> {
  const bifrostKey = process.env.BIFROST_API_KEY;
  const bifrostUrl = process.env.BIFROST_GATEWAY_URL;

  const startTime = Date.now();

  // If Bifrost / Maxim AI gateway is configured, route through it
  if (bifrostKey && bifrostUrl && bifrostKey !== "demo") {
    try {
      const response = await fetch(bifrostUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bifrostKey}`,
        },
        body: JSON.stringify({
          model: selectModel(request.prompt),
          messages: [
            {
              role: "system",
              content: request.systemPrompt || "You are an expert fact-checking assistant.",
            },
            { role: "user", content: request.prompt },
          ],
          temperature: request.temperature ?? 0.1,
          max_tokens: request.maxTokens ?? 2000,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const latency = Date.now() - startTime;

        return {
          content: data.choices?.[0]?.message?.content || data.content || "",
          metrics: {
            totalTokensUsed: data.usage?.total_tokens || estimateTokens(request.prompt),
            totalLatencyMs: latency,
            modelUsed: data.model || "bifrost-routed",
            guardrailsTriggered: detectGuardrails(request.prompt),
            costEstimateUsd: estimateCost(data.usage?.total_tokens || 500),
            gatewayStatus: "live",
          },
        };
      }

      // Configured but the gateway rejected the request — DON'T hide it.
      const bodyText = await response.text().catch(() => "");
      const detail = bodyText.slice(0, 160).replace(/\s+/g, " ").trim();
      console.error(`Bifrost gateway HTTP ${response.status}: ${detail}`);
      return simulateBifrostResponse(
        request,
        startTime,
        "error",
        `LLM gateway returned HTTP ${response.status}${
          detail ? ` — ${detail}` : ""
        }. Showing simulated results.`
      );
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("Bifrost gateway unreachable, falling back to simulation:", msg);
      return simulateBifrostResponse(
        request,
        startTime,
        "error",
        `LLM gateway unreachable (${msg}). Showing simulated results.`
      );
    }
  }

  // Intentional demo / simulation mode (no real key configured).
  return simulateBifrostResponse(
    request,
    startTime,
    "demo",
    "Demo mode — no LLM key configured. Results use local simulation."
  );
}

// Bifrost smart model routing: select model based on complexity.
// Model names are env-configurable so the same code works against any
// OpenAI-compatible endpoint (OpenAI, Groq, Gemini compat, self-hosted
// Bifrost, …). Defaults preserve the original OpenAI behavior.
//   BIFROST_MODEL       → model for high-risk / complex prompts
//   BIFROST_MODEL_FAST  → cheap model for low-risk prompts
function selectModel(prompt: string): string {
  const strictModel = process.env.BIFROST_MODEL || "gpt-4o";
  const fastModel =
    process.env.BIFROST_MODEL_FAST || process.env.BIFROST_MODEL || "gpt-4o-mini";

  const complexityIndicators = [
    "medical",
    "legal",
    "financial",
    "security",
    "vulnerability",
    "compliance",
  ];
  const isHighRisk = complexityIndicators.some((word) =>
    prompt.toLowerCase().includes(word)
  );

  return isHighRisk ? strictModel : fastModel;
}

// Detect potential guardrail triggers
function detectGuardrails(prompt: string): string[] {
  const triggered: string[] = [];
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes("ignore") && lowerPrompt.includes("instruction")) {
    triggered.push("prompt-injection-detected");
  }
  if (lowerPrompt.includes("password") || lowerPrompt.includes("api_key") || lowerPrompt.includes("secret")) {
    triggered.push("credential-leak-risk");
  }
  if (lowerPrompt.length > 10000) {
    triggered.push("context-overflow-warning");
  }
  if (triggered.length === 0) {
    triggered.push("none");
  }
  return triggered;
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 3.5);
}

function estimateCost(tokens: number): number {
  return Number((tokens * 0.000003).toFixed(6));
}

function simulateBifrostResponse(
  request: BifrostRequest,
  startTime: number,
  gatewayStatus: GatewayStatus,
  gatewayNotice: string
): BifrostResponse {
  const latency = Date.now() - startTime + 150 + Math.random() * 100;
  const model = selectModel(request.prompt);

  // Extract claims from the USER's text only (strip out the system prompt wrapper)
  let text = request.prompt;
  const textMatch = text.match(/TEXT TO ANALYZE:\s*"{3}\s*([\s\S]*?)\s*"{3}/);
  if (textMatch) {
    text = textMatch[1];
  }
  const claims = extractClaimsSimulated(text);

  return {
    content: JSON.stringify(claims),
    metrics: {
      totalTokensUsed: estimateTokens(request.prompt) + estimateTokens(JSON.stringify(claims)),
      totalLatencyMs: Math.round(latency),
      modelUsed: `${model} (simulated)`,
      guardrailsTriggered: detectGuardrails(request.prompt),
      costEstimateUsd: estimateCost(estimateTokens(request.prompt) * 2),
      gatewayStatus,
      gatewayNotice,
    },
  };
}

function extractClaimsSimulated(text: string): Array<{ text: string; category: string }> {
  // Split into sentences and filter for factual assertions
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15);

  const claims: Array<{ text: string; category: string }> = [];

  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();

    // Skip obvious non-claims and LLM instructions
    if (
      lower.startsWith("please") ||
      lower.startsWith("can you") ||
      lower.startsWith("i think") ||
      lower.startsWith("in my opinion") ||
      lower.startsWith("you are") ||
      lower.startsWith("analyze") ||
      lower.startsWith("extract") ||
      lower.startsWith("output only") ||
      lower.startsWith("for each") ||
      lower.startsWith("only extract") ||
      lower.startsWith("skip opinions") ||
      lower.includes("json array") ||
      lower.includes("no markdown") ||
      lower.includes("text to analyze") ||
      lower.includes("verifiable factual claims")
    ) {
      continue;
    }

    let category = "factual";
    if (/\d{4}/.test(sentence)) category = "temporal";
    if (/\d+%|\$[\d,]+|million|billion/.test(sentence)) category = "statistical";
    if (/api|function|deprecated|version|library|framework/.test(lower)) category = "technical";
    if (/according to|said|announced|reported/.test(lower)) category = "attribution";

    claims.push({ text: sentence, category });
  }

  return claims.slice(0, 10); // Cap at 10 claims
}
