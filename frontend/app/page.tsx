"use client";

import { useState, useRef } from "react";
import UploadSection from "@/components/UploadSection";
import AnalysisDashboard from "@/components/AnalysisDashboard";
import { Github, Heart, Sparkles, ChevronDown } from "lucide-react";

export default function Home() {
  const [result, setResult] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = (data: unknown) => {
    setResult(data);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-20 pb-16 px-4 text-center overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 mb-8">
            <Sparkles size={12} className="text-purple-400" />
            Powered by Multi-Agent AI &bull; Claude &bull; LangGraph
          </div>

          <h1 className="text-6xl sm:text-7xl font-bold mb-4 leading-tight tracking-tight">
            <span className="gradient-text">HeartFlow</span>
          </h1>

          <p className="text-xl sm:text-2xl text-white/70 font-light mb-3">
            Your AI Wingman
          </p>

          <p className="text-base text-white/45 max-w-xl mx-auto leading-relaxed mb-10">
            Paste a conversation or drop screenshots. Your personal wingman reads the vibe,
            scores intent, spots green and red flags, then curates the perfect date — all in seconds.
          </p>

          <a href="#analyze" className="inline-flex items-center gap-2 text-white/40 text-sm hover:text-white/70 transition-colors">
            Get started <ChevronDown size={16} />
          </a>
        </div>

        {/* Floating stats */}
        <div className="flex justify-center gap-6 mt-12 flex-wrap">
          {[
            { emoji: "📊", label: "Intent Scoring" },
            { emoji: "🚩", label: "Flag Detection" },
            { emoji: "💌", label: "Message Drafts" },
            { emoji: "🗓️", label: "Date Curation" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-white/60">
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section id="analyze" className="max-w-7xl mx-auto px-4 pb-24">
        <div className={`grid gap-8 ${result ? "grid-cols-1 lg:grid-cols-[420px,1fr]" : "grid-cols-1 max-w-xl mx-auto"}`}>

          {/* Left: Upload */}
          <div className={result ? "" : ""}>
            <UploadSection
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />

            {/* How it works */}
            {!result && !isLoading && (
              <div className="mt-6 glass p-5 space-y-3 fade-in-delay-1">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wide">How It Works</p>
                {[
                  ["1", "Paste or upload your conversation"],
                  ["2", "6 specialized agents analyze the vibe simultaneously"],
                  ["3", "Get intent score, flags, and personalized advice"],
                  ["4", "Your wingman curates the perfect date for them"],
                ].map(([num, text]) => (
                  <div key={num} className="flex items-start gap-3 text-sm text-white/60">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-xs text-purple-400 flex-shrink-0 mt-0.5">
                      {num}
                    </span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="mt-6 glass p-6 text-center fade-in">
                <div className="loading-ring mx-auto mb-4" />
                <p className="text-sm font-medium text-white/70 mb-1">Your wingman is on it...</p>
                <div className="space-y-1.5 text-xs text-white/35">
                  {[
                    "Reading the conversation...",
                    "Scoring engagement & warmth...",
                    "Detecting green and red flags...",
                    "Calculating intent...",
                    "Curating date ideas...",
                  ].map((step) => (
                    <p key={step}>{step}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Results */}
          {result && (
            <div ref={resultsRef}>
              <AnalysisDashboard result={result as Parameters<typeof AnalysisDashboard>[0]["result"]} />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-white/30 text-sm">
          <Heart size={14} className="text-pink-500" />
          <span>HeartFlow — Use with kindness & respect</span>
        </div>
        <p className="text-xs text-white/20 mt-2">Experimental AI system. For educational purposes.</p>
      </footer>
    </main>
  );
}
