import { useMemo } from "react"
import { DataTable } from "@/components/data-table"
import type { StudentWithUser } from "@/models/student.interface"
import { studentColumns } from "./studentColumn"

interface StudentTableProps {
  students: StudentWithUser[]
  loading?: boolean
  onView: (studentId: string) => void
}

export function StudentTable({ students, loading, onView }: StudentTableProps) {
  const columns = useMemo(() => studentColumns(onView), [onView])
  return (
    <DataTable
      columns={columns}
      data={students}
      loading={loading}
      getRowId={student => student.id ?? student.user_id}
      emptyState="No students are enrolled in this class."
    />
  )
}
