import { ArrowRight, Clock, Target, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/StatusBadge";
import { PerformanceLevelBadge } from "@/components/teacher/reports/PerformanceLevelBadge";
import { formatScore } from "@/components/teacher/reports/reportUtils";
import type { DashboardSection } from "@/components/app-sidebar";
import type { DashboardStudentRequiring } from "@/models/report.interface";

export function timeAgo(dateStr: string | null) {
  if (!dateStr) return "Never";
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const quickStatusVariant: Record<
  string,
  "success" | "warning" | "danger" | "info" | "muted" | "primary"
> = {
  Critical: "danger",
  "Needs Improvement": "warning",
  Average: "info",
  "No Data": "muted",
};

interface StudentsRequiringImprovementProps {
  students: DashboardStudentRequiring[];
  loading: boolean;
  onNavigate: (section: DashboardSection) => void;
  onQuickView: (studentId: string) => void;
}

export function StudentsRequiringImprovement({
  students,
  loading,
  onNavigate,
  onQuickView,
}: StudentsRequiringImprovementProps) {
  return (
    <div className="bg-card rounded-md border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Target className="h-4 w-4 text-destructive" />
            Students Requiring Improvement
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Prioritised by risk — weakest subject and most urgent gaps first.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate("at-risk")}
          className="text-primary gap-1 text-xs h-7"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-lg bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      ) : students.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No students need attention right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {students.map((student) => (
            <div
              key={student.student_id}
              className="rounded-lg border border-border p-4 hover:border-destructive/30 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={student.avatar_url || undefined} />
                  <AvatarFallback className="text-xs bg-destructive/10 text-destructive font-semibold">
                    {getInitials(student.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {student.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {student.class_names.join(", ") || "No class"}
                  </p>
                </div>
                <StatusBadge
                  variant={
                    quickStatusVariant[student.quick_status] ?? "muted"
                  }
                  dot
                >
                  {student.quick_status}
                </StatusBadge>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <PerformanceLevelBadge level={student.performance_level} />
                </span>
                <span className="tabular-nums">
                  Avg {formatScore(student.average_score)}
                </span>
                {student.weakest_subject && (
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <Target className="h-3 w-3 shrink-0" />
                    <span className="truncate">
                      {student.weakest_subject.subject_name}{" "}
                      {formatScore(student.weakest_subject.average_score)}
                    </span>
                  </span>
                )}
                {student.failed_count > 0 && (
                  <span>
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                      {student.failed_count}
                    </span>{" "}
                    failed
                  </span>
                )}
                {student.missing_count > 0 && (
                  <span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">
                      {student.missing_count}
                    </span>{" "}
                    missing
                  </span>
                )}
                {student.timed_out_count > 0 && (
                  <span className="flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {student.timed_out_count} timeout
                    {student.timed_out_count !== 1 ? "s" : ""}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {timeAgo(student.latest_activity)}
                </span>
              </div>

              <div className="mt-3 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-7"
                  onClick={() => onQuickView(student.student_id)}
                >
                  Quick view <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
