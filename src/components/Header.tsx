// ============================================================
// DeepAudit AI — Header Component
// ============================================================
"use client";

export default function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-white font-bold text-lg">
              DA
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-neutral-900 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
              DeepAudit
              <span className="text-neutral-400 ml-1">AI</span>
            </h1>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
              Real-Time Hallucination Detector
            </p>
          </div>
        </div>

        {/* Sponsor Badges */}
        <div className="flex items-center gap-2">
          <span className="text-xs bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-full border border-neutral-200 font-medium">
            ⚡ Powered by Tavily
          </span>
          <span className="text-xs bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-full border border-neutral-200 font-medium">
            🛡️ Bifrost Gateway
          </span>
        </div>
      </div>
    </header>
  );
}
