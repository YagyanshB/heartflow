"use client";

interface GreenFlag { flag: string; evidence: string; }
interface RedFlag { flag: string; evidence: string; }

interface Props {
  greenFlags: GreenFlag[];
  redFlags: RedFlag[];
  disinterestSignals: string[];
  mixedSignals: string[];
}

export default function FlagsList({ greenFlags, redFlags, disinterestSignals, mixedSignals }: Props) {
  const hasContent = greenFlags.length > 0 || redFlags.length > 0 || disinterestSignals.length > 0 || mixedSignals.length > 0;
  if (!hasContent) return null;

  return (
    <div className="glass p-6">
      <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-4">Signal Analysis</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {greenFlags.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-green-400 flex items-center gap-1.5 mb-3">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              Green Flags ({greenFlags.length})
            </p>
            {greenFlags.map((f, i) => (
              <div key={i} className="green-flag rounded-r-lg px-3 py-2.5">
                <p className="text-sm font-medium text-white/90">{f.flag}</p>
                {f.evidence && <p className="text-xs text-white/45 mt-0.5 italic">&ldquo;{f.evidence}&rdquo;</p>}
              </div>
            ))}
          </div>
        )}

        {redFlags.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-red-400 flex items-center gap-1.5 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
              Red Flags ({redFlags.length})
            </p>
            {redFlags.map((f, i) => (
              <div key={i} className="red-flag rounded-r-lg px-3 py-2.5">
                <p className="text-sm font-medium text-white/90">{f.flag}</p>
                {f.evidence && <p className="text-xs text-white/45 mt-0.5 italic">&ldquo;{f.evidence}&rdquo;</p>}
              </div>
            ))}
          </div>
        )}

        {disinterestSignals.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-red-300 flex items-center gap-1.5 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-300 inline-block" />
              Disinterest Signals
            </p>
            {disinterestSignals.map((s, i) => (
              <div key={i} className="red-flag rounded-r-lg px-3 py-2">
                <p className="text-sm text-white/80">{s}</p>
              </div>
            ))}
          </div>
        )}

        {mixedSignals.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-yellow-400 flex items-center gap-1.5 mb-3">
              <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
              Mixed Signals
            </p>
            {mixedSignals.map((s, i) => (
              <div key={i} className="mixed-flag rounded-r-lg px-3 py-2">
                <p className="text-sm text-white/80">{s}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
