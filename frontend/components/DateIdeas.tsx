"use client";

import { useState } from "react";

interface DateIdea {
  name: string;
  concept: string;
  why_perfect: string;
  vibe: string;
  effort_level: string;
  cost_range: string;
  when_to_suggest: string;
  how_to_invite: string;
  backup_plan: string;
}

interface Props {
  dateIdeas: DateIdea[];
  idealFirstDate: string;
  proTips: string[];
  theirName: string | null;
}

const VIBE_EMOJI: Record<string, string> = {
  romantic: "🌹",
  fun: "🎉",
  adventurous: "🧗",
  cozy: "☕",
  intellectual: "📚",
  spontaneous: "⚡",
};

const EFFORT_STYLE: Record<string, string> = {
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-purple-400",
};

const COST_STYLE: Record<string, string> = {
  free: "text-green-400",
  "$": "text-green-400",
  "$$": "text-yellow-400",
  "$$$": "text-orange-400",
};

export default function DateIdeas({ dateIdeas, idealFirstDate, proTips, theirName }: Props) {
  const [expanded, setExpanded] = useState<number | null>(0);

  if (!dateIdeas.length) return null;

  return (
    <div className="glass p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wide">
          Curated Date Ideas {theirName ? `for ${theirName}` : ""}
        </h3>
        <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full border border-purple-500/20">
          {dateIdeas.length} ideas
        </span>
      </div>

      <div className="space-y-3">
        {dateIdeas.map((idea, i) => (
          <div
            key={i}
            className="date-card border border-white/8 rounded-xl overflow-hidden cursor-pointer"
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <div className="px-4 py-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{VIBE_EMOJI[idea.vibe] ?? "💫"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-semibold text-white">{idea.name}</h4>
                    <span className="text-xs text-white/40 capitalize">{idea.vibe}</span>
                  </div>
                  <p className="text-sm text-white/65 mt-1 leading-relaxed">{idea.concept}</p>

                  <div className="flex items-center gap-4 mt-2.5 text-xs">
                    <span className={`${EFFORT_STYLE[idea.effort_level] ?? "text-white/40"}`}>
                      Effort: {idea.effort_level}
                    </span>
                    <span className={`${COST_STYLE[idea.cost_range] ?? "text-white/40"}`}>
                      {idea.cost_range}
                    </span>
                    <span className="text-white/40">{idea.when_to_suggest}</span>
                  </div>
                </div>
              </div>
            </div>

            {expanded === i && (
              <div className="border-t border-white/5 px-4 py-4 space-y-3 bg-white/2">
                <div>
                  <p className="text-xs text-purple-400 font-medium mb-1">Why this works for them</p>
                  <p className="text-sm text-white/75">{idea.why_perfect}</p>
                </div>
                <div>
                  <p className="text-xs text-pink-400 font-medium mb-1">How to bring it up</p>
                  <p className="text-sm text-white/75 italic">&ldquo;{idea.how_to_invite}&rdquo;</p>
                </div>
                <div>
                  <p className="text-xs text-yellow-400 font-medium mb-1">If they say no</p>
                  <p className="text-sm text-white/65">{idea.backup_plan}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {idealFirstDate && (
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
          <p className="text-xs font-semibold text-purple-400 mb-1.5">Wingman Pick: Best First Date</p>
          <p className="text-sm text-white/80">{idealFirstDate}</p>
        </div>
      )}

      {proTips.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wide mb-2.5">Pro Tips</p>
          <div className="space-y-2">
            {proTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                <span className="text-yellow-400 flex-shrink-0">★</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
