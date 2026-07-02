import { useMemo } from "react"
import { DataTable } from "@/components/data-table"
import type { StudentAttemptsHistory } from "@/models/student.interface"
import { attemptHistoryColumns } from "./attemptHistoryColumns"

interface AttemptHistoryTableProps {
  attempts: StudentAttemptsHistory[]
  loading?: boolean
  onView: (attemptId: string) => void
}

export function AttemptHistoryTable({ attempts, loading, onView }: AttemptHistoryTableProps) {
  const columns = useMemo(() => attemptHistoryColumns(onView), [onView])
  return (
    <DataTable
      columns={columns}
      data={attempts}
      loading={loading}
      getRowId={attempt => attempt.id}
      emptyState="This student has no quiz attempts yet."
    />
  )
}
