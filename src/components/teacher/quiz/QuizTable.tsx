import { useMemo } from "react";
import { Search } from "lucide-react";
import type { PaginationState, SortingState } from "@/components/data-table";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QuizListItem } from "@/models/quiz.interface";
import { quizTableColumns } from "./QuizTableColumns";

export type QuizStatusFilter = "ALL" | "PUBLISHED" | "DRAFT" | "ARCHIVED";

interface QuizTableProps {
  quizzes: QuizListItem[];
  loading?: boolean;
  search: string;
  status: QuizStatusFilter;
  pagination: PaginationState;
  sorting: SortingState;
  pageCount: number;
  rowCount: number;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: QuizStatusFilter) => void;
  onPaginationChange: (value: PaginationState) => void;
  onSortingChange: (value: SortingState) => void;
  onView: (quiz: QuizListItem) => void;
  onEdit: (quiz: QuizListItem) => void;
  onDelete: (quiz: QuizListItem) => void;
}

export function QuizTable({
  quizzes,
  loading,
  search,
  status,
  pagination,
  sorting,
  pageCount,
  rowCount,
  onSearchChange,
  onStatusChange,
  onPaginationChange,
  onSortingChange,
  onView,
  onEdit,
  onDelete,
}: QuizTableProps) {
  const columns = useMemo(
    () => quizTableColumns({ onView, onEdit, onDelete }),
    [onDelete, onEdit, onView],
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search quizzes by title…"
            aria-label="Search quizzes by title"
            className="pl-9"
          />
        </div>
        <Select
          value={status}
          onValueChange={(value) => onStatusChange(value as QuizStatusFilter)}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={quizzes}
        loading={loading}
        getRowId={(quiz) => quiz.id}
        emptyState={
          search || status !== "ALL"
            ? "No quizzes match the current filters."
            : "No quizzes have been created for this subject."
        }
        pagination={pagination}
        onPaginationChange={(updater) => {
          onPaginationChange(
            typeof updater === "function" ? updater(pagination) : updater,
          );
        }}
        sorting={sorting}
        onSortingChange={(updater) => {
          onSortingChange(
            typeof updater === "function" ? updater(sorting) : updater,
          );
        }}
        pageCount={pageCount}
        rowCount={rowCount}
        manualPagination
        manualSorting
        manualFiltering
      />
    </div>
  );
}
