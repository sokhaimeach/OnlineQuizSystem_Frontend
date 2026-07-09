import { useEffect, useState } from 'react'
import { ArrowLeft, BookOpen, Plus } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import type { DashboardSection } from '@/components/app-sidebar'
import type { PaginationState, SortingState } from '@/components/data-table'
import { PageHeader } from '@/components/PageHeader'
import { DeleteQuizDialog } from '@/components/teacher/quiz/DeleteQuizDialog'
import { EditQuizDialog } from '@/components/teacher/quiz/EditQuizDialog'
import { QuizTable, type QuizStatusFilter } from '@/components/teacher/quiz/QuizTable'
import { Button } from '@/components/ui/button'
import { useDeleteQuiz, useGetQuizzesForSubject, useUpdateQuiz } from '@/hooks/api/useQuiz'
import { useGetAllSubjects } from '@/hooks/api/useSubject'
import type { QuizListItem, UpdateQuizPayload } from '@/models/quiz.interface'

interface SubjectDetailViewProps {
  onNavigate: (section: DashboardSection) => void
}

export function SubjectDetailView({ onNavigate }: SubjectDetailViewProps) {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState<QuizStatusFilter>('ALL')
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [sorting, setSorting] = useState<SortingState>([])
  const [editingQuiz, setEditingQuiz] = useState<QuizListItem | null>(null)
  const [deletingQuiz, setDeletingQuiz] = useState<QuizListItem | null>(null)
  const subjectsQuery = useGetAllSubjects()
  const sort = sorting[0]
  const quizzesQuery = useGetQuizzesForSubject(subjectId, {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    status: status === 'ALL' ? undefined : status,
    sortBy: sort?.id,
    sortOrder: sort ? (sort.desc ? 'desc' : 'asc') : undefined,
  })
  const updateQuiz = useUpdateQuiz()
  const deleteQuiz = useDeleteQuiz()

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => window.clearTimeout(timeout)
  }, [search])

  useEffect(() => {
    setPagination(current => ({ ...current, pageIndex: 0 }))
  }, [debouncedSearch, status, subjectId])

  const selectedSubject = subjectsQuery.data?.pages
    .flatMap(page => page.data.subjects)
    .find(subject => subject.id === subjectId)
  const isUnassigned = subjectId === 'unassigned'
  const subjectTitle = isUnassigned
    ? 'Unassigned Quiz'
    : selectedSubject?.subject_name ?? 'Subject quizzes'
  const subjectDescription = isUnassigned
    ? 'Quizzes that do not belong to a subject'
    : selectedSubject
      ? `${selectedSubject.quiz_count} ${selectedSubject.quiz_count === 1 ? 'quiz' : 'quizzes'}`
      : 'Quizzes for the selected subject'
  const subjectQuizzes = (quizzesQuery.data?.data ?? [])
    .filter(quiz => !isUnassigned || quiz.subject_id === null)

  const saveQuiz = (payload: UpdateQuizPayload) => {
    if (!editingQuiz) return
    updateQuiz.mutate(
      { quizId: editingQuiz.id, payload },
      { onSuccess: () => setEditingQuiz(null) },
    )
  }

  const confirmDeleteQuiz = () => {
    if (!deletingQuiz) return
    deleteQuiz.mutate(deletingQuiz.id, { onSuccess: () => setDeletingQuiz(null) })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('subjects')}
          className="-ml-2 mb-4 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All Subjects
        </Button>
        <PageHeader
          title={subjectTitle}
          description={subjectDescription}
          icon={BookOpen}
          action={{ label: 'New Quiz', icon: Plus, onClick: () => onNavigate('create-quiz') }}
        />
      </div>

      {quizzesQuery.isError ? (
        <div className="rounded-md border border-destructive/40 p-6 text-center">
          <p className="text-sm text-destructive">The quizzes could not be loaded.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => void quizzesQuery.refetch()}
          >
            Try again
          </Button>
        </div>
      ) : (
        <QuizTable
          quizzes={subjectQuizzes}
          loading={quizzesQuery.isLoading || quizzesQuery.isFetching}
          search={search}
          status={status}
          pagination={pagination}
          sorting={sorting}
          pageCount={quizzesQuery.data?.meta.totalPages ?? 0}
          rowCount={quizzesQuery.data?.meta.totalItems ?? 0}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          onView={quiz => navigate(`/teacher/quizzes/${quiz.id}`)}
          onEdit={quiz => {
            updateQuiz.reset()
            setEditingQuiz(quiz)
          }}
          onDelete={quiz => {
            deleteQuiz.reset()
            setDeletingQuiz(quiz)
          }}
        />
      )}

      <EditQuizDialog
        quiz={editingQuiz}
        saving={updateQuiz.isPending}
        error={updateQuiz.isError
          ? updateQuiz.error instanceof Error ? updateQuiz.error.message : 'The quiz could not be updated.'
          : undefined}
        onOpenChange={open => !open && setEditingQuiz(null)}
        onSave={saveQuiz}
      />
      <DeleteQuizDialog
        quiz={deletingQuiz}
        deleting={deleteQuiz.isPending}
        error={deleteQuiz.isError
          ? deleteQuiz.error instanceof Error ? deleteQuiz.error.message : 'The quiz could not be deleted.'
          : undefined}
        onOpenChange={open => !open && setDeletingQuiz(null)}
        onConfirm={confirmDeleteQuiz}
      />
    </div>
  )
}
