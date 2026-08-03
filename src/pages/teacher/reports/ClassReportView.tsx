import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, School, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/StatCard";
import {
  ReportCard,
  ReportErrorBlock,
  ReportLoadingBlock,
} from "@/components/teacher/reports/ReportBlocks";
import { DistributionBar, ScoreBar } from "@/components/teacher/reports/ReportCharts";
import { PerformanceLevelBadge } from "@/components/teacher/reports/PerformanceLevelBadge";
import { formatScore } from "@/components/teacher/reports/reportUtils";
import { ExportButton } from "@/components/teacher/reports/ExportButton";
import { useClassReport } from "@/hooks/api/useReports";
import { useGetRecentClasses } from "@/hooks/api/useClass";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ClassReportView() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const classesQuery = useGetRecentClasses();
  const [selectedClassId, setSelectedClassId] = useState<string>(classId ?? "");

  const { data, isLoading, isError, error, refetch } = useClassReport(
    selectedClassId,
  );

  const classes = (classesQuery.data ?? []).map((c) => ({
    id: c.id,
    class_name: c.class_name,
  }));

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  useEffect(() => {
    if (classId) setSelectedClassId(classId);
  }, [classId]);

  // Auto-select the first class when none is provided (e.g. from the sidebar).
  useEffect(() => {
    if (!selectedClassId && classes.length > 0) {
      setSelectedClassId(classes[0].id);
    }
  }, [selectedClassId, classes]);

  if (!selectedClassId || !selectedClass) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Class Report"
          description="Select a class to view its analytics"
          icon={School}
        />
        <div className="bg-card rounded-md border border-border p-8 text-center text-sm text-muted-foreground">
          No classes available yet. Create a class to see its report.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <ReportLoadingBlock
        title="Class Report"
        description="Loading class analytics..."
        icon={School}
        cards={4}
      />
    );
  }

  if (isError) {
    return (
      <ReportErrorBlock
        title="class report"
        message={
          error instanceof Error
            ? error.message
            : "The class report could not be loaded."
        }
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) return null;

  const { class: classInfo, statistics, highest_student, lowest_student, top_students, bottom_students, student_distribution, most_difficult_subject, subject_averages, most_failed_quiz, most_difficult_question } = data;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/teacher/reports")}
          className="-ml-2 mb-4 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Reports
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg bg-primary/10"
              style={
                classInfo.color
                  ? { backgroundColor: `${classInfo.color}1a` }
                  : undefined
              }
            >
              <School className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                {classInfo.class_name}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {classInfo.total_students} students · {classInfo.total_assignments} assignments
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={selectedClassId}
              onValueChange={(v) => {
                setSelectedClassId(v);
                navigate(`/teacher/reports/class/${v}`, { replace: true });
              }}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.class_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ExportButton
              label="Export CSV"
              options={{ type: "class", id: selectedClassId }}
            />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Class Average"
          value={formatScore(statistics.class_average)}
          icon={School}
          colorClass="text-emerald-600 dark:text-emerald-400"
          bgClass="bg-emerald-50 dark:bg-emerald-950"
        />
        <StatCard
          label="Pass Rate"
          value={`${statistics.pass_rate}%`}
          icon={School}
          colorClass="text-indigo-600 dark:text-indigo-400"
          bgClass="bg-indigo-50 dark:bg-indigo-950"
        />
        <StatCard
          label="Completion Rate"
          value={`${statistics.assignment_completion_rate}%`}
          icon={School}
          colorClass="text-blue-600 dark:text-blue-400"
          bgClass="bg-blue-50 dark:bg-zinc-800"
        />
        <StatCard
          label="Attempts"
          value={statistics.total_attempts}
          icon={School}
          colorClass="text-violet-600 dark:text-violet-400"
          bgClass="bg-violet-50 dark:bg-violet-950"
        />
      </div>

      {/* Highest / lowest student */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard title="Highest Performer" subtitle="Best average in the class">
          {highest_student ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={highest_student.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getInitials(highest_student.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {highest_student.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {highest_student.completed_count} completed
                </p>
              </div>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                {formatScore(highest_student.average_score)}
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">
              No data yet
            </p>
          )}
        </ReportCard>

        <ReportCard title="Needs Attention" subtitle="Lowest average in the class">
          {lowest_student ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={lowest_student.avatar_url || undefined} />
                <AvatarFallback className="bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">
                  {getInitials(lowest_student.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {lowest_student.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {lowest_student.completed_count} completed
                </p>
              </div>
              <PerformanceLevelBadge level={lowest_student.performance_level} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">
              No data yet
            </p>
          )}
        </ReportCard>
      </div>

      {/* Distribution + subject averages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard
          title="Student Distribution"
          subtitle="Performance levels within the class"
        >
          <div className="flex flex-col gap-3">
            {student_distribution
              .filter((d) => d.level !== "NO_DATA")
              .map((d) => {
                const maxCount = Math.max(
                  ...student_distribution.map((x) => x.count),
                  1,
                );
                return (
                  <div key={d.level} className="flex items-center gap-3">
                    <span className="text-xs text-foreground w-40 capitalize shrink-0">
                      {d.level.replace(/_/g, " ").toLowerCase()}
                    </span>
                    <DistributionBar
                      value={(d.count / maxCount) * 100}
                      colorClass={
                        d.level === "EXCELLENT"
                          ? "bg-emerald-500"
                          : d.level === "GOOD"
                            ? "bg-indigo-500"
                            : d.level === "AVERAGE"
                              ? "bg-blue-500"
                              : d.level === "NEEDS_IMPROVEMENT"
                                ? "bg-amber-500"
                                : "bg-red-500"
                      }
                    />
                    <span className="text-xs font-semibold text-foreground w-6 text-right shrink-0">
                      {d.count}
                    </span>
                  </div>
                );
              })}
          </div>
        </ReportCard>

        <ReportCard
          title="Subject Averages"
          subtitle="Average score per subject in this class"
        >
          {subject_averages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No subject data yet
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {subject_averages.map((s) => (
                <ScoreBar
                  key={s.subject_id ?? "unassigned"}
                  label={s.subject_name}
                  value={s.average_score}
                />
              ))}
            </div>
          )}
        </ReportCard>
      </div>

      {/* Most difficult subject + most failed quiz */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard
          title="Most Difficult Subject"
          subtitle="Subject with the lowest average"
        >
          {most_difficult_subject ? (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10 shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {most_difficult_subject.subject_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {most_difficult_subject.attempts} attempts
                </p>
              </div>
              <span className="text-sm font-bold text-red-600 dark:text-red-400 shrink-0">
                {formatScore(most_difficult_subject.average_score)}
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">
              No data yet
            </p>
          )}
        </ReportCard>

        <ReportCard title="Most Failed Quiz" subtitle="Assignment with most failures">
          {most_failed_quiz ? (
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {most_failed_quiz.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {most_failed_quiz.failed} failed · {most_failed_quiz.passed} passed
                </p>
              </div>
              <StatusBadge variant="danger">
                {most_failed_quiz.failed} failed
              </StatusBadge>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">
              No data yet
            </p>
          )}
        </ReportCard>
      </div>

      {/* Top + bottom students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard title="Top Students" subtitle="Best averages">
          {top_students.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No data yet
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {top_students.map((s, idx) => (
                <div key={s.student_id} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-5 text-center shrink-0">
                    {idx + 1}
                  </span>
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={s.avatar_url || undefined} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                      {getInitials(s.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {s.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {s.completed_count} completed
                    </p>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 shrink-0 tabular-nums">
                    {formatScore(s.average_score)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ReportCard>

        <ReportCard title="Bottom Students" subtitle="Lowest averages">
          {bottom_students.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No data yet
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {bottom_students.map((s) => (
                <div key={s.student_id} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={s.avatar_url || undefined} />
                    <AvatarFallback className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">
                      {getInitials(s.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {s.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {s.completed_count} completed
                    </p>
                  </div>
                  <PerformanceLevelBadge level={s.performance_level} />
                </div>
              ))}
            </div>
          )}
        </ReportCard>
      </div>

      {/* Most difficult question */}
      {most_difficult_question && (
        <ReportCard
          title="Most Difficult Question"
          subtitle="Question with the lowest correct rate"
        >
          <div className="flex flex-col gap-3">
            <p className="text-sm text-foreground leading-snug">
              {most_difficult_question.question_text}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                {most_difficult_question.difficulty}
              </span>
              <span className="text-xs text-muted-foreground">
                {most_difficult_question.correct_count}/{most_difficult_question.answered_count} correct
              </span>
              {most_difficult_question.skipped_count > 0 && (
                <span className="text-xs text-muted-foreground">
                  {most_difficult_question.skipped_count} skipped
                </span>
              )}
            </div>
          </div>
        </ReportCard>
      )}
    </div>
  );
}
