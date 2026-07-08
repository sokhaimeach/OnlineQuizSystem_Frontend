import { useCallback, useEffect, useState } from "react"
import { ArrowLeft, ClipboardList, School, Share2, Users } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import type { DashboardSection } from "@/components/app-sidebar"
import { PageHeader } from "@/components/PageHeader"
import { QueryError } from "@/components/teacher/QueryError"
import { ClassShareDialog } from "@/components/teacher/ClassShareDialog"
import { AssignmentDialog } from "@/components/teacher/assignment/AssignmentDialog"
import {
  AssignmentFilters,
  type AssignmentStatusFilter,
} from "@/components/teacher/assignment/AssignmentFilters"
import {
  AssignmentShareDialog,
  type AssignmentShareMode,
} from "@/components/teacher/assignment/AssignmentShareDialog"
import { AssignmentTable } from "@/components/teacher/assignment/AssignmentDataTable"
import { StudentTable } from "@/components/teacher/student/studentTable"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  useCreateAssignment,
  useDeleteAssignment,
  useGetAssignmentByClassId,
  useUpdateAssignment,
} from "@/hooks/api/useAssignment"
import { useGetQuizOptions } from "@/hooks/api/useQuiz"
import { useGetStudentByClassId } from "@/hooks/api/useStudent"
import type { AssignmentWithQuiz, CreateAssignment } from "@/models/assignment.interface"
import type { Class } from "@/models/class.interface"

interface ClassDetailViewProps {
  onNavigate: (section: DashboardSection) => void
}

export function ClassDetailView({ onNavigate }: ClassDetailViewProps) {
  const { classId = "" } = useParams()
  const navigate = useNavigate()
  const [studentSearch, setStudentSearch] = useState("")
  const [assignmentSearch, setAssignmentSearch] = useState("")
  const [debouncedStudentSearch, setDebouncedStudentSearch] = useState("")
  const [debouncedAssignmentSearch, setDebouncedAssignmentSearch] = useState("")
  const [status, setStatus] = useState<AssignmentStatusFilter>("ALL")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<AssignmentWithQuiz | null>(null)
  const [sharingAssignment, setSharingAssignment] = useState<AssignmentWithQuiz | null>(null)
  const [shareMode, setShareMode] = useState<AssignmentShareMode>("link")
  const [sharingClass, setSharingClass] = useState<Class | null>(null)

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedStudentSearch(studentSearch.trim()), 300)
    return () => window.clearTimeout(timeout)
  }, [studentSearch])

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedAssignmentSearch(assignmentSearch.trim()), 300)
    return () => window.clearTimeout(timeout)
  }, [assignmentSearch])

  const studentsQuery = useGetStudentByClassId(classId, debouncedStudentSearch)
  const assignmentsQuery = useGetAssignmentByClassId(classId, {
    search: debouncedAssignmentSearch || undefined,
    filter: status === "ALL" ? undefined : status,
  })
  const quizzesQuery = useGetQuizOptions()
  const createAssignment = useCreateAssignment()
  const updateAssignment = useUpdateAssignment()
  const deleteAssignment = useDeleteAssignment()

  const viewStudent = useCallback((studentId: string) => {
    navigate(`/teacher/students/${studentId}`)
  }, [navigate])
  const viewAttempts = useCallback((assignmentId: string) => {
    navigate(`/teacher/assignments/${assignmentId}/attempts`)
  }, [navigate])
  const editAssignment = useCallback((assignment: AssignmentWithQuiz) => {
    createAssignment.reset()
    updateAssignment.reset()
    setEditingAssignment(assignment)
    setDialogOpen(true)
  }, [createAssignment, updateAssignment])
  const openCreateAssignment = useCallback(() => {
    createAssignment.reset()
    updateAssignment.reset()
    setEditingAssignment(null)
    setDialogOpen(true)
  }, [createAssignment, updateAssignment])
  const removeAssignment = useCallback((assignment: AssignmentWithQuiz) => {
    deleteAssignment.mutate({ assignmentId: assignment.id, classId })
  }, [classId, deleteAssignment])
  const saveAssignment = useCallback((payload: CreateAssignment) => {
    const options = {
      onSuccess: () => {
        setDialogOpen(false)
        setEditingAssignment(null)
      },
    }
    if (editingAssignment) {
      updateAssignment.mutate({ assignmentId: editingAssignment.id, payload }, options)
    } else {
      createAssignment.mutate(payload, options)
    }
  }, [createAssignment, editingAssignment, updateAssignment])
  const shareAssignment = useCallback((assignment: AssignmentWithQuiz, mode: AssignmentShareMode) => {
    setShareMode(mode)
    setSharingAssignment(assignment)
  }, [])

  const saving = createAssignment.isPending || updateAssignment.isPending
  const saveError = createAssignment.isError
    ? createAssignment.error instanceof Error ? createAssignment.error.message : "The assignment could not be created."
    : updateAssignment.isError
      ? updateAssignment.error instanceof Error ? updateAssignment.error.message : "The assignment could not be updated."
      : undefined
  const quizzes = quizzesQuery.data ?? []

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
          secondaryAction={{ label: "Share", icon: Share2, onClick: () => setSharingClass({ id: classId } as Class) }}
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
              loading={studentsQuery.isLoading || studentsQuery.isFetching}
              search={studentSearch}
              onSearchChange={setStudentSearch}
              onView={viewStudent}
            />
          )}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-3 pt-2">
          <p className="text-sm text-muted-foreground">Create, manage, and share assignments for this class.</p>
          <AssignmentFilters
            search={assignmentSearch}
            filter={status}
            onSearchChange={setAssignmentSearch}
            onStatusChange={setStatus}
            onCreate={openCreateAssignment}
          />
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
              <AssignmentTable
                assignments={assignmentsQuery.data ?? []}
                loading={assignmentsQuery.isLoading || assignmentsQuery.isFetching}
                deletingId={deleteAssignment.isPending ? deleteAssignment.variables?.assignmentId : undefined}
                onViewAttempts={viewAttempts}
                onEdit={editAssignment}
                onDelete={removeAssignment}
                onShare={shareAssignment}
              />
            </>
          )}
        </TabsContent>
      </Tabs>

      <AssignmentDialog
        open={dialogOpen}
        classId={classId}
        assignment={editingAssignment}
        quizzes={quizzes}
        loadingQuizzes={quizzesQuery.isLoading}
        saving={saving}
        error={saveError}
        onOpenChange={setDialogOpen}
        onSave={saveAssignment}
      />
      <AssignmentShareDialog
        assignment={sharingAssignment}
        mode={shareMode}
        onClose={() => setSharingAssignment(null)}
      />
      <ClassShareDialog classItem={sharingClass} onClose={() => setSharingClass(null)} />
    </div>
  )
}
