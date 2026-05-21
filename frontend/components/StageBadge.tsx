const STAGE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  early_spark: { label: "Early Spark", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  building_connection: { label: "Building Connection", color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
  clear_interest: { label: "Clear Interest", color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
  fence_sitter: { label: "Fence Sitter", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  friendly_only: { label: "Friendly Only", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
  unclear: { label: "Still Unclear", color: "#6b7280", bg: "rgba(107,114,128,0.15)" },
};

export default function StageBadge({ stage }: { stage: string }) {
  const cfg = STAGE_CONFIG[stage] ?? STAGE_CONFIG.unclear;
  return (
    <span
      className="stage-badge"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}40` }}
    >
      {cfg.label}
    </span>
  );
}
