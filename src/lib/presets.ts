// ============================================================
// DeepAudit AI — Demo Presets for Judges
// ============================================================

import { AuditPreset } from "./types";

export const AUDIT_PRESETS: AuditPreset[] = [
  {
    id: "tech-hallucination",
    label: "Tech Hallucination",
    emoji: "💻",
    description: "An AI-generated tech claim with a critical hallucination",
    expectedOutcome: "Should flag RSC deprecation as 🔴 Hallucinated",
    text: `Next.js 15 completely deprecated React Server Components (RSC) in late 2025, forcing all developers to migrate back to client-side rendering. The React team announced this was due to performance overhead and complexity. Additionally, TypeScript 6.0 was released in January 2026 with native support for runtime type checking, eliminating the need for Zod or io-ts validation libraries. Meanwhile, Vercel's new V0 AI tool can generate production-ready full-stack applications with zero human intervention, achieving 99.8% code accuracy.`,
  },
  {
    id: "outdated-facts",
    label: "Outdated Information",
    emoji: "📰",
    description: "News & facts that have become stale or changed",
    expectedOutcome: "Should flag outdated Python GIL claim as 🟡 Outdated",
    text: `Python 3.13 completely removed the Global Interpreter Lock (GIL), making Python fully multi-threaded and as fast as C++ for CPU-bound tasks. OpenAI is still led by CEO Sam Altman who announced GPT-5 will be released exclusively as an open-source model. SpaceX successfully landed humans on Mars in September 2025 as part of the Starship program, making Elon Musk the first private citizen to fund an interplanetary mission.`,
  },
  {
    id: "verified-facts",
    label: "Verified Claims",
    emoji: "✅",
    description: "Mostly accurate, verifiable real-world facts",
    expectedOutcome: "Should flag most claims as 🟢 Verified",
    text: `TypeScript is a statically-typed superset of JavaScript developed by Microsoft. React is a JavaScript library for building user interfaces, originally created by Facebook (Meta). The Rust programming language consistently tops developer satisfaction surveys and is known for memory safety without garbage collection. Node.js is built on Chrome's V8 JavaScript engine and enables server-side JavaScript execution.`,
  },
];
