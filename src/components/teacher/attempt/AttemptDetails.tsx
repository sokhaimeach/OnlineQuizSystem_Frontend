import {
  Award,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  Timer,
  UserRound,
  XCircle,
} from "lucide-react"
import { StatusBadge } from "@/components/StatusBadge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { StudentAttemptsDetails } from "@/models/student.interface"
import {
  formatDuration,
  formatEnum,
  getAttemptDuration,
  getAttemptPercentage,
} from "@/utils/student-format"

interface AttemptDetailsProps {
  attempt: StudentAttemptsDetails
}

type BadgeVariant = "success" | "warning" | "danger" | "info" | "muted" | "primary"

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "-"
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date)
}

function formatTime(value: Date | string | null | undefined) {
  if (!value) return "-"
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat(undefined, { timeStyle: "short" }).format(date)
}

function getStudentName(attempt: StudentAttemptsDetails) {
  if (attempt.student) {
    return [attempt.student.user.first_name, attempt.student.user.last_name]
      .filter(Boolean)
      .join(" ")
      .trim() || "Student"
  }
  return attempt.guest_name?.trim() || "Guest student"
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase() || "?"
}

function getAttemptStatusMeta(status: StudentAttemptsDetails["status"]): {
  label: string
  variant: BadgeVariant
} {
  if (status === "SUBMITTED") return { label: "Submitted", variant: "success" }
  if (status === "TIMEOUT") return { label: "Timed Out", variant: "warning" }
  return { label: "Attempt In Progress", variant: "info" }
}

function getResultMeta(passed: boolean | null): {
  label: string
  variant: BadgeVariant
  icon: typeof CheckCircle2
} {
  if (passed === null) return { label: "In Progress", variant: "info", icon: Clock3 }
  return passed
    ? { label: "Passed", variant: "success", icon: CheckCircle2 }
    : { label: "Failed", variant: "danger", icon: XCircle }
}

function getClassName(value: StudentAttemptsDetails["assignment"]["class"]) {
  if (!value) return "Not Assigned"
  if (typeof value === "string") return value
  return value.class_name || "Not Assigned"
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-md border border-border bg-muted/30 p-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
        <div className="mt-1 break-words text-sm font-medium text-foreground">{value}</div>
      </div>
    </div>
  )
}

function StatTile({
  icon: Icon,
  label,
  value,
  subValue,
  colorClass,
  bgClass,
}: {
  icon: typeof Award
  label: string
  value: React.ReactNode
  subValue?: React.ReactNode
  colorClass: string
  bgClass: string
}) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className={cn("mb-4 inline-flex rounded-md p-2", bgClass)}>
        <Icon className={cn("size-5", colorClass)} />
      </div>
      <div className="text-2xl font-semibold tracking-tight text-foreground">{value}</div>
      {subValue && <div className="mt-1 text-xs text-muted-foreground">{subValue}</div>}
      <p className="mt-2 text-xs font-medium uppercase text-muted-foreground">{label}</p>
    </div>
  )
}

