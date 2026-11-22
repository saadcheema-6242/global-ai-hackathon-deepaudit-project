# DeepAudit AI — Technical Documentation

**Real-Time AI Hallucination & Fact-Verification Engine**

Built for the **HackCulture Global AI Hackathon** (by Geek Room).
Repository: `github.com/saadcheema-6242/global-ai-hackathon-deepaudit-project`
Live demo: `https://global-ai-hackathon-deepaudit-proje.vercel.app/`

---

## 1. Executive Summary

DeepAudit AI is a web application that takes any block of AI-generated text (an LLM answer, an article, documentation, a research summary) and automatically checks whether the factual claims inside it are **true, outdated, hallucinated, or unverifiable**.

It does this in four stages:

1. **Extract** atomic factual claims from the input text.
2. **Verify** each claim against the live web using the **Tavily Search API**.
3. **Score** each claim (verified / outdated / hallucinated / unverifiable) with a confidence value.
4. **Report** the result as an interactive dashboard with a 0–100 **Trust Score**, per-claim evidence, source citations, and an exportable JSON report.

A key design decision: the app runs fully in **demo / simulation mode with zero API keys**, so judges can open the live link and immediately see the complete flow without any setup. When real keys are supplied, the same code path upgrades to live web search and live LLM judging.

> **Note on scope and timeline.** This project was built in roughly **5 hours** because the team joined the hackathon late. The original plan was to route all LLM calls through the **Bifrost (Maxim AI) gateway**, but that integration could not be completed inside the time window. The LLM-gateway layer was therefore implemented as a **provider-agnostic, OpenAI-compatible wrapper that runs in demo/simulation mode by default**, and the **real, working sponsor integration delivered is Tavily Search API**, which powers the actual fact-checking.

---

## 2. Problem Statement

Large Language Models produce fluent, confident text that frequently contains:

- **Hallucinated facts** — statements that sound real but are fabricated.
- **Outdated information** — deprecated APIs, superseded events, stale numbers.
- **Unverifiable claims** — assertions with no authoritative backing.

Spell-checkers, linters, and unit tests catch syntax and logic errors but **cannot catch semantic inaccuracy**. Manual fact-checking is slow and does not scale. DeepAudit AI automates that fact-checking loop and grounds every verdict in real web sources.

---

## 3. System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                  CLIENT (Next.js + Tailwind)                  │
│   Text input · 1-click presets · Trust gauge · Claim cards    │
│   · Summary stats · Gateway metrics panel · JSON export       │
└───────────────┬──────────────────────────────▲───────────────┘
                │ POST /api/audit               │ AuditReport JSON
                ▼                               │
┌──────────────────────────────────────────────────────────────┐
│            AUDIT ENGINE  (Next.js API Route)                  │
│                                                               │
│  Step 1  Claim Extraction  ── via LLM gateway wrapper ──┐     │
│          (text → atomic factual claims as JSON)          │    │
│                                                          ▼    │
│  Step 2  Tavily Search  ◄── one query per claim, in parallel │
│          (real-time web grounding + citations)           │    │
│                                                          ▼    │
│  Step 3  Verification Scoring                                 │
│          claim + sources → status + confidence + reasoning   │
│          🟢 verified  🟡 outdated  🔴 hallucinated  ⚪ unverifiable │
│                                                          ▼    │
│  Step 4  Trust Score aggregation (0–100)                      │
└──────────────────────────────────────────────────────────────┘
        │                                   │
        ▼                                   ▼
  LLM GATEWAY WRAPPER                  TAVILY SEARCH API
  (OpenAI-compatible;                 (live web search;
   demo mode by default,              demo simulation when
   "Bifrost / Maxim AI" layer)        no key is set)
