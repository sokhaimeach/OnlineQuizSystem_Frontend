import { ClipboardList, Loader2 } from "lucide-react"
import { useParams } from "react-router-dom"
import { useGetAssignmentById } from "@/hooks/api/useAssignment"

export function DoQuizPage() {
  const { assignmentId = "" } = useParams()
  const assignmentQuery = useGetAssignmentById(assignmentId)
  const assignment = assignmentQuery.data

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
      <section className="w-full max-w-xl rounded-xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ClipboardList className="size-5" />
        </div>
        {assignmentQuery.isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading assignment…
          </div>
        ) : assignmentQuery.isError ? (
          <div>
            <h1 className="text-2xl font-semibold">Assignment unavailable</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This assignment could not be loaded. Check the shared link and try again.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-medium text-primary">Assignment</p>
            <h1 className="mt-1 text-2xl font-semibold">{assignment?.title ?? "Untitled assignment"}</h1>
            <p className="mt-2 text-muted-foreground">{assignment?.quiz?.title ?? "Quiz title unavailable"}</p>
            <div className="mt-8 rounded-lg border border-dashed bg-muted/30 px-4 py-8 text-center">
              <p className="font-medium">Quiz content coming soon</p>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
