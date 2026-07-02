import type { StudentAttemptsHistory } from "@/models/student.interface"

export function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return "—"
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date)
}

export function formatDuration(seconds: number | null | undefined) {
  if (seconds == null || seconds < 0) return "—"
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return [
    hours ? `${hours}h` : "",
    minutes ? `${minutes}m` : "",
    !hours && remainingSeconds ? `${remainingSeconds}s` : "",
  ].filter(Boolean).join(" ") || "0s"
}

export function getAttemptDuration(attempt: Pick<StudentAttemptsHistory, "duration_seconds" | "started_at" | "submitted_at">) {
  if (attempt.duration_seconds != null) return attempt.duration_seconds
  if (!attempt.started_at || !attempt.submitted_at) return null
  return Math.max(
    0,
    Math.floor((new Date(attempt.submitted_at).getTime() - new Date(attempt.started_at).getTime()) / 1000),
  )
}

export function getAttemptPercentage(score: number | null, possibleScore?: number, provided?: number | null) {
  if (provided != null) return provided
  if (score == null || !possibleScore) return null
  return (score / possibleScore) * 100
}

export function formatEnum(value: string | null | undefined) {
  if (!value) return "—"
  return value.toLowerCase().split("_").map(part => part[0].toUpperCase() + part.slice(1)).join(" ")
}
