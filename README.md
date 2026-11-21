<p align="center">
  <img src="https://img.shields.io/badge/DeepAudit-AI-00bcd4?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiI+PHBhdGggZD0iTTkgMTFsMyAzTDE1IDhNMjEgMTJhOSA5IDAgMTEtMTggMCA5IDkgMCAwMTE4IDB6Ii8+PC9zdmc+" alt="DeepAudit AI" />
  <img src="https://img.shields.io/badge/Powered_by-Tavily_Search_API-06b6d4?style=for-the-badge" alt="Tavily" />
  <img src="https://img.shields.io/badge/Gateway-Bifrost_(Maxim_AI)-8b5cf6?style=for-the-badge" alt="Bifrost" />
</p>

<h1 align="center">🔍 DeepAudit AI</h1>
<h3 align="center">Real-Time AI Hallucination & Fact Verification Engine</h3>

<p align="center">
  <i>Built for the <b>HackCulture Global AI Hackathon</b> by Geek Room</i>
</p>

---

## 🎯 Problem

Large Language Models (LLMs) generate convincing text that often contains:
- **Hallucinated facts** — statements that sound real but are fabricated
- **Outdated information** — referencing deprecated APIs, old data, or superseded events
- **Unverifiable claims** — assertions with no authoritative backing

Traditional spell-checkers, linters, and unit tests **cannot catch semantic inaccuracies**. Manual fact-checking is slow and doesn't scale.

## 💡 Solution

**DeepAudit AI** is an autonomous fact-verification engine that:

1. **Extracts** atomic factual claims from any text using LLM-powered decomposition
2. **Verifies** each claim against real-time web sources via **Tavily Search API**
3. **Routes** all AI processing through the **Bifrost (Maxim AI) Gateway** for security guardrails, model routing, and cost observability
4. **Generates** an interactive color-coded audit report with trust scores and citations

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     CLIENT (Next.js + Tailwind)                │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────────────┐│
│  │ Text     │  │ 1-Click Demo │  │ Audit Report              ││
│  │ Input    │  │ Presets      │  │ • Trust Score Gauge        ││
│  │ Area     │  │              │  │ • Color-coded Claim Cards  ││
│  │          │  │ 💻 Tech      │  │ • Source Citations         ││
│  │          │  │ 📰 News      │  │ • Bifrost Metrics Panel    ││
│  │          │  │ ✅ Verified  │  │ • JSON Export              ││
│  └────┬─────┘  └──────────────┘  └───────────────────────────┘│
│       │                                      ▲                 │
└───────┼──────────────────────────────────────┼─────────────────┘
        │ POST /api/audit                      │ Audit Report JSON
        ▼                                      │
┌───────────────────────────────────────────────────────────────┐
│              BIFROST AI GATEWAY (Maxim AI)                     │
│  • Prompt injection detection & guardrails                     │
│  • Smart model routing (risk-based)                            │
│  • Token usage & latency tracking                              │
│  • Cost estimation                                             │
└───────┬───────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│              AUDIT ENGINE (Next.js API Routes)                 │
│                                                                │
│  Step 1: LLM Claim Extraction ──────────────────┐             │
│    "Text → Atomic factual claims"                │             │
│                                                  ▼             │
│  Step 2: Tavily Search API ◄──── Concurrent queries per claim  │
│    Real-time web grounding with citations        │             │
│                                                  ▼             │
│  Step 3: Verification Scoring Engine                           │
│    Claim + Sources → Verdict + Confidence + Reasoning          │
│    🟢 Verified  🟡 Outdated  🔴 Hallucinated  ⚪ Unverifiable  │
└───────────────────────────────────────────────────────────────┘
```

## ⚡ Sponsor Tech Integration

### Tavily Search API (Real-Time Web Intelligence)
- **API endpoint:** `api.tavily.com/search` with `search_depth: "advanced"`
- **Usage:** Each extracted claim triggers a targeted Tavily search query
- **Value:** Provides real-time snippets, publication dates, relevance scores, and direct citation URLs
- **Impact:** Grounds LLM claims against live internet knowledge — the core fact-checking mechanism

### Bifrost (Maxim AI) Gateway
- **Role:** Acts as the AI gateway layer proxying all LLM calls
- **Security:** Detects prompt injection attempts and credential leak risks
- **Routing:** Routes low-risk extractions to fast/cheap models, high-risk domains to strict reasoning models
- **Observability:** Tracks tokens, latency, cost, and guardrail triggers in real-time

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/deepaudit-ai.git
cd deepaudit-ai

# Install dependencies
npm install

# Configure environment (optional — works in demo mode without keys)
cp .env.example .env.local
# Edit .env.local with your Tavily and Bifrost API keys

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `TAVILY_API_KEY` | Optional | Tavily API key ([get one free](https://app.tavily.com)) |
| `BIFROST_API_KEY` | Optional | Maxim AI / Bifrost gateway key |
| `BIFROST_GATEWAY_URL` | Optional | Bifrost gateway endpoint URL |

> **Demo Mode:** The app works fully without API keys using intelligent simulation with realistic responses. This ensures judges can test the complete flow immediately.

## 🎨 Features

- ✅ **One-Click Demo Presets** — Pre-loaded scenarios (Tech Hallucination, Outdated News, Verified Facts) for instant testing
- ✅ **Animated Trust Score Gauge** — SVG circular gauge with smooth animation and contextual labels
- ✅ **Color-Coded Claim Cards** — 🟢 Verified / 🟡 Outdated / 🔴 Hallucinated / ⚪ Unverifiable with expandable details
- ✅ **Source Citations** — Direct links to authoritative web sources with publication dates and relevance scores
- ✅ **Bifrost Metrics Panel** — Live token count, latency, model routing, cost estimation, and guardrail status
- ✅ **JSON Report Export** — Download complete audit reports for archival
- ✅ **Dark Mode Cyber UI** — Premium dark theme with glow effects and smooth animations
- ✅ **Fully Responsive** — Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, Custom animations |
| Backend | Next.js API Routes (Edge-compatible) |
| Search Engine | Tavily Search API |
| AI Gateway | Bifrost (Maxim AI) |
| Deployment | Vercel |

## 📁 Project Structure

```
deepaudit-ai/
├── src/
│   ├── app/
│   │   ├── api/audit/route.ts    # Main audit API endpoint
│   │   ├── layout.tsx            # Root layout with metadata
│   │   ├── page.tsx              # Main dashboard page
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── Header.tsx            # App header with sponsor badges
│   │   ├── TrustScoreGauge.tsx   # Animated SVG trust score
│   │   ├── ClaimCard.tsx         # Individual claim verification card
│   │   ├── SummaryStats.tsx      # Aggregate statistics bar
│   │   └── BifrostMetricsPanel.tsx # Gateway observability panel
│   └── lib/
│       ├── types.ts              # TypeScript type definitions
│       ├── tavily.ts             # Tavily Search API integration
│       ├── bifrost.ts            # Bifrost Gateway integration
│       ├── claim-extractor.ts    # Claim extraction & scoring engine
│       └── presets.ts            # Demo preset configurations
├── .env.example
├── .env.local
├── package.json
├── tsconfig.json
└── README.md
```

## 📄 License

MIT License — Built for the HackCulture Global AI Hackathon.
