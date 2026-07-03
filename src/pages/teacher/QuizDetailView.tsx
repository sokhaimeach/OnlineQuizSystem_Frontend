import { useState } from "react"
import { FileQuestion } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { DeleteQuestionDialog } from "@/components/teacher/quiz/DeleteQuestionDialog"
import { DeleteQuizDialog } from "@/components/teacher/quiz/DeleteQuizDialog"
import { EditQuizDialog } from "@/components/teacher/quiz/EditQuizDialog"
import { QuestionBuilder } from "@/components/teacher/quiz/QuestionBuilder"
import { QuestionCard } from "@/components/teacher/quiz/QuestionCard"
import { QuizDetailHeader } from "@/components/teacher/quiz/QuizDetailHeader"
import { QuizSettingsCard } from "@/components/teacher/quiz/QuizSettingsCard"
import { QueryError } from "@/components/teacher/QueryError"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useAddQuestions,
  useDeleteQuestion,
  useDeleteQuiz,
  useGetQuizById,
  useUpdateQuestion,
  useUpdateQuiz,
} from "@/hooks/api/useQuiz"
import type {
  AddQuestionsPayload,
  QuestionWithOptions,
  UpdateQuestionPayload,
  UpdateQuizPayload,
} from "@/models/quiz.interface"

function mutationError(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export function QuizDetailView() {
  const { quizId = "" } = useParams()
  const navigate = useNavigate()
  const quizQuery = useGetQuizById(quizId)
  const updateQuiz = useUpdateQuiz()
  const deleteQuiz = useDeleteQuiz()
  const addQuestions = useAddQuestions()
  const updateQuestion = useUpdateQuestion()
  const deleteQuestion = useDeleteQuestion()
  const [editingQuiz, setEditingQuiz] = useState(false)
  const [addingQuestions, setAddingQuestions] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QuestionWithOptions | null>(null)
  const [deletingQuestion, setDeletingQuestion] = useState<QuestionWithOptions | null>(null)
  const [deletingQuiz, setDeletingQuiz] = useState(false)

  if (quizQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    )
  }

  if (quizQuery.isError || !quizQuery.data) {
    return (
      <QueryError
        message={mutationError(quizQuery.error, "The quiz could not be loaded.")}
        onRetry={() => void quizQuery.refetch()}
      />
    )
  }

  const quiz = quizQuery.data
  const backPath = quiz.subject_id
    ? `/teacher/subjects/${quiz.subject_id}`
    : "/teacher/subjects/unassigned"

  const saveQuiz = (payload: UpdateQuizPayload) => {
    updateQuiz.mutate({ quizId, payload }, { onSuccess: () => setEditingQuiz(false) })
  }

  const saveQuestions = (payload: AddQuestionsPayload) => {
    addQuestions.mutate(
      { quizId, payload },
      { onSuccess: () => setAddingQuestions(false) },
    )
  }

  const saveQuestion = (payload: UpdateQuestionPayload) => {
    if (!editingQuestion?.id) return
    updateQuestion.mutate(
      { questionId: editingQuestion.id, quizId, payload },
      { onSuccess: () => setEditingQuestion(null) },
    )
  }

  const confirmDeleteQuestion = () => {
    if (!deletingQuestion?.id) return
    deleteQuestion.mutate(
      { questionId: deletingQuestion.id, quizId },
      { onSuccess: () => setDeletingQuestion(null) },
    )
  }

  const confirmDeleteQuiz = () => {
    deleteQuiz.mutate(quizId, { onSuccess: () => navigate(backPath) })
  }

  return (
    <div className="flex flex-col gap-6">
      <QuizDetailHeader
        quiz={quiz}
        onBack={() => navigate(backPath)}
        onEdit={() => setEditingQuiz(true)}
        onAddQuestions={() => {
          addQuestions.reset()
          setEditingQuestion(null)
          setAddingQuestions(true)
        }}
        onDelete={() => setDeletingQuiz(true)}
      />

      <QuizSettingsCard quiz={quiz} />

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <FileQuestion className="size-4 text-muted-foreground" /> Questions
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {quiz.questions.length} {quiz.questions.length === 1 ? "question" : "questions"} in this quiz.
            </p>
          </div>
        </div>

        {addingQuestions && (
          <QuestionBuilder
            key="add-questions"
            saving={addQuestions.isPending}
            error={addQuestions.isError
              ? mutationError(addQuestions.error, "The questions could not be added.")
              : undefined}
            onCancel={() => setAddingQuestions(false)}
            onAdd={saveQuestions}
            onUpdate={() => undefined}
          />
        )}

        <div className="grid gap-4">
          {quiz.questions.map((question, index) => (
            editingQuestion?.id && editingQuestion.id === question.id ? (
              <QuestionBuilder
                key={`edit-${question.id}`}
                question={editingQuestion}
                saving={updateQuestion.isPending}
                error={updateQuestion.isError
                  ? mutationError(updateQuestion.error, "The question could not be updated.")
                  : undefined}
                onCancel={() => setEditingQuestion(null)}
                onAdd={() => undefined}
                onUpdate={saveQuestion}
              />
            ) : (
              <QuestionCard
                key={question.id ?? index}
                question={question}
                index={index}
                onEdit={() => {
                  updateQuestion.reset()
                  setAddingQuestions(false)
                  setEditingQuestion(question)
                }}
                onDelete={() => {
                  deleteQuestion.reset()
                  setDeletingQuestion(question)
                }}
              />
            )
          ))}
          {!addingQuestions && quiz.questions.length === 0 && (
            <div className="rounded-lg border border-dashed border-border p-10 text-center">
              <FileQuestion className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">No questions yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Use Add questions to start building this quiz.
              </p>
            </div>
          )}
        </div>
      </section>

      <EditQuizDialog
        quiz={editingQuiz ? quiz : null}
        saving={updateQuiz.isPending}
        error={updateQuiz.isError ? mutationError(updateQuiz.error, "The quiz could not be updated.") : undefined}
        onOpenChange={setEditingQuiz}
        onSave={saveQuiz}
      />
      <DeleteQuestionDialog
        question={deletingQuestion}
        deleting={deleteQuestion.isPending}
        error={deleteQuestion.isError ? mutationError(deleteQuestion.error, "The question could not be deleted.") : undefined}
        onOpenChange={open => !open && setDeletingQuestion(null)}
        onConfirm={confirmDeleteQuestion}
      />
      <DeleteQuizDialog
        quiz={deletingQuiz ? quiz : null}
        deleting={deleteQuiz.isPending}
        error={deleteQuiz.isError ? mutationError(deleteQuiz.error, "The quiz could not be deleted.") : undefined}
        onOpenChange={setDeletingQuiz}
        onConfirm={confirmDeleteQuiz}
      />
    </div>
  )
}
