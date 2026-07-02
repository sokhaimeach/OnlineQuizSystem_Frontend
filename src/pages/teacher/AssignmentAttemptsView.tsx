import { useCallback } from "react"
import { ArrowLeft, FileCheck2 } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { PageHeader } from "@/components/PageHeader"
import { QueryError } from "@/components/teacher/QueryError"
import { AssignmentAttemptTable } from "@/components/teacher/attempt/AssignmentAttemptTable"
import { Button } from "@/components/ui/button"
import { useGetAttemptByAssignmentId } from "@/hooks/api/useAssignment"

export function AssignmentAttemptsView() {
  const { assignmentId = "" } = useParams()
  const navigate = useNavigate()
  const attemptsQuery = useGetAttemptByAssignmentId(assignmentId)
  const viewAttempt = useCallback((attemptId: string) => {
    navigate(`/teacher/attempts/${attemptId}`)
  }, [navigate])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button variant="ghost" size="sm" className="-ml-2 mb-4 gap-1.5" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4" /> Back to class
        </Button>
        <PageHeader
          title="Assignment attempts"
          description={`${attemptsQuery.data?.length ?? 0} attempts for assignment ${assignmentId}`}
          icon={FileCheck2}
        />
      </div>

      {attemptsQuery.isError ? (
        <QueryError
          message={attemptsQuery.error instanceof Error ? attemptsQuery.error.message : "The attempts could not be loaded."}
          onRetry={() => attemptsQuery.refetch()}
        />
      ) : (
        <AssignmentAttemptTable
          attempts={attemptsQuery.data ?? []}
          loading={attemptsQuery.isLoading}
          onView={viewAttempt}
        />
      )}
    </div>
  )
}
