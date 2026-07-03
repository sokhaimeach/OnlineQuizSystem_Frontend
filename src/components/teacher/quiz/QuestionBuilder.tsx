import { useState, type FormEvent } from "react"
import { Plus } from "lucide-react"
import { AddQuestionCard } from "./AddQuestionCard"
import {
  createEmptyQuestion,
  toNewQuestionPayload,
  toUpdateQuestionPayload,
  validateQuestion,
} from "./question-editor"
import { Button } from "@/components/ui/button"
import type {
  AddQuestionsPayload,
  QuestionWithOptions,
  UpdateQuestionPayload,
} from "@/models/quiz.interface"

interface QuestionBuilderProps {
  question?: QuestionWithOptions
  saving: boolean
  error?: string
  onCancel: () => void
  onAdd: (payload: AddQuestionsPayload) => void
  onUpdate: (payload: UpdateQuestionPayload) => void
}

export function QuestionBuilder({
  question,
  saving,
  error,
  onCancel,
  onAdd,
  onUpdate,
}: QuestionBuilderProps) {
  const isEditing = Boolean(question)
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([
    question
      ? { ...question, options: question.options.map(option => ({ ...option })) }
      : createEmptyQuestion(),
  ])
  const [validationError, setValidationError] = useState("")

  const updateQuestion = (index: number, value: QuestionWithOptions) => {
    setQuestions(current => current.map((item, itemIndex) => itemIndex === index ? value : item))
    setValidationError("")
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const nextError = questions
      .map((item, index) => validateQuestion(item, isEditing ? "Question" : `Question ${index + 1}`))
      .find(Boolean) ?? ""
    setValidationError(nextError)
    if (nextError) return

    if (isEditing) {
      onUpdate(toUpdateQuestionPayload(questions[0]))
    } else {
      onAdd({ questions: questions.map(toNewQuestionPayload) })
    }
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-primary/40 bg-card shadow-sm">
      <div className="border-b border-border p-4">
        <h3 className="text-base font-semibold">{isEditing ? "Edit question" : "Add questions"}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {isEditing
            ? "Update the question content, settings, options, and correct answers."
            : "Build one or more questions, then save them to this quiz together."}
        </p>
      </div>

      <div className="grid gap-4 p-4">
        {questions.map((item, index) => (
          <AddQuestionCard
            key={index}
            index={index}
            question={item}
            canDelete={!isEditing && questions.length > 1}
            onChange={value => updateQuestion(index, value)}
            onDelete={() => setQuestions(current => current.filter((_, itemIndex) => itemIndex !== index))}
          />
        ))}

        {!isEditing && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit gap-1.5"
            onClick={() => setQuestions(current => [...current, createEmptyQuestion()])}
          >
            <Plus className="size-4" /> Add another question
          </Button>
        )}

        {(validationError || error) && (
          <p role="alert" className="text-sm text-destructive">{validationError || error}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-border p-4">
        <Button type="button" variant="outline" disabled={saving} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving
            ? "Saving…"
            : isEditing
              ? "Save question"
              : `Add ${questions.length} ${questions.length === 1 ? "question" : "questions"}`}
        </Button>
      </div>
    </form>
  )
}
