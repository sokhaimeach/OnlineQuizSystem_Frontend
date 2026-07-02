import { useCallback, useState } from "react"
import { ArrowLeft, ClipboardList, School, Users } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import type { DashboardSection } from "@/components/app-sidebar"
import { PageHeader } from "@/components/PageHeader"
import { QueryError } from "@/components/teacher/QueryError"
import { ClassAssignmentTable } from "@/components/teacher/assignment/ClassAssignmentTable"
import { EditAssignmentDialog } from "@/components/teacher/assignment/EditAssignmentDialog"
import { StudentTable } from "@/components/teacher/student/studentTable"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDeleteAssignment, useGetAssignmentByClassId, useUpdateAssignment } from "@/hooks/api/useAssignment"
import { useGetStudentByClassId } from "@/hooks/api/useStudent"
import type { AssignmentWithQuiz, CreateAssignment } from "@/models/assignment.interface"

interface ClassDetailViewProps {
  onNavigate: (section: DashboardSection) => void
}

export function ClassDetailView({ onNavigate }: ClassDetailViewProps) {
  const { classId = "" } = useParams()
  const navigate = useNavigate()
  const studentsQuery = useGetStudentByClassId(classId)
  const assignmentsQuery = useGetAssignmentByClassId(classId)
  const updateAssignment = useUpdateAssignment()
  const deleteAssignment = useDeleteAssignment()
  const [editingAssignment, setEditingAssignment] = useState<AssignmentWithQuiz | null>(null)
  const viewStudent = useCallback((studentId: string) => {
    navigate(`/teacher/students/${studentId}`)
  }, [navigate])
  const viewAttempts = useCallback((assignmentId: string) => {
    navigate(`/teacher/assignments/${assignmentId}/attempts`)
  }, [navigate])
  const editAssignment = useCallback((assignment: AssignmentWithQuiz) => {
    updateAssignment.reset()
    setEditingAssignment(assignment)
  }, [updateAssignment])
  const removeAssignment = useCallback((assignment: AssignmentWithQuiz) => {
    if (assignment.status !== "DRAFT") return
    if (!window.confirm(`Delete the draft assignment "${assignment.title}"? This action cannot be undone.`)) return
    deleteAssignment.mutate({ assignmentId: assignment.id, classId })
  }, [classId, deleteAssignment])
  const saveAssignment = useCallback((payload: Partial<CreateAssignment>) => {
    if (!editingAssignment || editingAssignment.status !== "DRAFT") return
    updateAssignment.mutate(
      { assignmentId: editingAssignment.id, payload },
      { onSuccess: () => setEditingAssignment(null) },
    )
  }, [editingAssignment, updateAssignment])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate("classes")}
          className="-ml-2 mb-4 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All classes
        </Button>
        <PageHeader
          title={`Class ${classId}`}
          description={`${studentsQuery.data?.length ?? 0} students · ${assignmentsQuery.data?.length ?? 0} assignments`}
          icon={School}
        />
      </div>

      <Tabs defaultValue="students">
        <TabsList className="h-9 bg-muted/50">
          <TabsTrigger value="students" className="gap-1.5 text-xs">
            <Users className="size-3.5" /> Students
          </TabsTrigger>
          <TabsTrigger value="assignments" className="gap-1.5 text-xs">
            <ClipboardList className="size-3.5" /> Assignments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-3 pt-2">
          <p className="text-sm text-muted-foreground">Students currently enrolled in this class.</p>
          {studentsQuery.isError ? (
            <QueryError
              message={studentsQuery.error instanceof Error ? studentsQuery.error.message : "The student list could not be loaded."}
              onRetry={() => studentsQuery.refetch()}
            />
          ) : (
            <StudentTable
              students={studentsQuery.data ?? []}
              loading={studentsQuery.isLoading}
              onView={viewStudent}
            />
          )}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-3 pt-2">
          <p className="text-sm text-muted-foreground">View attempts and manage assignments while they are drafts.</p>
          {assignmentsQuery.isError ? (
            <QueryError
              message={assignmentsQuery.error instanceof Error ? assignmentsQuery.error.message : "The assignment list could not be loaded."}
              onRetry={() => assignmentsQuery.refetch()}
            />
          ) : (
            <>
              {deleteAssignment.isError && (
                <p className="text-sm text-destructive">
                  {deleteAssignment.error instanceof Error ? deleteAssignment.error.message : "The assignment could not be deleted."}
                </p>
              )}
              <ClassAssignmentTable
                assignments={assignmentsQuery.data ?? []}
                loading={assignmentsQuery.isLoading}
                deletingId={deleteAssignment.isPending ? deleteAssignment.variables?.assignmentId : undefined}
                onViewAttempts={viewAttempts}
                onEdit={editAssignment}
                onDelete={removeAssignment}
              />
            </>
          )}
        </TabsContent>
      </Tabs>

      <EditAssignmentDialog
        assignment={editingAssignment}
        saving={updateAssignment.isPending}
        error={updateAssignment.isError
          ? updateAssignment.error instanceof Error
            ? updateAssignment.error.message
            : "The assignment could not be updated."
          : undefined}
        onClose={() => setEditingAssignment(null)}
        onSave={saveAssignment}
      />
    </div>
  )
}
