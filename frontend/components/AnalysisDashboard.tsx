"use client";

import ScoreRing from "./ScoreRing";
import StageBadge from "./StageBadge";
import FlagsList from "./FlagsList";
import NextSteps from "./NextSteps";
import DateIdeas from "./DateIdeas";

interface AnalysisResult {
  engagement_score: number;
  warmth_score: number;
  reciprocity_score: number;
  intent_score: number;
  overall_sentiment: string;
  energy_level: string;
  communication_style: string;
  emotional_tone_summary: string;
  their_name: string | null;
  their_interests: string[];
  shared_interests: string[];
  notable_topics: string[];
  future_hooks: string[];
  confidence: string;
  invite_ready: boolean;
  green_flags: { flag: string; evidence: string }[];
  red_flags: { flag: string; evidence: string }[];
  disinterest_signals: string[];
  mixed_signals: string[];
  stage: string;
  honest_assessment: string;
  wingman_verdict: string;
  urgency: string;
  next_steps: {
    action: string;
    why: string;
    how: string;
    message_example: string | null;
    timing: string;
    priority: string;
  }[];
  what_not_to_do: string[];
  conversation_starters: string[];
  date_ideas: {
    name: string;
    concept: string;
    why_perfect: string;
    vibe: string;
    effort_level: string;
    cost_range: string;
    when_to_suggest: string;
    how_to_invite: string;
    backup_plan: string;
  }[];
  ideal_first_date: string;
  pro_tips: string[];
}

interface Props {
  result: AnalysisResult;
}

const URGENCY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  act_now: { label: "Act Now", color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
  take_your_time: { label: "Take Your Time", color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
  cool_off: { label: "Cool Off", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  proceed_with_caution: { label: "Proceed with Caution", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
};

export default function AnalysisDashboard({ result }: Props) {
  const urgency = URGENCY_CONFIG[result.urgency] ?? URGENCY_CONFIG.proceed_with_caution;

  return (
    <div className="space-y-6 fade-in">
      {/* Wingman Verdict Banner */}
      <div className="glass p-5 border border-purple-500/20 glow-purple">
        <div className="flex items-start gap-3">
          <span className="text-3xl flex-shrink-0">🪄</span>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Wingman Verdict</span>
              <StageBadge stage={result.stage} />
              <span
                className="stage-badge"
                style={{ color: urgency.color, background: urgency.bg, border: `1px solid ${urgency.color}40` }}
              >
                {urgency.label}
              </span>
              {result.invite_ready && (
                <span className="stage-badge" style={{ color: "#22c55e", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)" }}>
                  Ask Them Out ✓
                </span>
              )}
            </div>
            <p className="text-white/90 leading-relaxed">{result.wingman_verdict}</p>
          </div>
        </div>
      </div>

      {/* Score Rings */}
      <div className="glass p-6">
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-6">Vibe Check</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
          <ScoreRing score={result.intent_score} label="Interest" />
          <ScoreRing score={result.engagement_score} label="Engagement" color="#ec4899" />
          <ScoreRing score={result.warmth_score} label="Warmth" color="#f59e0b" />
          <ScoreRing score={result.reciprocity_score} label="Reciprocity" color="#3b82f6" />
        </div>

        <div className="mt-6 p-4 bg-white/3 rounded-xl border border-white/5">
          <p className="text-sm text-white/70 leading-relaxed">{result.honest_assessment}</p>
        </div>
      </div>

      {/* Interests & Context */}
      {(result.their_interests.length > 0 || result.shared_interests.length > 0 || result.future_hooks.length > 0) && (
        <div className="glass p-6">
          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-4">
            {result.their_name ? `About ${result.their_name}` : "What the AI Learned"}
          </h3>
          <div className="space-y-4">
            {result.their_interests.length > 0 && (
              <div>
                <p className="text-xs text-white/40 mb-2">Their Interests</p>
                <div className="flex flex-wrap gap-2">
                  {result.their_interests.map((interest, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/15 text-purple-300 border border-purple-500/20">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {result.shared_interests.length > 0 && (
              <div>
                <p className="text-xs text-white/40 mb-2">Shared Vibes</p>
                <div className="flex flex-wrap gap-2">
                  {result.shared_interests.map((interest, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-pink-500/15 text-pink-300 border border-pink-500/20">
                      ✨ {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {result.future_hooks.length > 0 && (
              <div>
                <p className="text-xs text-white/40 mb-2">Future Hooks (use these!)</p>
                <div className="space-y-1.5">
                  {result.future_hooks.map((hook, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="text-yellow-400 mt-0.5">→</span>
                      <span>{hook}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Flags */}
      <FlagsList
        greenFlags={result.green_flags}
        redFlags={result.red_flags}
        disinterestSignals={result.disinterest_signals}
        mixedSignals={result.mixed_signals}
      />

      {/* Next Steps */}
      <NextSteps
        nextSteps={result.next_steps}
        whatNotToDo={result.what_not_to_do}
        conversationStarters={result.conversation_starters}
      />

      {/* Date Ideas */}
      {result.date_ideas.length > 0 && (
        <DateIdeas
          dateIdeas={result.date_ideas}
          idealFirstDate={result.ideal_first_date}
          proTips={result.pro_tips}
          theirName={result.their_name}
        />
      )}
    </div>
  );
}
