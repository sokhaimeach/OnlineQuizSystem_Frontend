import { useMemo } from "react"
import { Search } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { Input } from "@/components/ui/input"
import type { StudentWithUser } from "@/models/student.interface"
import { studentColumns } from "./studentColumn"

interface StudentTableProps {
  students: StudentWithUser[]
  loading?: boolean
  search: string
  onSearchChange: (value: string) => void
  onView: (studentId: string) => void
}

export function StudentTable({ students, loading, search, onSearchChange, onView }: StudentTableProps) {
  const columns = useMemo(() => studentColumns(onView), [onView])
  return (
    <div className="space-y-3">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={event => onSearchChange(event.target.value)}
          placeholder="Search by name or email…"
          aria-label="Search students by first name, last name, or email"
          className="pl-9"
        />
      </div>
      <DataTable
        columns={columns}
        data={students}
        loading={loading}
        getRowId={student => student.id ?? student.user_id}
        emptyState={search ? "No students match your search." : "No students are enrolled in this class."}
      />
    </div>
  )
}
