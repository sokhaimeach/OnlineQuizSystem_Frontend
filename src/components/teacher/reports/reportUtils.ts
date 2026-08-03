import type { RiskSeverity } from "@/models/report.interface";

export function formatScore(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return `${value}%`;
}

export function formatSeconds(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  if (value < 60) return `${Math.round(value)}s`;
  const minutes = Math.floor(value / 60);
  const seconds = Math.round(value % 60);
  if (minutes < 60) return `${minutes}m ${seconds}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

export function scoreBarColor(value: number | null | undefined) {
  if (value === null || value === undefined) return "bg-muted";
  if (value >= 75) return "bg-emerald-500";
  if (value >= 60) return "bg-indigo-500";
  if (value >= 40) return "bg-amber-500";
  return "bg-red-500";
}

export function severityVariant(severity: RiskSeverity) {
  return severity === "critical" ? ("danger" as const) : ("warning" as const);
}
