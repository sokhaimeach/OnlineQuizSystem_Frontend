import {
  CalendarClock,
  CheckCircle2,
  Loader2,
  Play,
  RotateCcw,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type ColumnDef } from "@/components/data-table";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { useGetStudentAssignments } from "@/hooks/api/useStudent";
import { formatDateTime } from "@/utils/student-format";
import type {
  StudentAssignmentListItem,
  StudentAssignmentStatus,
} from "@/models/assignment.interface";

const statusVariant: Record<
  StudentAssignmentStatus,
  "success" | "warning" | "info" | "danger" | "muted"
> = {
  ACTIVE: "success",
  UPCOMING: "info",
  COMPLETED: "primary",
  OVERDUE: "danger",
};

export function StudentAssignmentsView() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, refetch } = useGetStudentAssignments({
    page,
    limit: pageSize,
    search: search || undefined,
    filter: filter || undefined,
  });

  const meta = (
    data as {
      meta?: { totalItems: number; totalPages: number; currentPage: number };
    }
  )?.meta;
  const assignments: StudentAssignmentListItem[] =
    (data as { data?: StudentAssignmentListItem[] })?.data ?? [];

  const columns = useMemo<ColumnDef<StudentAssignmentListItem>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.title}</span>
        ),
      },
      {
        id: "class_name",
        header: "Class",
        accessorFn: (a) => a.class?.class_name ?? "",
        cell: ({ row }) => row.original.class?.class_name ?? "—",
      },
      {
        id: "quiz_title",
        header: "Quiz",
        accessorFn: (a) => a.quiz?.title ?? "",
        cell: ({ row }) => row.original.quiz?.title ?? "—",
      },
      {
        accessorKey: "due_date",
        header: "Due Date",
        cell: ({ row }) => formatDateTime(row.original.due_date),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge variant={statusVariant[row.original.status]} dot>
            {row.original.status}
          </StatusBadge>
        ),
      },
      {
        id: "attempt_status",
        header: "Attempt",
        accessorFn: (a) => {
          if (!a.attempt) return "Not started";
          if (a.attempt.status === "IN_PROGRESS") return "In Progress";
          return "Completed";
        },
        cell: ({ row }) => {
          const attempt = row.original.attempt;
          if (!attempt)
            return (
              <span className="text-muted-foreground text-xs">Not started</span>
            );
          if (attempt.status === "IN_PROGRESS")
            return (
              <StatusBadge variant="warning" dot>
                In Progress
              </StatusBadge>
            );
          if (attempt.status === "TIMEOUT")
            return (
              <StatusBadge variant="danger" dot>
                Timed Out
              </StatusBadge>
            );
          return (
            <StatusBadge variant="success" dot>
              Submitted
            </StatusBadge>
          );
        },
      },
      {
        id: "actions",
        header: "Action",
        enableSorting: false,
        cell: ({ row }) => {
          const a = row.original;
          if (a.attempt?.status === "IN_PROGRESS") {
            return (
              <Button size="sm" onClick={() => navigate(`/do-quiz/${a.id}`)}>
                <Play /> Continue
              </Button>
            );
          }
          if (a.status === "ACTIVE" || a.status === "UPCOMING") {
            return (
              <Button size="sm" onClick={() => navigate(`/do-quiz/${a.id}`)}>
                <Play /> Start
              </Button>
            );
          }
          if (
            a.attempt?.status === "SUBMITTED" ||
            a.attempt?.status === "TIMEOUT"
          ) {
            return (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/student/result/${a.attempt?.id}`)}
              >
                <CheckCircle2 /> View
              </Button>
            );
          }
          return null;
        },
      },
    ],
    [navigate],
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">
            All assignments across your classes.
          </p>
        </div>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin size-6 text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">
            All assignments across your classes.
          </p>
        </div>
        <div className="rounded-xl border border-destructive/30 p-8 text-center">
          <p>Assignments could not be loaded.</p>
          <Button className="mt-3" variant="outline" onClick={() => refetch()}>
            <RotateCcw /> Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Assignments</h1>
        <p className="text-muted-foreground">
          All assignments across your joined classes.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search assignments..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select
          value={filter}
          onValueChange={(v) => {
            setFilter(v === "all" ? "" : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="UPCOMING">Upcoming</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="OVERDUE">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!assignments.length ? (
        <EmptyState
          icon={CalendarClock}
          title="No assignments found"
          description={
            search || filter
              ? "Try changing your search or filter."
              : "No assignments have been published for your classes yet."
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={assignments}
          emptyState="No assignments match your search."
          pagination={{ pageIndex: page - 1, pageSize }}
          onPaginationChange={(updater) => {
            const next =
              typeof updater === "function"
                ? updater({ pageIndex: page - 1, pageSize })
                : updater;
            setPage(next.pageIndex + 1);
          }}
          pageCount={meta?.totalPages ?? 1}
          rowCount={meta?.totalItems ?? assignments.length}
          manualPagination
        />
      )}
    </div>
  );
}
