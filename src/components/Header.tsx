// ============================================================
// DeepAudit AI — Header Component
// ============================================================
"use client";

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20">
              DA
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              DeepAudit
              <span className="text-cyan-400 ml-1">AI</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">
              Real-Time Hallucination Detector
            </p>
          </div>
        </div>

        {/* Sponsor Badges */}
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 px-3 py-1.5 rounded-full border border-cyan-500/20 font-medium">
            ⚡ Powered by Tavily
          </span>
          <span className="text-xs bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-400 px-3 py-1.5 rounded-full border border-purple-500/20 font-medium">
            🛡️ Bifrost Gateway
          </span>
        </div>
      </div>
    </header>
  );
}
