import { Eye } from "lucide-react"
import type { ColumnDef } from "@/components/data-table"
import { StatusBadge } from "@/components/StatusBadge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { StudentWithUser } from "@/models/student.interface"
import { formatEnum } from "@/utils/student-format"

export function studentColumns(onView: (studentId: string) => void): ColumnDef<StudentWithUser>[] {
  return [
    {
      id: "profile",
      header: "Student",
      cell: ({ row }) => {
        const student = row.original
        const initials = `${student.user.first_name[0]}${student.user.last_name[0]}`
        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarImage src={student.user.avatar_url ?? undefined} alt={`${student.user.first_name} ${student.user.last_name}`} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium leading-tight">{student.user.first_name} {student.user.last_name}</p>
              <p className="text-xs text-muted-foreground">{student.user.email}</p>
            </div>
          </div>
        )
      },
    },
    {
      accessorFn: student => student.user.gender,
      id: "gender",
      header: "Gender",
      cell: ({ row }) => formatEnum(row.original.user.gender),
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
