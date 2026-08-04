import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Eye } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { ReportErrorBlock, ReportLoadingBlock } from "@/components/teacher/reports/ReportBlocks";
import { ReportFilterBar } from "@/components/teacher/reports/ReportFilterBar";
import { ScoreBar } from "@/components/teacher/reports/ReportCharts";
import { formatScore } from "@/components/teacher/reports/reportUtils";
import { useSubjectAnalytics } from "@/hooks/api/useReports";
import { useGetRecentClasses } from "@/hooks/api/useClass";
import type { SubjectStatistics } from "@/models/report.interface";

export function SubjectAnalyticsView() {
  const navigate = useNavigate();
  const classesQuery = useGetRecentClasses();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [classId, setClassId] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, classId]);

  const query = useMemo(
    () => ({
      page,
      limit: pageSize,
      search: debouncedSearch || undefined,
      class_id: classId,
    }),
    [page, pageSize, debouncedSearch, classId],
  );

  const { data, isLoading, isError, error, refetch, isFetching } =
    useSubjectAnalytics(query);

  const classes = useMemo(
    () =>
      (classesQuery.data ?? []).map((c) => ({
        id: c.id,
        class_name: c.class_name,
      })),
    [classesQuery.data],
  );

  const columns = useMemo<ColumnDef<SubjectStatistics>[]>(
    () => [
      {
        id: "subject",
        header: "Subject",
        accessorFn: (r) => r.subject_name,
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {row.original.subject_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {row.original.quiz_count} quizzes · {row.original.assignment_count} assignments
            </p>
          </div>
        ),
      },
      {
        id: "average_score",
        header: "Average Score",
        accessorFn: (r) => r.average_score,
        cell: ({ row }) => (
          <div className="w-44">
            <ScoreBar value={row.original.average_score} showLabel={false} />
            <span className="text-xs font-semibold text-foreground tabular-nums">
              {formatScore(row.original.average_score)}
            </span>
          </div>
        ),
      },
      {
        id: "pass_rate",
        header: "Pass Rate",
        accessorFn: (r) => r.pass_rate,
        cell: ({ row }) => (
          <span
            className={`text-sm font-medium tabular-nums ${
              row.original.pass_rate >= 50
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {row.original.pass_rate}%
          </span>
        ),
      },
      {
        id: "difficulty",
        header: "Difficulty",
        accessorFn: (r) => r.difficulty_rating,
        cell: ({ row }) => {
          const d = row.original.difficulty_rating;
          if (d === null) return <span className="text-sm text-muted-foreground">—</span>;
          return (
            <span
              className={`text-sm font-medium tabular-nums ${
                d >= 60
                  ? "text-red-600 dark:text-red-400"
                  : d >= 40
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {d}%
            </span>
          );
        },
      },
      {
        id: "completion_rate",
        header: "Completion",
        accessorFn: (r) => r.completion_rate,
        cell: ({ row }) => (
          <span className="text-sm text-foreground tabular-nums">
            {row.original.completion_rate}%
          </span>
        ),
      },
      {
        id: "attempts",
        header: "Attempts",
        accessorFn: (r) => r.attempts_count,
        cell: ({ row }) => (
          <span className="text-sm text-foreground tabular-nums">
            {row.original.attempts_count}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/teacher/reports/subject/${row.original.subject_id}`)}
            >
              <Eye className="h-4 w-4" />
              Report
            </Button>
          </div>
        ),
      },
    ],
    [navigate],
  );

  if (isLoading) {
    return (
      <ReportLoadingBlock
        title="Subject Analysis"
        description="Loading subject analytics..."
        icon={BookOpen}
        cards={3}
      />
    );
  }

  if (isError) {
    return (
      <ReportErrorBlock
        title="subject analytics"
        message={
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again."
        }
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Subject Analysis"
        description="Identify subjects students find most difficult"
        icon={BookOpen}
      />

      <ReportFilterBar
        filters={{ search, class_id: classId }}
        onFiltersChange={(f) => {
          setSearch(f.search ?? "");
          setClassId(f.class_id);
        }}
        classes={classes}
        showSubject={false}
      />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={isFetching}
        manualPagination
        manualSorting
        pageCount={data?.meta.total_pages ?? 1}
        rowCount={data?.meta.total ?? 0}
        pagination={{ pageIndex: page - 1, pageSize }}
        onPaginationChange={(updater) => {
          const next =
            typeof updater === "function"
              ? updater({ pageIndex: page - 1, pageSize })
              : updater;
          setPage(next.pageIndex + 1);
          setPageSize(next.pageSize);
        }}
        emptyState={
          <div className="flex flex-col items-center gap-2 py-6">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
            <p>No subjects match the current filters.</p>
          </div>
        }
      />
    </div>
  );
}
