import {
  CalendarClock,
  CheckCircle2,
  Play,
  RotateCcw,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type ColumnDef } from "@/components/data-table";
import { TablePagination } from "@/components/table-pagination";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetStudentAssignments } from "@/hooks/api/useStudent";
import { formatDateTime } from "@/utils/student-format";
import type {
  StudentAssignmentListItem,
  StudentAssignmentStatus,
} from "@/models/assignment.interface";

const statusVariant: Record<
  StudentAssignmentStatus,
  "success" | "warning" | "info" | "danger" | "muted" | "primary"
> = {
  ACTIVE: "success",
  UPCOMING: "info",
  COMPLETED: "primary",
  OVERDUE: "danger",
};

const statusLabel: Record<StudentAssignmentStatus, string> = {
  ACTIVE: "Active",
  UPCOMING: "Upcoming",
  COMPLETED: "Completed",
  OVERDUE: "Overdue",
};

function AttemptStatus({ a }: { a: StudentAssignmentListItem }) {
  const attempt = a.attempt;
  if (!attempt)
    return (
      <span className="text-xs text-muted-foreground">Not started</span>
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
}

function ActionButton({
  a,
  navigate,
  fullWidth = false,
}: {
  a: StudentAssignmentListItem;
  navigate: ReturnType<typeof useNavigate>;
  fullWidth?: boolean;
}) {
  if (a.attempt?.status === "IN_PROGRESS") {
    return (
      <Button
        size="sm"
        className={fullWidth ? "w-full" : undefined}
        onClick={() => navigate(`/do-quiz/${a.id}`)}
      >
        <Play /> Continue
      </Button>
    );
  }
  if (a.status === "ACTIVE" || a.status === "UPCOMING") {
    return (
      <Button
        size="sm"
        className={fullWidth ? "w-full" : undefined}
        onClick={() => navigate(`/do-quiz/${a.id}`)}
      >
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
        className={fullWidth ? "w-full" : undefined}
        onClick={() => navigate(`/student/result/${a.attempt?.id}`)}
      >
        <CheckCircle2 /> View
      </Button>
    );
  }
  return null;
}

function AssignmentCard({
  a,
  navigate,
}: {
  a: StudentAssignmentListItem;
  navigate: ReturnType<typeof useNavigate>;
}) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-medium leading-snug break-words">{a.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {a.class?.class_name ?? "—"}
              {a.quiz?.title ? ` · ${a.quiz.title}` : ""}
            </p>
          </div>
          <StatusBadge
            variant={statusVariant[a.status]}
            dot
            className="shrink-0"
          >
            {statusLabel[a.status]}
          </StatusBadge>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Due date</p>
            <p className="mt-0.5 font-medium">{formatDateTime(a.due_date)}</p>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Attempt</p>
            <div className="mt-0.5">
              <AttemptStatus a={a} />
            </div>
          </div>
        </div>

        <div className="border-t pt-3">
          <ActionButton a={a} navigate={navigate} fullWidth />
        </div>
      </CardContent>
    </Card>
  );
}

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
            {statusLabel[row.original.status]}
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
        cell: ({ row }) => <AttemptStatus a={row.original} />,
      },
      {
        id: "actions",
        header: "Action",
        enableSorting: false,
        cell: ({ row }) => <ActionButton a={row.original} navigate={navigate} />,
      },
    ],
    [navigate],
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const totalItems = meta?.totalItems ?? assignments.length;
  const totalPages = meta?.totalPages ?? 1;
  const firstRowNumber =
    assignments.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastRowNumber = Math.min(firstRowNumber + assignments.length - 1, totalItems);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">
            All assignments across your classes.
          </p>
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="hidden md:block space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
        <div className="space-y-3 md:hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
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
          <SelectTrigger className="w-full sm:w-40">
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
        <>
          <div className="hidden md:block">
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
              pageCount={totalPages}
              rowCount={totalItems}
              manualPagination
            />
          </div>

          <div className="space-y-6 md:hidden">
            <div className="space-y-3">
              {assignments.map((a) => (
                <AssignmentCard key={a.id} a={a} navigate={navigate} />
              ))}
            </div>
            <TablePagination
              firstRowNumber={firstRowNumber}
              lastRowNumber={lastRowNumber}
              rowCount={totalItems}
              pageIndex={page - 1}
              pageCount={totalPages}
              canPreviousPage={page > 1}
              canNextPage={page < totalPages}
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          </div>
        </>
      )}
    </div>
  );
}