```

### Request lifecycle

1. The browser `POST`s `{ text }` to `/api/audit`.
2. The route enforces **rate limiting** (10 req/min per client) and **input size caps** (max 20,000 chars; min 10 chars).
3. The text is sent to the **LLM gateway wrapper** (`callThroughBifrost`) with a claim-extraction prompt.
4. Extracted claims are parsed to a typed array.
5. Every claim is verified **concurrently** (`Promise.all`) against Tavily.
6. Each claim is scored (by an LLM judge when a live key exists, otherwise by a deterministic heuristic scorer).
7. An overall **Trust Score** is computed and the full `AuditReport` is returned as JSON and rendered.

---

## 4. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript 5 |
| Styling | Tailwind CSS 4 (Turbopack), custom CSS animations |
| Backend | Next.js API Routes (server-side) |
| Web search | **Tavily Search API** (`api.tavily.com/search`, `search_depth: advanced`) |
| LLM gateway | OpenAI-compatible wrapper (branded "Bifrost / Maxim AI"); demo mode by default |
| Deployment | Vercel |

The LLM wrapper is deliberately provider-agnostic — the same code targets OpenAI, Groq, Google Gemini's compatibility endpoint, or a self-hosted gateway, selected entirely through environment variables.

---

## 5. Project Structure

```
deepaudit-ai/
├── src/
│   ├── app/
│   │   ├── api/audit/route.ts      # Main audit endpoint (orchestrator)
│   │   ├── layout.tsx              # Root layout + SEO metadata
│   │   ├── page.tsx                # Dashboard UI (client component)
│   │   └── globals.css             # Theme + animations
│   ├── components/
│   │   ├── Header.tsx              # App header + sponsor badges
│   │   ├── TrustScoreGauge.tsx     # Animated SVG 0–100 gauge
│   │   ├── ClaimCard.tsx           # Expandable per-claim card + sources
│   │   ├── SummaryStats.tsx        # Aggregate counts + distribution bar
│   │   └── BifrostMetricsPanel.tsx # Gateway observability panel
│   └── lib/
│       ├── types.ts                # Shared TypeScript types
│       ├── tavily.ts               # Tavily integration + demo simulation
│       ├── bifrost.ts              # LLM gateway wrapper + demo simulation
│       ├── claim-extractor.ts      # Parsing, LLM judge, heuristic scorer
│       └── presets.ts              # Demo presets for judges
├── .env.example                    # Documented env vars (all optional)
├── package.json
└── README.md
```

---

## 6. Core Modules — Detailed

### 6.1 `lib/types.ts` — Data contracts

Central type definitions shared across front-end and back-end:

- **`VerificationStatus`** — `"verified" | "outdated" | "hallucinated" | "unverifiable"`.
- **`ExtractedClaim`** — `{ id, text, category }` where category ∈ factual / statistical / temporal / technical / attribution.
- **`TavilySource`** — `{ title, url, snippet, publishedDate?, score }`.
- **`ClaimVerification`** — a claim plus its `status`, `confidence` (0–100), `sources[]`, `reasoning`, and optional `correctedInfo`.
- **`AuditReport`** — the full response: input text, timestamp, all claim verifications, overall trust score, per-status counts, and gateway metrics.
- **`BifrostMetrics`** — `{ totalTokensUsed, totalLatencyMs, modelUsed, guardrailsTriggered[], costEstimateUsd, gatewayStatus, gatewayNotice? }`. `gatewayStatus` is `"live" | "demo" | "error"` and is surfaced in the UI so a silent simulation can never be mistaken for a live result.

### 6.2 `app/api/audit/route.ts` — Orchestrator

The single backend endpoint. Responsibilities:

- **Abuse controls:** in-memory fixed-window rate limiter (10 requests / 60s keyed on `x-forwarded-for` / `x-real-ip`), and a 20,000-character input cap.
- **Validation:** rejects text under 10 characters or over the cap with clear `400` messages.
- **Pipeline:** builds the extraction prompt → calls the gateway → parses claims → verifies all claims in parallel → computes the trust score → assembles and returns the `AuditReport`.
- **Error handling:** returns friendly, non-leaking error messages with proper HTTP status codes (`400`, `429`, `500`).

### 6.3 `lib/tavily.ts` — Real-time web grounding (primary sponsor integration)

- Calls `https://api.tavily.com/search` with `search_depth: "advanced"`, `max_results: 5`, `include_answer: true`.
- Maps Tavily results into the internal `TavilySource` shape (title, url, 300-char snippet, publication date, relevance score) and returns Tavily's synthesized `answer`.
- **Graceful degradation:** if no key is set (`demo`), the HTTP call fails, or the response is not OK, it falls back to `simulateTavilySearch()` — a hand-built knowledge base with realistic, cited responses for the demo scenarios (Next.js RSC, OpenAI/Sam Altman, Python 3.13 GIL, SpaceX/Mars) plus a sensible generic fallback. This is what makes the zero-key demo convincing.

### 6.4 `lib/bifrost.ts` — LLM gateway wrapper

