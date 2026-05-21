"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

interface Step {
  action: string;
  why: string;
  how: string;
  message_example: string | null;
  timing: string;
  priority: string;
}

interface Props {
  nextSteps: Step[];
  whatNotToDo: string[];
  conversationStarters: string[];
}

const PRIORITY_STYLE: Record<string, string> = {
  high: "text-red-400 bg-red-500/10 border-red-500/20",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  low: "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors">
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function StepCard({ step, index }: { step: Step; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="border border-white/8 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/3 transition-colors"
      >
        <span className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">{step.action}</p>
          <p className="text-xs text-white/40 mt-0.5">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${PRIORITY_STYLE[step.priority] ?? PRIORITY_STYLE.medium} mr-2`}>
              {step.priority}
            </span>
            {step.timing}
          </p>
        </div>
        {open ? <ChevronUp size={16} className="text-white/30 flex-shrink-0" /> : <ChevronDown size={16} className="text-white/30 flex-shrink-0" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5">
          <div className="pt-3">
            <p className="text-xs text-white/40 mb-1">Why this matters</p>
            <p className="text-sm text-white/75">{step.why}</p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">How to do it</p>
            <p className="text-sm text-white/75">{step.how}</p>
          </div>
          {step.message_example && (
            <div className="bg-white/5 rounded-lg p-3 border border-purple-500/20">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-purple-400 font-medium">Message Example</p>
                <CopyButton text={step.message_example} />
              </div>
              <p className="text-sm text-white/85 italic">&ldquo;{step.message_example}&rdquo;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function NextSteps({ nextSteps, whatNotToDo, conversationStarters }: Props) {
  if (!nextSteps.length && !whatNotToDo.length) return null;

  return (
    <div className="glass p-6 space-y-6">
      <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wide">Your Move</h3>

      {nextSteps.length > 0 && (
        <div className="space-y-2">
          {nextSteps.map((step, i) => (
            <StepCard key={i} step={step} index={i} />
          ))}
        </div>
      )}

      {conversationStarters.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-3">Conversation Starters</p>
          <div className="space-y-2">
            {conversationStarters.map((starter, i) => (
              <div key={i} className="flex items-start justify-between gap-3 bg-white/4 rounded-lg px-3 py-2.5 border border-white/8">
                <p className="text-sm text-white/80 flex-1">{starter}</p>
                <CopyButton text={starter} />
              </div>
            ))}
          </div>
        </div>
      )}

      {whatNotToDo.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-3">What NOT to Do</p>
          <div className="space-y-1.5">
            {whatNotToDo.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-white/65">
                <span className="text-red-400 mt-0.5 flex-shrink-0">✕</span>
                <span>{w}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
