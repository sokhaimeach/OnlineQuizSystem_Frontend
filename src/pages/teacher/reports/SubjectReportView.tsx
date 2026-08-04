import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/StatCard";
import {
  ReportCard,
  ReportErrorBlock,
  ReportLoadingBlock,
} from "@/components/teacher/reports/ReportBlocks";
import {
  DistributionBar,
  MiniBarChart,
  ScoreBar,
} from "@/components/teacher/reports/ReportCharts";
import { formatScore } from "@/components/teacher/reports/reportUtils";
import { useSubjectReport } from "@/hooks/api/useReports";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function difficultyColor(difficulty: string) {
  if (difficulty === "EASY") return "text-emerald-600 dark:text-emerald-400";
  if (difficulty === "MEDIUM") return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export function SubjectReportView() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useSubjectReport(
    subjectId ?? "",
  );

  if (isLoading) {
    return (
      <ReportLoadingBlock
        title="Subject Report"
        description="Loading subject report..."
        icon={BookOpen}
        cards={4}
      />
    );
  }

  if (isError) {
    return (
      <ReportErrorBlock
        title="subject report"
        message={
          error instanceof Error
            ? error.message
            : "The subject report could not be loaded."
        }
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) return null;

  const {
    subject,
    statistics,
    top_students,
    students_needing_improvement,
    weak_questions,
    question_difficulty,
    topic_analysis,
    historical_performance,
  } = data;

  const historicalData = historical_performance.map((h) => ({
    label: h.week_start.slice(5),
    value: h.average_score,
    count: h.attempts,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/teacher/reports/subjects")}
          className="-ml-2 mb-4 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All Subjects
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                {subject.subject_name}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {subject.description || `${subject.quiz_count} quizzes`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Average Score"
          value={formatScore(statistics.average_score)}
          icon={BookOpen}
          colorClass="text-emerald-600 dark:text-emerald-400"
          bgClass="bg-emerald-50 dark:bg-emerald-950"
        />
        <StatCard
          label="Pass Rate"
          value={`${statistics.pass_rate}%`}
          icon={BookOpen}
          colorClass="text-indigo-600 dark:text-indigo-400"
          bgClass="bg-indigo-50 dark:bg-indigo-950"
        />
        <StatCard
          label="Completion Rate"
          value={`${statistics.completion_rate}%`}
          icon={BookOpen}
          colorClass="text-blue-600 dark:text-blue-400"
          bgClass="bg-blue-50 dark:bg-zinc-800"
        />
        <StatCard
          label="Attempts"
          value={statistics.attempts_count}
          icon={BookOpen}
          colorClass="text-violet-600 dark:text-violet-400"
          bgClass="bg-violet-50 dark:bg-violet-950"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Students"
          value={statistics.total_students}
          icon={BookOpen}
          colorClass="text-cyan-600 dark:text-cyan-400"
          bgClass="bg-cyan-50 dark:bg-cyan-950"
        />
        <StatCard
          label="Difficulty Rating"
          value={statistics.difficulty_rating === null ? "—" : `${statistics.difficulty_rating}%`}
          icon={AlertTriangle}
          colorClass="text-amber-600 dark:text-amber-400"
          bgClass="bg-amber-50 dark:bg-amber-950"
        />
        <StatCard
          label="Assignments"
          value={statistics.assignment_count}
          icon={BookOpen}
          colorClass="text-rose-600 dark:text-rose-400"
          bgClass="bg-rose-50 dark:bg-rose-950"
        />
        <StatCard
          label="Avg Time"
          value={statistics.average_completion_time === null ? "—" : `${Math.round(statistics.average_completion_time / 60)}m`}
          icon={BookOpen}
          colorClass="text-orange-600 dark:text-orange-400"
          bgClass="bg-orange-50 dark:bg-orange-950"
        />
      </div>

      {/* Historical + difficulty distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard
          title="Historical Performance"
          subtitle="Weekly average score for this subject"
        >
          {historicalData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No attempts yet
            </p>
          ) : (
            <MiniBarChart data={historicalData} height="h-40" />
          )}
        </ReportCard>

        <ReportCard
          title="Question Difficulty"
          subtitle="Distribution by difficulty band"
        >
          <div className="flex flex-col gap-4">
            {question_difficulty.map((d) => (
              <div key={d.label} className="flex items-center gap-3">
                <span className="text-xs text-foreground w-16 shrink-0">
                  {d.label}
                </span>
                <DistributionBar
                  value={d.percentage}
                  colorClass={
                    d.label === "Easy"
                      ? "bg-emerald-500"
                      : d.label === "Medium"
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }
                />
                <span className="text-xs font-semibold text-foreground w-14 text-right tabular-nums shrink-0">
                  {d.count} ({d.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </ReportCard>
      </div>

      {/* Top students + needing improvement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard title="Top Students" subtitle="Best averages in this subject">
          {top_students.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No students yet
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

        <ReportCard
          title="Needs Improvement"
          subtitle="Students scoring below 60%"
        >
          {students_needing_improvement.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No students need improvement right now.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {students_needing_improvement.map((s) => (
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
                      {s.failed_count} failed
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 shrink-0 tabular-nums">
                    {formatScore(s.average_score)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ReportCard>
      </div>

      {/* Weak questions + topic analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard
          title="Weak Questions"
          subtitle="Questions with the lowest correct rates"
        >
          {weak_questions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No question data yet
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {weak_questions.map((q) => (
                <div key={q.question_id} className="py-2.5">
                  <p className="text-xs font-medium text-foreground leading-snug line-clamp-2">
                    {q.question_text}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className={`text-[11px] font-semibold ${difficultyColor(q.difficulty)}`}>
                      {q.difficulty}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {q.correct_count}/{q.answered_count} correct
                    </span>
                    {q.skipped_count > 0 && (
                      <span className="text-[11px] text-muted-foreground">
                        {q.skipped_count} skipped
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5">
                    <ScoreBar value={q.correct_rate} showLabel={false} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </ReportCard>

        <ReportCard
          title="Topic Analysis"
          subtitle="Performance by topic"
        >
          {topic_analysis.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Tag questions with topics to unlock topic-level analysis.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {topic_analysis.map((t) => (
                <ScoreBar
                  key={t.topic_id ?? t.topic_name}
                  label={`${t.topic_name} (${t.question_count} questions)`}
                  value={t.average_score}
                />
              ))}
            </div>
          )}
        </ReportCard>
      </div>
    </div>
  );
}