- `callThroughBifrost()` sends an OpenAI-style `/chat/completions` request to any configured endpoint with a bearer key.
- **Smart model routing** (`selectModel`): prompts containing high-risk words (medical, legal, financial, security, vulnerability, compliance) route to a stricter model; everything else routes to a cheaper/faster model. Model names are env-configurable (`BIFROST_MODEL`, `BIFROST_MODEL_FAST`).
- **Guardrail detection** (`detectGuardrails`): flags prompt-injection patterns ("ignore instructions"), credential-leak risk (password / api_key / secret), and context overflow (>10k chars).
- **Observability:** returns token usage, latency, model used, estimated cost, and a `gatewayStatus`.
- **Honest fallback:** if the gateway is configured but returns an HTTP error or is unreachable, it falls back to simulation but marks `gatewayStatus: "error"` with a visible notice — never silently pretending a simulated result is live. With no key, status is `"demo"`.

> This is the layer that was **planned to run on Bifrost (Maxim AI)** but, due to the late start and 5-hour limit, ships in **demo/simulation mode**. The abstraction is intact, so pointing it at a real gateway is a configuration change, not a code change.

### 6.5 `lib/claim-extractor.ts` — Parsing + judging + scoring

Three responsibilities:

1. **`parseClaimsFromLLMResponse`** — robustly parses the model's JSON array of claims, with a sentence-splitting fallback if the output isn't valid JSON.
2. **`judgeClaimWithLLM`** (preferred path, live mode only) — an **LLM-as-judge**: the model reads the retrieved Tavily sources and rules strictly on the claim (verified / outdated / hallucinated / unverifiable) with confidence, reasoning, and corrected info. This prevents a false claim from being rubber-stamped just because sources are topically relevant. Returns `null` on any failure to trigger the fallback.
3. **`scoreClaim`** (heuristic fallback, demo mode) — a deterministic scorer using: top/average source relevance, contradiction keywords ("not", "never", "deprecated", "no longer"…), temporal staleness detection (year regex vs. current year), and a few curated patterns for the demo presets (RSC "deprecated", Python GIL "removed", SpaceX "landed on Mars").

**`calculateOverallTrustScore`** aggregates per-claim verdicts using status weights (verified 1.0, outdated 0.4, unverifiable 0.3, hallucinated 0.0) multiplied by each claim's confidence, producing a 0–100 score.

### 6.6 `lib/presets.ts` — Judge-friendly demos

Three one-click scenarios:

- **💻 Tech Hallucination** — expects RSC-deprecation claim to be flagged 🔴 Hallucinated.
- **📰 Outdated Information** — expects the Python-GIL / SpaceX-Mars claims to be flagged 🟡 Outdated / 🔴 Hallucinated.
- **✅ Verified Claims** — mostly true statements that should come back 🟢 Verified.

---

## 7. Front-End Components

| Component | Role |
|---|---|
| `Header` | Sticky header, logo, live-pulse dot, Tavily + Bifrost sponsor badges. |
| `page.tsx` | Dashboard: hero, 5-step pipeline explainer, preset buttons, textarea with character counter, loading state, results, JSON export, footer. |
| `TrustScoreGauge` | Animated SVG circular gauge (ease-out cubic over 1.2s) with contextual labels ("Highly Trustworthy" → "Likely Unreliable"). |
| `SummaryStats` | 5-cell count grid (total / verified / outdated / hallucinated / unverifiable) plus a grayscale distribution bar. |
| `ClaimCard` | Expandable card per claim: status pill, category, confidence %, analysis, corrected info, and clickable sources. **Validates every source URL to `http(s)` only** before rendering an anchor. |
| `BifrostMetricsPanel` | Live/Demo/Error badge, status notice, tokens / latency / model / cost tiles, and guardrail chips. |

**Theme:** a deliberately monochrome ("cyber mono") black-and-white design. Status is distinguished by icon and border weight rather than color, keeping it legible and accessible.

---

## 8. Security & Hardening

Despite the 5-hour build, several production-minded safeguards are in place:

- **Rate limiting** — 10 requests/minute per client on the audit endpoint.
- **Input size caps** — 20,000-character maximum; 10-character minimum.
- **Server-only secrets** — all API keys are read from server-side `process.env`; nothing is exposed to the browser.
- **URL-scheme validation** — source links from the external search API are parsed and allowed only if `http:`/`https:`, blocking `javascript:` / `data:` injection via an `<a href>`.
- **Honest gateway status** — simulated or failed results are explicitly labeled in the UI; a fallback can never masquerade as a live LLM verdict.
- **Guardrail detection** — prompt-injection, credential-leak, and context-overflow heuristics on every prompt.
- **Safe error messages** — internal errors return generic messages without leaking stack traces.