export function AttemptDetails({ attempt }: AttemptDetailsProps) {
  const possibleScore = attempt.assignment.quiz.questions.reduce(
    (total, question) => total + Number(question.score || 0),
    0,
  )
  const score = Number(attempt.total_score ?? 0)
  const percentage = getAttemptPercentage(score, possibleScore)
  const isInProgress = attempt.status === "IN_PROGRESS"
  const passed = isInProgress || percentage == null
    ? null
    : percentage >= attempt.assignment.quiz.passing_score
  const statusMeta = getAttemptStatusMeta(attempt.status)
  const resultMeta = getResultMeta(passed)
  const ResultIcon = resultMeta.icon
  const studentName = getStudentName(attempt)
  const studentEmail = attempt.student?.user.email || "No email available"
  const duration = formatDuration(getAttemptDuration(attempt))
  const questionCount = attempt.assignment.quiz.questions.length
  const className = getClassName(attempt.assignment.class)
  const submittedLabel = attempt.submitted_at
    ? `${statusMeta.label} • ${formatDate(attempt.submitted_at)} ${formatTime(attempt.submitted_at)}`
    : statusMeta.label

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <FileText className="size-5 text-primary" />
                <StatusBadge variant={statusMeta.variant} dot>
                  {statusMeta.label}
                </StatusBadge>
              </div>
              <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">
                {attempt.assignment.title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {submittedLabel}
              </p>
            </div>

            <div className="flex min-w-0 items-center gap-3 rounded-md border border-border bg-muted/30 px-4 py-3">
              <Avatar className="size-12 shrink-0 border border-border">
                <AvatarImage src={attempt.student?.user.avatar_url ?? undefined} alt={studentName} />
                <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                  {getInitials(studentName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground" title={studentName}>
                  {studentName}
                </p>
                <p className="text-xs text-muted-foreground">Quiz Attempt</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="rounded-md border border-border bg-card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Attempt Summary</h2>
            <p className="text-sm text-muted-foreground">
              Key result, timing, and attempt details.
            </p>
          </div>
          {isInProgress && (
            <StatusBadge variant="info" dot>
              Attempt In Progress
            </StatusBadge>
          )}
        </div>

        {isInProgress ? (
          <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 dark:border-blue-800 dark:bg-zinc-800 dark:text-blue-400">
            This attempt has not been submitted yet. Final score and result will appear after submission.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile
              icon={Award}
              label="Score"
              value={`${formatNumber(score)} / ${formatNumber(possibleScore)}`}
              colorClass="text-violet-600 dark:text-indigo-400"
              bgClass="bg-violet-50 dark:bg-zinc-800"
            />
            <StatTile
              icon={GraduationCap}
              label="Percentage"
              value={percentage == null ? "-" : `${Math.round(percentage)}%`}
              subValue={percentage == null ? undefined : `${percentage.toFixed(1)}% exact`}
              colorClass="text-blue-600 dark:text-blue-400"
              bgClass="bg-blue-50 dark:bg-zinc-800"
            />
            <StatTile
              icon={ResultIcon}
              label="Result"
              value={resultMeta.label}
              colorClass={passed ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}
              bgClass={passed ? "bg-emerald-50 dark:bg-emerald-950" : "bg-red-50 dark:bg-red-950"}
            />
            <StatTile
              icon={Timer}
              label="Duration"
              value={duration}
              colorClass="text-amber-600 dark:text-amber-400"
              bgClass="bg-amber-50 dark:bg-amber-950"
            />
          </div>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <DetailRow icon={FileText} label="Questions" value={questionCount} />
          <DetailRow icon={CheckCircle2} label="Correct" value={attempt.correct_count ?? 0} />
          <DetailRow icon={XCircle} label="Incorrect" value={attempt.wrong_count ?? 0} />
          <DetailRow
            icon={Award}
            label="Score"
            value={isInProgress ? "Pending" : `${formatNumber(score)} / ${formatNumber(possibleScore)}`}
          />
          <DetailRow
            icon={Clock3}
            label="Attempt"
            value={attempt.attempt_number ? `#${attempt.attempt_number}` : "Attempt 1"}
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-4 text-primary" />
              Assignment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <DetailRow icon={FileText} label="Title" value={attempt.assignment.title} />
            <DetailRow icon={GraduationCap} label="Quiz" value={attempt.assignment.quiz.title} />
            <DetailRow icon={UserRound} label="Class" value={className} />
            <DetailRow icon={Timer} label="Duration" value={`${attempt.assignment.quiz.duration_minutes} minutes`} />
            <DetailRow icon={Award} label="Passing Score" value={`${attempt.assignment.quiz.passing_score}%`} />
            <DetailRow icon={CheckCircle2} label="Questions" value={questionCount} />
            <DetailRow
              icon={CalendarClock}
              label="Available"
              value={`${formatDate(attempt.assignment.start_date)} -> ${formatDate(attempt.assignment.due_date)}`}
            />
            <DetailRow
              icon={FileText}
              label="Description"
              value={attempt.assignment.quiz.description || "No description available"}
            />
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <UserRound className="size-4 text-primary" />
                Student
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="size-14 shrink-0 border border-border">
                  <AvatarImage src={attempt.student?.user.avatar_url ?? undefined} alt={studentName} />
                  <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                    {getInitials(studentName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-foreground" title={studentName}>
                    {studentName}
                  </p>
                  <p className="truncate text-sm text-muted-foreground" title={studentEmail}>
                    {studentEmail}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {attempt.student ? formatEnum(attempt.student.user.gender) : "Guest"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock3 className="size-4 text-primary" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="mt-1 size-2.5 shrink-0 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Started</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(attempt.started_at)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(attempt.started_at)}
                    </p>
                  </div>
                </div>
                <div className="ml-1 h-8 border-l border-border" />
                <div className="flex gap-3">
                  <span className={cn(
                    "mt-1 size-2.5 shrink-0 rounded-full",
                    attempt.submitted_at ? "bg-emerald-500" : "bg-muted-foreground",
                  )} />
                  <div>
                    <p className="text-sm font-medium text-foreground">Submitted</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(attempt.submitted_at)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(attempt.submitted_at)}
                    </p>
                  </div>
                </div>
                <div className="rounded-md border border-border bg-muted/40 p-3">
                  <p className="text-xs font-medium uppercase text-muted-foreground">Duration</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{duration}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
