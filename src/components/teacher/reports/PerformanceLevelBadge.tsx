import type { PerformanceLevel, RiskSeverity } from "@/models/report.interface";
import { StatusBadge } from "@/components/StatusBadge";
import { severityVariant } from "./reportUtils";

const levelMeta: Record<
  PerformanceLevel,
  { label: string; variant: "success" | "warning" | "danger" | "info" | "primary" | "muted" }
> = {
  EXCELLENT: { label: "Excellent", variant: "success" },
  GOOD: { label: "Good", variant: "primary" },
  AVERAGE: { label: "Average", variant: "info" },
  NEEDS_IMPROVEMENT: { label: "Needs Improvement", variant: "warning" },
  CRITICAL: { label: "Critical", variant: "danger" },
  NO_DATA: { label: "No Data", variant: "muted" },
};

export function PerformanceLevelBadge({
  level,
}: {
  level: PerformanceLevel | null | undefined;
}) {
  if (!level) return <StatusBadge variant="muted">—</StatusBadge>;
  const meta = levelMeta[level] ?? { label: level, variant: "muted" };
  return (
    <StatusBadge variant={meta.variant} dot>
      {meta.label}
    </StatusBadge>
  );
}

export function RiskSeverityBadge({
  severity,
}: {
  severity: RiskSeverity;
}) {
  return (
    <StatusBadge variant={severityVariant(severity)} dot>
      {severity === "critical" ? "Critical" : "Warning"}
    </StatusBadge>
  );
}
