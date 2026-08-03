// CSS-only bar visualisations to keep the reports dependency-free,
// consistent with the existing AnalyticsView styling.
import { scoreBarColor } from "./reportUtils";

export function ScoreBar({
  value,
  max = 100,
  label,
  showLabel = true,
}: {
  value: number | null | undefined;
  max?: number;
  label?: string;
  showLabel?: boolean;
}) {
  const pct = value === null || value === undefined ? 0 : Math.max(0, value);
  const width = Math.min((pct / max) * 100, 100);
  return (
    <div className="flex items-center gap-3">
      {showLabel && (
        <span className="text-xs text-muted-foreground flex-1 min-w-0 truncate">
          {label}
        </span>
      )}
      <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${scoreBarColor(value)}`}
          style={{ width: `${width}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-foreground w-10 text-right shrink-0">
          {value === null || value === undefined ? "—" : `${value}%`}
        </span>
      )}
    </div>
  );
}

export function DistributionBar({
  value,
  colorClass = "bg-primary",
  className = "",
}: {
  value: number;
  colorClass?: string;
  className?: string;
}) {
  return (
    <div className={`h-1.5 bg-muted rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all ${colorClass}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function MiniBarChart({
  data,
  height = "h-32",
}: {
  data: { label: string; value: number | null; count?: number }[];
  height?: string;
}) {
  const maxValue = Math.max(...data.map((d) => d.value ?? 0), 1);
  return (
    <div className={`flex items-end gap-2 ${height}`}>
      {data.map((d, idx) => (
        <div
          key={idx}
          className="flex-1 flex flex-col items-center gap-1 min-w-0"
          title={`${d.label}: ${d.value ?? "no data"}${
            d.count !== undefined ? ` (${d.count} attempts)` : ""
          }`}
        >
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {d.value === null || d.value === undefined ? "—" : `${d.value}`}
          </span>
          <div
            className={`w-full rounded-t-sm transition-all ${scoreBarColor(
              d.value,
            )}`}
            style={{
              height: `${Math.max(
                ((d.value ?? 0) / maxValue) * 100,
                d.value === null || d.value === undefined ? 2 : 4,
              )}%`,
            }}
          />
          <span className="text-[10px] text-muted-foreground truncate w-full text-center">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}
