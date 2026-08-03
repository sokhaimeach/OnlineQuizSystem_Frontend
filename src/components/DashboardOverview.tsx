import {
  School,
  Users,
  ClipboardList,
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Activity,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardSection } from "@/components/app-sidebar";
import {
  useDashboardSummary,
  useReportActivity,
  useReportUpcomingDeadlines,
} from "@/hooks/api/useAnalytics";
import { useGetRecentClasses } from "@/hooks/api/useClass";
import { useDashboardImprovement } from "@/hooks/api/useReports";
import { StudentsRequiringImprovement } from "@/components/teacher/dashboard/StudentsRequiringImprovement";
import { InsightCards } from "@/components/teacher/dashboard/InsightCards";
import { useNavigate } from "react-router-dom";

interface DashboardOverviewProps {
  onNavigate: (section: DashboardSection) => void;
}

function timeAgo(dateStr: string) {
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

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const classColors = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-cyan-500",
  "bg-rose-500",
  "bg-blue-500",
  "bg-orange-500",
];

const activityIcons: Record<string, React.ElementType> = {
  submission: CheckCircle2,
};

const activityColors: Record<string, string> = {
  submission: "text-emerald-500",
};

export function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const navigate = useNavigate();
  const summaryQuery = useDashboardSummary();
  const recentClassesQuery = useGetRecentClasses();
  const recentActivityQuery = useReportActivity();
  const upcomingDeadlinesQuery = useReportUpcomingDeadlines();
  const improvementQuery = useDashboardImprovement();

  const isLoading =
    summaryQuery.isLoading ||
    recentClassesQuery.isLoading ||
    recentActivityQuery.isLoading ||
    upcomingDeadlinesQuery.isLoading ||
    improvementQuery.isLoading;
  const isError =
    summaryQuery.isError ||
    recentClassesQuery.isError ||
    recentActivityQuery.isError ||
    upcomingDeadlinesQuery.isError ||
    improvementQuery.isError;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Dashboard"
          description="Loading your dashboard..."
          icon={Activity}
        />
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-md border border-border p-5 flex flex-col gap-4"
            >
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-md border border-border p-5">
            <Skeleton className="h-5 w-32 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="bg-card rounded-md border border-border p-5">
            <Skeleton className="h-5 w-28 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Dashboard"
          description="Some data failed to load"
          icon={Activity}
        />
        <div className="bg-card rounded-md border border-border p-8 flex flex-col items-center justify-center text-center gap-3">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <h3 className="text-base font-semibold text-foreground">
            Could not load dashboard data
          </h3>
          <p className="text-sm text-muted-foreground">
            Try refreshing the page or check your connection.
          </p>
        </div>
      </div>
    );
  }

  const summary = summaryQuery.data;
  const recentClasses = recentClassesQuery.data ?? [];
  const recentActivity = recentActivityQuery.data ?? [];
  const upcomingDeadlines = upcomingDeadlinesQuery.data ?? [];
  const improvement = improvementQuery.data;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description={
          summary
            ? `You have ${summary.total_classes} class${summary.total_classes !== 1 ? "es" : ""} and ${summary.total_students} student${summary.total_students !== 1 ? "s" : ""}.`
            : "Welcome to your dashboard."
        }
        icon={Activity}
        action={{
          label: "Create Quiz",
          icon: BookOpen,
          onClick: () => onNavigate("create-quiz"),
        }}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">        <StatCard
          label="Total Classes"
          value={summary?.total_classes ?? 0}
          icon={School}
          colorClass="text-indigo-600 dark:text-indigo-400"
          bgClass="bg-indigo-50 dark:bg-indigo-950"
        />
        <StatCard
          label="Total Students"
          value={summary?.total_students ?? 0}
          icon={Users}
          colorClass="text-blue-600 dark:text-blue-400"
          bgClass="bg-blue-50 dark:bg-zinc-800"
        />
        <StatCard
          label="Active Assignments"
          value={summary?.active_assignments ?? 0}
          icon={ClipboardList}
          colorClass="text-amber-600 dark:text-amber-400"
          bgClass="bg-amber-50 dark:bg-amber-950"
        />
        <StatCard
          label="Published Quizzes"
          value={summary?.total_quizzes ?? 0}
          icon={BookOpen}
          colorClass="text-emerald-600 dark:text-emerald-400"
          bgClass="bg-emerald-50 dark:bg-emerald-950"
        />
        <StatCard
          label="Completion Rate"
          value={`${summary?.completion_rate ?? 0}%`}
          icon={TrendingUp}
          colorClass="text-green-600 dark:text-green-400"
          bgClass="bg-green-50 dark:bg-green-950"
        />
        <StatCard
          label="Average Score"
          value={`${summary?.average_score ?? 0}`}
          icon={Award}
          colorClass="text-violet-600 dark:text-indigo-400"
          bgClass="bg-violet-50 dark:bg-zinc-800"
        />
      </div>

      {/* Students Requiring Improvement */}
      <StudentsRequiringImprovement
        students={improvement?.students_requiring_improvement ?? []}
        loading={improvementQuery.isLoading}
        onNavigate={onNavigate}
        onQuickView={(studentId) => navigate(`/teacher/students/${studentId}`)}
      />

      {/* Insight Cards */}
      {improvement && (
        <InsightCards
          cards={improvement.insight_cards}
          onNavigate={onNavigate}
          navigate={navigate}
        />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Classes */}
        <div className="lg:col-span-2 bg-card rounded-md border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">
              Recent Classes
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("classes")}
              className="text-primary gap-1 text-xs h-7"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
          {recentClasses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No classes yet. Create your first class to get started.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentClasses.map((cls, idx) => (
                <button
                  key={cls.id}
                  onClick={() => navigate(`/teacher/classes/${cls.id}`)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-left group"
                >
                  <div
                    className={`h-10 w-10 rounded-lg ${classColors[idx % classColors.length]} flex items-center justify-center text-white text-sm font-bold shrink-0`}
                  >
                    {getInitials(cls.class_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {cls.class_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {cls.description || "No description"}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {cls.total_student ?? 0}
                      </span>
                      {(cls.assignment_count ?? 0) > 0 && (
                        <StatusBadge
                          variant="warning"
                          className="text-[10px] py-0 px-1.5"
                        >
                          {cls.assignment_count} active
                        </StatusBadge>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-md border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Recent Activity
          </h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No recent activity
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentActivity.map((item, idx) => {
                const Icon = activityIcons[item.type] || Activity;
                const color = activityColors[item.type] || "text-primary";
                return (
                  <div key={idx} className="flex gap-3">
                    <div className="mt-0.5 shrink-0">
                      <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground leading-snug">
                        {item.description}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {timeAgo(item.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-card rounded-md border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">
            Upcoming Deadlines
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("classes")}
            className="text-primary gap-1 text-xs h-7"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
        {upcomingDeadlines.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No upcoming deadlines
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {upcomingDeadlines.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.class_name}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">Submissions</p>
                    <p className="text-sm font-medium text-foreground">
                      {item.submitted_count}/{item.total_students}
                    </p>
                  </div>
                  <Progress
                    value={
                      item.total_students > 0
                        ? (item.submitted_count / item.total_students) * 100
                        : 0
                    }
                    className="w-20 h-1.5 hidden md:block"
                  />
                  <StatusBadge variant={item.status} dot>
                    {item.due_label}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
