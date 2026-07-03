import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import type { ColumnDef } from "@/components/data-table"
import { StatusBadge } from "@/components/StatusBadge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { QuizListItem } from "@/models/quiz.interface"
import { formatDateTime } from "@/utils/student-format"

interface QuizColumnActions {
  onView: (quiz: QuizListItem) => void
  onEdit: (quiz: QuizListItem) => void
  onDelete: (quiz: QuizListItem) => void
}

export function quizTableColumns({
  onView,
  onEdit,
  onDelete,
}: QuizColumnActions): ColumnDef<QuizListItem>[] {
  return [
    {
      accessorKey: "title",
      header: "Quiz Title",
      cell: ({ row }) => (
        <div className="min-w-48">
          <button
            type="button"
            onClick={() => onView(row.original)}
            className="max-w-72 truncate text-left font-medium hover:underline"
          >
            {row.original.title}
          </button>
          {row.original.description && (
            <p className="mt-0.5 max-w-72 truncate text-xs text-muted-foreground">
              {row.original.description}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "question_count",
      header: "Questions",
      cell: ({ row }) => <span className="tabular-nums">{row.original.question_count}</span>,
    },
    {
      accessorKey: "assignment_count",
      header: "Assignments",
      cell: ({ row }) => <span className="tabular-nums">{row.original.assignment_count ?? "—"}</span>,
    },
    {
      accessorKey: "total_score",
      header: "Total Score",
      cell: ({ row }) => <span className="tabular-nums">{row.original.total_score}</span>,
    },
    {
      accessorKey: "passing_score",
      header: "Passing",
      cell: ({ row }) => <span className="tabular-nums">{row.original.passing_score}%</span>,
    },
    {
      accessorKey: "duration_minutes",
      header: "Duration",
      cell: ({ row }) => <span className="whitespace-nowrap">{row.original.duration_minutes} min</span>,
    },
    {
      accessorKey: "is_public",
      header: "Visibility",
      cell: ({ row }) => (
        <StatusBadge variant={row.original.is_public ? "success" : "muted"} dot>
          {row.original.is_public ? "Published" : "Draft"}
        </StatusBadge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => <span className="whitespace-nowrap">{formatDateTime(row.original.createdAt)}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${row.original.title}`}>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onSelect={() => onView(row.original)}>
              <Eye /> View quiz
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onEdit(row.original)}>
              <Pencil /> Edit quiz
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => onDelete(row.original)}>
              <Trash2 /> Delete quiz
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}
