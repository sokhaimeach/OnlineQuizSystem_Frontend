import { Eye } from "lucide-react"
import type { ColumnDef } from "@/components/data-table"
import { StatusBadge } from "@/components/StatusBadge"
import { Button } from "@/components/ui/button"
import type { StudentWithUser } from "@/models/student.interface"
import { formatEnum } from "@/utils/student-format"

export function studentColumns(onView: (studentId: string) => void): ColumnDef<StudentWithUser>[] {
  return [
    {
      id: "studentId",
      accessorFn: student => student.id ?? student.user_id,
      header: "Student ID",
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.id ?? row.original.user_id}</span>,
    },
    {
      id: "fullName",
      accessorFn: student => `${student.user.first_name} ${student.user.last_name}`,
      header: "Full name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.user.first_name} {row.original.user.last_name}</span>
      ),
    },
    {
      accessorFn: student => student.user.gender,
      id: "gender",
      header: "Gender",
      cell: ({ row }) => formatEnum(row.original.user.gender),
    },
    {
      accessorFn: student => student.user.email,
      id: "email",
      header: "Email",
    },
    {
      accessorFn: student => student.user.status,
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.user.status
        return (
          <StatusBadge variant={status === "ACTIVE" ? "success" : status === "SUSPENDED" ? "danger" : "muted"} dot>
            {formatEnum(status)}
          </StatusBadge>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          onClick={() => onView(row.original.id ?? row.original.user_id)}
        >
          <Eye className="size-4" />
          View detail
        </Button>
      ),
    },
  ]
}
