import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeepAudit AI — Real-Time Hallucination & Fact Checker",
  description:
    "Autonomous AI-powered fact verification engine. Detects hallucinations, outdated claims, and fabrications in LLM outputs using Tavily Search API and Bifrost AI Gateway.",
  keywords: [
    "AI fact checker",
    "hallucination detector",
    "LLM verification",
    "Tavily",
    "Bifrost",
    "DeepAudit",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 antialiased">{children}</body>
    </html>
  );
}