---

## 9. Configuration (Environment Variables)

All variables are **optional** — the app runs in demo mode with none set.

| Variable | Purpose |
|---|---|
| `TAVILY_API_KEY` | Tavily Search key. `demo` or unset → simulated search. |
| `BIFROST_API_KEY` | LLM gateway key. `demo` or unset → simulated LLM. |
| `BIFROST_GATEWAY_URL` | OpenAI-compatible `/chat/completions` endpoint. |
| `BIFROST_MODEL` | Model for high-risk / complex prompts (default `gpt-4o`). |
| `BIFROST_MODEL_FAST` | Cheap model for low-risk prompts (default `gpt-4o-mini`). |

The wrapper works against OpenAI, Groq, Gemini's compat endpoint, or a self-hosted gateway — pick one and copy its quick-config into `.env.local`.

---

## 10. Running Locally

```bash
git clone https://github.com/saadcheema-6242/global-ai-hackathon-deepaudit-project.git
cd global-ai-hackathon-deepaudit-project
npm install
cp .env.example .env.local   # optional — demo mode needs no keys
npm run dev                  # http://localhost:3000
```

Then open the app and click a preset, or paste your own text and press **Run Deep Audit**.

---

## 11. What Was Planned vs. Delivered (5-Hour Reality)

| Planned | Delivered |
|---|---|
| Route all LLM calls through **Bifrost (Maxim AI)** gateway | Provider-agnostic gateway **wrapper** with routing, guardrails, and observability — running in **demo/simulation mode** (Bifrost not wired up in time) |
| Live LLM claim extraction + LLM-as-judge | Code path exists and activates with a real key; demo uses a deterministic heuristic scorer |
| **Tavily Search API** for web grounding | ✅ **Delivered** — the real, working fact-checking integration |
| Interactive trust report | ✅ Delivered — gauge, claim cards, sources, metrics, JSON export |
| Deployed, zero-setup demo | ✅ Delivered — live on Vercel, works with no keys |

**Honest framing for judges:** given the late entry and 5-hour window, the team prioritized a fully working, end-to-end, deployable demo grounded in **Tavily** over a half-finished Bifrost integration. The gateway abstraction is production-shaped so Bifrost can be dropped in later via configuration alone.

---

## 12. Known Limitations & Honest Disclosures

This was a **~5-hour, late-start build**. In the interest of transparency:

1. **Bifrost not wired up** — the LLM gateway runs in **demo/simulation mode by default**; without a real LLM key, extraction and judging use a deterministic heuristic rather than a true LLM.
2. **Demo mode is simulated** — with no Tavily/LLM keys, results come from a built-in knowledge base tuned for the preset scenarios; arbitrary text gets a generic fallback verdict.
3. **Heuristic scorer is approximate** — relies on source relevance, contradiction keywords, and curated preset patterns; can mislabel nuanced claims.
4. **In-memory rate limiter** — resets on restart and isn't shared across serverless instances.
5. **No persistence** — audit history isn't stored; reports are export-only JSON.
6. **Trust score is a heuristic aggregate, not proof of truth** — always verify critical claims manually.
7. **Scope caps** — up to 10 claims per audit; 20,000-character input cap; English-focused.
8. **Third-party dependency** — live mode depends on Tavily / the chosen LLM provider's availability and cost.
9. **Not a replacement for professional fact-checking.**

## 13. Credits

**Built by Muhammad Saad Cheema** — [@saadcheema-6242](https://github.com/saadcheema-6242).
Solo project, designed and built in **~5 hours** after a late entry to the **HackCulture Global AI Hackathon** (by Geek Room). Sponsor tech: **Tavily Search API** (delivered, live) and **Bifrost / Maxim AI** gateway (planned, demo mode).

## 14. Future Work

- Wire the gateway to a live **Bifrost (Maxim AI)** endpoint and enable true LLM-as-judge verification.
- Persist audit history (Postgres / Upstash) and shareable report links.
- Replace the in-memory rate limiter with a shared store (Upstash Redis) for multi-instance deployments.
- Batch / stream claim verification for large documents.
- Browser extension to audit any page or chatbot answer in place.

---

*Documentation generated from a full source-code review of the repository.*
