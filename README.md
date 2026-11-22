<p align="center">
  <img src="https://img.shields.io/badge/DeepAudit-AI-00bcd4?style=for-the-badge" alt="DeepAudit AI" />
  <img src="https://img.shields.io/badge/Powered_by-Tavily_Search_API-06b6d4?style=for-the-badge" alt="Tavily" />
  <img src="https://img.shields.io/badge/Gateway-Bifrost_(Maxim_AI)-8b5cf6?style=for-the-badge" alt="Bifrost" />
  <img src="https://img.shields.io/badge/Built_in-~5_hours-fbbf24?style=for-the-badge" alt="5 hours" />
</p>

<h1 align="center">🔍 DeepAudit AI</h1>
<h3 align="center">Real-Time AI Hallucination & Fact-Verification Engine</h3>

<p align="center">
  <a href="https://global-ai-hackathon-deepaudit-proje.vercel.app/">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Open_App-000000?style=for-the-badge" alt="Live Demo" />
  </a>
</p>

<p align="center">
  <b>🌐 Live demo:</b> <a href="https://global-ai-hackathon-deepaudit-proje.vercel.app/">global-ai-hackathon-deepaudit-proje.vercel.app</a><br/>
  <b>🖥️ Slides (in-browser):</b> <a href="https://global-ai-hackathon-deepaudit-proje.vercel.app/slides.html">/slides.html</a> ·
  <b>📖 Docs:</b> <a href="https://global-ai-hackathon-deepaudit-proje.vercel.app/documentation.html">/documentation.html</a>
</p>

<p align="center">
  <i>Built for the <b>HackCulture Global AI Hackathon</b> by Geek Room</i>
</p>

---

## ⏱️ A quick, honest note (please read)

I **joined this hackathon late**, so this entire project was designed, built, and deployed in roughly **5 hours**.

My original plan was to route every LLM call through the **Bifrost (Maxim AI) gateway**. I had it in my plan, but I **could not get the Bifrost integration working inside the time window**. So I made a deliberate call: ship a **fully working, deployed, end-to-end demo grounded in the Tavily Search API** (which does the real fact-checking) rather than a half-finished gateway.

