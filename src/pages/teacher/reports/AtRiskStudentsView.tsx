import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle, Eye } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReportErrorBlock, ReportLoadingBlock } from "@/components/teacher/reports/ReportBlocks";
import { ReportFilterBar } from "@/components/teacher/reports/ReportFilterBar";
import { formatScore } from "@/components/teacher/reports/reportUtils";
import { useAtRiskStudents } from "@/hooks/api/useReports";
import { useGetRecentClasses } from "@/hooks/api/useClass";
import type { AtRiskStudentRow } from "@/models/report.interface";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AtRiskStudentsView() {
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
    useAtRiskStudents(query);

  const classes = useMemo(
    () =>
      (classesQuery.data ?? []).map((c) => ({
        id: c.id,
        class_name: c.class_name,
      })),
    [classesQuery.data],
  );

  const columns = useMemo<ColumnDef<AtRiskStudentRow>[]>(
    () => [
      {
        id: "student",
        header: "Student",
        accessorFn: (r) => r.name,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={row.original.avatar_url || undefined} />
              <AvatarFallback className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">
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
        id: "completion",
        header: "Completion",
        accessorFn: (r) => r.completion_rate,
        cell: ({ row }) => (
          <span className="text-sm text-foreground tabular-nums">
            {row.original.completion_rate}%
          </span>
        ),
      },
      {
        id: "failed",
        header: "Failed",
        accessorFn: (r) => r.failed_count,
        cell: ({ row }) => (
          <span className="text-sm text-red-600 dark:text-red-400 tabular-nums">
            {row.original.failed_count}
          </span>
        ),
      },
      {
        id: "missing",
        header: "Missing",
        accessorFn: (r) => r.missing_count,
        cell: ({ row }) => (
          <span className="text-sm text-amber-600 dark:text-amber-400 tabular-nums">
            {row.original.missing_count}
          </span>
        ),
      },
      {
        id: "timeouts",
        header: "Timeouts",
        accessorFn: (r) => r.timed_out_count,
        cell: ({ row }) => (
          <span className="text-sm text-foreground tabular-nums">
            {row.original.timed_out_count}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() =>
                navigate(`/teacher/reports/student/${row.original.student_id}`)
              }
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
        title="At-Risk Students"
        description="Loading at-risk students..."
        icon={AlertTriangle}
        cards={3}
      />
    );
  }

  if (isError) {
    return (
      <ReportErrorBlock
        title="at-risk students"
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
        title="At-Risk Students"
        description="Students flagged for low scores, low completion or inactivity"
        icon={AlertTriangle}
      />

      <ReportFilterBar
        filters={{ search, class_id: classId }}
        onFiltersChange={(f) => {
          setSearch(f.search ?? "");
          setClassId(f.class_id);
        }}
        classes={classes}
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
            <AlertTriangle className="h-8 w-8 text-emerald-500" />
            <p>No at-risk students match the current filters.</p>
          </div>
        }
      />
    </div>
  );
}
