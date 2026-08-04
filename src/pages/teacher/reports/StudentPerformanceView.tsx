import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Users, Eye } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReportErrorBlock, ReportLoadingBlock } from "@/components/teacher/reports/ReportBlocks";
import { ReportFilterBar } from "@/components/teacher/reports/ReportFilterBar";
import { PerformanceLevelBadge } from "@/components/teacher/reports/PerformanceLevelBadge";
import { formatScore } from "@/components/teacher/reports/reportUtils";
import { useStudentPerformance } from "@/hooks/api/useReports";
import { useGetRecentClasses } from "@/hooks/api/useClass";
import type { StudentPerformanceRow } from "@/models/report.interface";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function StudentPerformanceView() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialFilters = (
    (location.state as { initialFilters?: Record<string, string> } | null)
      ?.initialFilters ?? {}
  );
  const classesQuery = useGetRecentClasses();
  const [search, setSearch] = useState(initialFilters.search ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(
    initialFilters.search ?? "",
  );
  const [classId, setClassId] = useState<string | undefined>(
    initialFilters.class_id,
  );
  const [level, setLevel] = useState<string | undefined>(initialFilters.level);
  const [hasTimeout, setHasTimeout] = useState<string | undefined>(
    initialFilters.has_timeout,
  );
  const [hasMissing, setHasMissing] = useState<string | undefined>(
    initialFilters.has_missing,
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, classId, level, hasTimeout, hasMissing]);

  const query = useMemo(
    () => ({
      page,
      limit: pageSize,
      search: debouncedSearch || undefined,
      class_id: classId,
      level,
      has_timeout: hasTimeout,
      has_missing: hasMissing,
    }),
    [page, pageSize, debouncedSearch, classId, level, hasTimeout, hasMissing],
  );

  const { data, isLoading, isError, error, refetch, isFetching } =
    useStudentPerformance(query);

  const classes = useMemo(
    () =>
      (classesQuery.data ?? []).map((c) => ({
        id: c.id,
        class_name: c.class_name,
      })),
    [classesQuery.data],
  );

  const columns = useMemo<ColumnDef<StudentPerformanceRow>[]>(
    () => [
      {
        id: "student",
        header: "Student",
        accessorFn: (r) => r.name,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={row.original.avatar_url || undefined} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                {getInitials(row.original.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {row.original.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {row.original.class_names.join(", ") || "No class"}
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "level",
        header: "Level",
        accessorFn: (r) => r.performance_level,
        cell: ({ row }) => (
          <PerformanceLevelBadge level={row.original.performance_level} />
        ),
      },
      {
        id: "average_score",
        header: "Avg Score",
        accessorFn: (r) => r.average_score,
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-foreground tabular-nums">
            {formatScore(row.original.average_score)}
          </span>
        ),
      },
      {
        id: "completed",
        header: "Completed",
        accessorFn: (r) => r.completed_count,
        cell: ({ row }) => (
          <span className="text-sm text-foreground tabular-nums">
            {row.original.completed_count}/
            {row.original.assigned_count}
          </span>
        ),
      },
      {
        id: "missing",
        header: "Missing",
        accessorFn: (r) => r.missing_count,
        cell: ({ row }) => (
          <span
            className={`text-sm tabular-nums ${
              row.original.missing_count > 0
                ? "text-amber-600 dark:text-amber-400"
                : "text-foreground"
            }`}
          >
            {row.original.missing_count}
          </span>
        ),
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
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/teacher/reports/student/${row.original.student_id}`)}
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
        title="Student Performance"
        description="Loading student performance data..."
        icon={Users}
        cards={3}
      />
    );
  }

  if (isError) {
    return (
      <ReportErrorBlock
        title="student performance"
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
        title="Student Performance"
        description="Compare students across classes, spot gaps and track completion"
        icon={Users}
      />

      <ReportFilterBar
        filters={{ search, class_id: classId, level }}
        onFiltersChange={(f) => {
          setSearch(f.search ?? "");
          setClassId(f.class_id);
          setLevel(f.level);
          setHasTimeout(undefined);
          setHasMissing(undefined);
        }}
        classes={classes}
        showLevel
      />

      {(hasTimeout || hasMissing) && (
        <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/40 px-3 py-2">
          <p className="text-xs text-muted-foreground">
            Filtered to{" "}
            <span className="font-medium text-foreground">
              {hasTimeout === "true" ? "students with multiple timeouts" : ""}
              {hasMissing === "true" ? "students with missing assignments" : ""}
            </span>
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={() => {
              setHasTimeout(undefined);
              setHasMissing(undefined);
            }}
          >
            Clear filter
          </Button>
        </div>
      )}

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
            <Users className="h-8 w-8 text-muted-foreground" />
            <p>No students match the current filters.</p>
          </div>
        }
      />
    </div>
  );
}