The LLM-gateway layer is still in the codebase as a **provider-agnostic, OpenAI-compatible wrapper** that runs in **demo / simulation mode** by default — the abstraction is production-shaped, so Bifrost (or any OpenAI-compatible provider) can be dropped in later through configuration alone. See **[Limitations](#️-limitations--honest-disclosures)** for the full honest breakdown.

---

## 🎯 Problem

Large Language Models generate convincing text that often contains:
- **Hallucinated facts** — statements that sound real but are fabricated
- **Outdated information** — deprecated APIs, old data, or superseded events
- **Unverifiable claims** — assertions with no authoritative backing

Spell-checkers, linters, and unit tests **cannot catch semantic inaccuracies**. Manual fact-checking is slow and doesn't scale.

## 💡 Solution

**DeepAudit AI** is an autonomous fact-verification engine that:

1. **Extracts** atomic factual claims from any text using LLM-powered decomposition
2. **Verifies** each claim against real-time web sources via the **Tavily Search API**
3. **Routes** AI processing through a **Bifrost (Maxim AI)-style gateway** layer for model routing, guardrails, and observability *(runs in demo mode — see note above)*
4. **Generates** an interactive, color-coded audit report with a 0–100 trust score and citations

## 🎨 Features

- ✅ **One-Click Demo Presets** — Tech Hallucination, Outdated News, and Verified Facts scenarios for instant testing
- ✅ **Animated Trust Score Gauge** — SVG circular gauge with smooth easing and contextual labels
- ✅ **Color-Coded Claim Cards** — 🟢 Verified / 🟡 Outdated / 🔴 Hallucinated / ⚪ Unverifiable, each expandable with evidence
- ✅ **Source Citations** — Direct links to web sources with publication dates and relevance scores
- ✅ **Gateway Metrics Panel** — Token count, latency, model routing, cost estimate, and guardrail status, with an honest **live / demo / error** badge
- ✅ **JSON Report Export** — Download the full audit report for archival or sharing
- ✅ **In-Browser Pitch Deck & Docs** — `/slides.html` and `/documentation.html` for judges, no download required
- ✅ **Hardened by default** — rate limiting, input-size caps, URL-scheme validation, and server-only API keys
- ✅ **Zero-Setup Demo Mode** — works fully without any API keys, so anyone can test the complete flow instantly
- ✅ **Dark/Light, fully responsive UI**

## 🏗️ How It Works (Pipeline)

```
Your text
   │
   ▼  Step 1 — Extract claims     (LLM gateway wrapper: Bifrost-style, demo by default)
   │   text → atomic factual claims (JSON)
   ▼  Step 2 — Verify each claim  (Tavily Search API, in parallel — one query per claim)
   │   live web snippets + citations + relevance scores
   ▼  Step 3 — Score each claim   (LLM-as-judge when a key is set, else heuristic scorer)
   │   verified / outdated / hallucinated / unverifiable + confidence + reasoning
   ▼  Step 4 — Aggregate
       weighted 0–100 Trust Score + exportable JSON report
```

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript 5 |
| Styling | Tailwind CSS 4 (Turbopack), custom animations |
| Backend | Next.js API Routes (server-side) |
| Web Search | **Tavily Search API** (`search_depth: advanced`) |
| AI Gateway | OpenAI-compatible wrapper (Bifrost / Maxim AI style) — demo mode by default |
| Deployment | Vercel |

## 🚀 Setup Guide (Detailed)

### Prerequisites
- **Node.js 18+** (Node 20+ recommended) and **npm**
- Git
- *(Optional)* A **Tavily API key** and any **OpenAI-compatible LLM key** for live mode

### 1. Clone & install

```bash
git clone https://github.com/saadcheema-6242/global-ai-hackathon-deepaudit-project.git
cd global-ai-hackathon-deepaudit-project
npm install
```

### 2. Configure environment (optional — demo mode needs no keys)

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

| Variable | Required | Description |
|---|---|---|
| `TAVILY_API_KEY` | Optional | Tavily key — [get one free](https://app.tavily.com). `demo`/unset → simulated search |
| `BIFROST_API_KEY` | Optional | LLM gateway key. `demo`/unset → simulated LLM |
| `BIFROST_GATEWAY_URL` | Optional | OpenAI-compatible `/chat/completions` endpoint |
| `BIFROST_MODEL` | Optional | Model for high-risk/complex prompts (default `gpt-4o`) |
| `BIFROST_MODEL_FAST` | Optional | Cheap model for low-risk prompts (default `gpt-4o-mini`) |

> 💡 **Demo Mode:** With **no keys**, the app runs on intelligent local simulation with realistic, cited responses for the demo scenarios — so judges can test the complete flow immediately. Add real keys to switch to live web search + LLM judging.

**Live-mode quick configs** (pick one, paste into `.env.local`):

```bash
# Groq (free, fast, OpenAI-compatible)
BIFROST_API_KEY=gsk_...
BIFROST_GATEWAY_URL=https://api.groq.com/openai/v1/chat/completions
BIFROST_MODEL=llama-3.3-70b-versatile
BIFROST_MODEL_FAST=llama-3.1-8b-instant
```

### 3. Run locally

```bash
npm run dev     # http://localhost:3000
```

### 4. Build & deploy

```bash
npm run build   # production build
npm start       # serve the production build
# or deploy to Vercel:  vercel --prod
```

## 🧪 Try It — Sample Test Inputs

Paste any of these into the app (or use the one-click presets), then **Run Deep Audit**:

1. **Tech hallucination (should flag 🔴):**
   > "Next.js 15 completely deprecated React Server Components in late 2025, forcing all developers back to client-side rendering."

2. **Outdated / fabricated (should flag 🟡 / 🔴):**
   > "Python 3.13 completely removed the GIL, and SpaceX successfully landed humans on Mars in September 2025."

3. **Mostly true (should flag 🟢):**
   > "TypeScript is a statically-typed superset of JavaScript developed by Microsoft. Node.js is built on Chrome's V8 engine."

## 📁 Project Structure

```
deepaudit-ai/
├── src/
│   ├── app/
│   │   ├── api/audit/route.ts    # Main audit API endpoint (orchestrator)
│   │   ├── layout.tsx            # Root layout + metadata
│   │   ├── page.tsx              # Main dashboard page
│   │   └── globals.css           # Global styles
│   ├── components/               # Header, TrustScoreGauge, ClaimCard, SummaryStats, BifrostMetricsPanel
│   └── lib/                      # types, tavily, bifrost, claim-extractor, presets
├── public/
│   ├── slides.html               # In-browser pitch deck (for judges)
│   ├── documentation.html        # In-browser documentation
│   └── DeepAudit-AI-Presentation.pptx
├── .env.example
├── package.json
└── README.md
```

## ⚠️ Limitations & Honest Disclosures

This was a **~5-hour, late-start build**, so some things are intentionally scoped down. Being transparent:

1. **Bifrost not wired up.** The LLM gateway is a provider-agnostic wrapper that runs in **demo/simulation mode by default**. Without a real LLM key, claim extraction and judging use a **deterministic heuristic**, not a true LLM.
2. **Demo mode is simulated.** Without Tavily + LLM keys, results come from a built-in knowledge base tuned for the **preset scenarios**; arbitrary text gets a sensible but **generic** fallback verdict.
3. **Heuristic scorer is approximate.** It relies on source relevance + contradiction keywords + a few curated patterns for the presets. It can **mislabel** nuanced or ambiguous claims.
4. **In-memory rate limiter.** Resets on restart and isn't shared across serverless instances — fine for a demo, not for scale (swap for Upstash Redis in production).
5. **No persistence.** Audit history isn't stored; reports are export-only JSON.
6. **The trust score is a heuristic aggregate, not proof of truth.** Always verify critical claims yourself.
7. **Scope caps.** Up to 10 claims per audit; input capped at 20,000 characters; English-focused.
8. **Third-party dependency.** Live mode depends on Tavily / the chosen LLM provider's availability and costs.
9. **Not a replacement for professional fact-checking.**

## 🗺️ Future Work

- Wire up a **live Bifrost (Maxim AI)** endpoint and enable true LLM-as-judge verification
- Persist audit history (Postgres / Upstash) + shareable report links
- Shared rate limiter (Upstash Redis) for multi-instance deployments
- Streamed verification for long documents
- Browser extension to audit any page or chatbot answer in place

## 👤 Credits

**Built by Muhammad Saad Cheema** — [@saadcheema-6242](https://github.com/saadcheema-6242)

- Solo project, designed and built in **~5 hours** after a late hackathon entry
- **HackCulture Global AI Hackathon** (by Geek Room)
- Sponsor tech: **Tavily Search API** (delivered, live) · **Bifrost / Maxim AI** gateway (planned, demo mode)

Thanks to the organizers and sponsors for the challenge. 🙏

## 📄 License

MIT License — Built for the HackCulture Global AI Hackathon.
