import {
  BookOpen,
  GraduationCap,
  Mail,
  TrendingDown,
  TrendingUp,
  Trophy,
  UserRound,
  Users,
} from "lucide-react"
import { StatusBadge } from "@/components/StatusBadge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { StudentDetails as StudentDetailsModel } from "@/models/student.interface"
import { formatEnum } from "@/utils/student-format"

interface StudentDetailsProps {
  student: StudentDetailsModel
}

interface InfoItemProps {
  label: string
  value: React.ReactNode
}

const emptyValue = "—"

function displayValue(value: string | null | undefined) {
  return value?.trim() || emptyValue
}

function formatDate(value: string | null | undefined) {
  if (!value) return emptyValue
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? emptyValue
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date)
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

function statusVariant(status: string | null | undefined) {
  if (status === "ACTIVE") return "success" as const
  if (status === "SUSPENDED") return "danger" as const
  return "muted" as const
}

function isHexColor(value: string | null | undefined) {
  return Boolean(value && /^#[0-9a-fA-F]{6}$/.test(value))
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-sm text-foreground">{value}</dd>
    </div>
  )
}

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: typeof UserRound
  children: React.ReactNode
}) {
  return (
    <CardTitle className="flex items-center gap-2 text-base">
      <Icon className="size-4 text-primary" />
      {children}
    </CardTitle>
  )
}

function StatTile({
  icon: Icon,
  label,
  value,
  colorClass,
  bgClass,
}: {
  icon: typeof BookOpen
  label: string
  value: string | number
  colorClass: string
  bgClass: string
}) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className={cn("mb-4 inline-flex rounded-md p-2", bgClass)}>
        <Icon className={cn("size-5", colorClass)} />
      </div>
      <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  )
}

export function StudentDetails({ student }: StudentDetailsProps) {
  const fullName =
    [student.user.first_name, student.user.last_name].filter(Boolean).join(" ") ||
    "Student"
  const status = student.user.status
  const bio = displayValue(student.user.bio)

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar className="size-20 shrink-0 border border-border">
              <AvatarImage src={student.user.avatar_url ?? undefined} alt={fullName} />
              <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">
                {fullName}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge variant="primary">Student</StatusBadge>
                <StatusBadge variant={statusVariant(status)} dot>
                  {formatEnum(status)}
                </StatusBadge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <SectionTitle icon={UserRound}>Basic Information</SectionTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <InfoItem label="Full Name" value={fullName} />
              <InfoItem label="Gender" value={formatEnum(student.user.gender)} />
              <InfoItem label="Date of Birth" value={formatDate(student.date_of_birth)} />
              <InfoItem label="Email" value={displayValue(student.user.email)} />
              <InfoItem label="Phone Number" value={displayValue(student.phone_number)} />
              <InfoItem label="Parent Phone" value={displayValue(student.parent_phone_number)} />
              <InfoItem label="Bio" value={bio} />
            </dl>
          </CardContent>
        </Card>

        <section className="space-y-3">
          <div>
            <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <TrendingUp className="size-4 text-primary" />
              Statistics
            </h2>
            <p className="text-sm text-muted-foreground">
              Snapshot of this student's quiz performance.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatTile
              icon={BookOpen}
              label="Quizzes Completed"
              value={student.stats.total_quizzes_completed ?? 0}
              colorClass="text-blue-600 dark:text-blue-400"
              bgClass="bg-blue-50 dark:bg-zinc-800"
            />
            <StatTile
              icon={TrendingUp}
              label="Average Score"
              value={`${student.stats.average_score ?? 0}%`}
              colorClass="text-emerald-600 dark:text-emerald-400"
              bgClass="bg-emerald-50 dark:bg-emerald-950"
            />
            <StatTile
              icon={Trophy}
              label="Highest Score"
              value={`${student.stats.highest_score ?? 0}%`}
              colorClass="text-amber-600 dark:text-amber-400"
              bgClass="bg-amber-50 dark:bg-amber-950"
            />
            <StatTile
              icon={TrendingDown}
              label="Lowest Score"
              value={`${student.stats.lowest_score ?? 0}%`}
              colorClass="text-rose-600 dark:text-rose-400"
              bgClass="bg-rose-50 dark:bg-rose-950"
            />
          </div>
        </section>

        <Card>
          <CardHeader>
            <SectionTitle icon={GraduationCap}>Academic Information</SectionTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                Classes
              </p>
              {student.classes.length ? (
                <div className="flex flex-wrap gap-2">
                  {student.classes.map(classItem => {
                    const hasColor = isHexColor(classItem.color)
                    return (
                      <span
                        key={classItem.id}
                        className="inline-flex max-w-full items-center gap-1.5 rounded-sm border px-2.5 py-1 text-xs font-medium"
                        style={
                          hasColor
                            ? {
                                borderColor: classItem.color,
                                backgroundColor: `${classItem.color}1a`,
                                color: classItem.color,
                              }
                            : undefined
                        }
                        title={classItem.class_name}
                      >
                        <span
                          className="size-1.5 shrink-0 rounded-full"
                          style={hasColor ? { backgroundColor: classItem.color } : undefined}
                        />
                        <span className="truncate">{classItem.class_name}</span>
                      </span>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Not assigned</p>
              )}
            </div>
            <div className="rounded-md border border-border bg-muted/40 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <Users className="size-4" />
                </div>
                <div>
                  <p className="text-2xl font-semibold tabular-nums text-foreground">
                    {student.classes.length}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    Total Classes
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <SectionTitle icon={Mail}>About Student</SectionTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-foreground">
              {bio === emptyValue ? "No biography available." : bio}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
