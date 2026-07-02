import { Plus, Trash2 } from 'lucide-react'
import type { QuestionType, QuestionWithOptions } from '@/models/quiz.interface'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface AddQuestionCardProps {
  index: number
  question: QuestionWithOptions
  canDelete: boolean
  onChange: (question: QuestionWithOptions) => void
  onDelete: () => void
}

export function AddQuestionCard({
  index,
  question,
  canDelete,
  onChange,
  onDelete,
}: AddQuestionCardProps) {
  const updateType = (questionType: QuestionType) => {
    const options = question.options.map((option, optionIndex) => ({
      ...option,
      is_correct: questionType === 'SINGLE_CHOICE'
        ? option.is_correct && !question.options.slice(0, optionIndex).some(item => item.is_correct)
        : option.is_correct,
    }))

    onChange({ ...question, question_type: questionType, options })
  }

  const updateOption = (optionIndex: number, optionText: string) => {
    onChange({
      ...question,
      options: question.options.map((option, index) =>
        index === optionIndex ? { ...option, option_text: optionText } : option,
      ),
    })
  }

  const toggleCorrectOption = (optionIndex: number) => {
    onChange({
      ...question,
      options: question.options.map((option, index) => ({
        ...option,
        is_correct: question.question_type === 'SINGLE_CHOICE'
          ? index === optionIndex
          : index === optionIndex ? !option.is_correct : option.is_correct,
      })),
    })
  }

  const addOption = () => {
    onChange({
      ...question,
      options: [...question.options, { option_text: '', is_correct: false }],
    })
  }

  const removeOption = (optionIndex: number) => {
    onChange({
      ...question,
      options: question.options.filter((_, index) => index !== optionIndex),
    })
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">Question {index + 1}</h3>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          disabled={!canDelete}
          onClick={onDelete}
          aria-label={`Delete question ${index + 1}`}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Question text</label>
          <Textarea
            value={question.question_text}
            onChange={event => onChange({ ...question, question_text: event.target.value })}
            placeholder="Enter the question"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_8rem]">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Question type</label>
            <select
              value={question.question_type}
              onChange={event => updateType(event.target.value as QuestionType)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="SINGLE_CHOICE">Single choice</option>
              <option value="MULTIPLE_CHOICE">Multiple choice</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Score</label>
            <Input
              type="number"
              min={1}
              value={question.score}
              onChange={event => onChange({
                ...question,
                score: Math.max(1, Number(event.target.value) || 1),
              })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div>
            <p className="text-sm font-medium text-foreground">Answer options</p>
            <p className="text-xs text-muted-foreground">
              {question.question_type === 'SINGLE_CHOICE'
                ? 'Select one correct answer.'
                : 'Select every correct answer.'}
            </p>
          </div>

          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center gap-2">
              <input
                type={question.question_type === 'SINGLE_CHOICE' ? 'radio' : 'checkbox'}
                name={`question-${index}-correct-option`}
                checked={option.is_correct}
                onChange={() => toggleCorrectOption(optionIndex)}
                className="h-4 w-4 shrink-0 accent-primary"
                aria-label={`Mark option ${optionIndex + 1} as correct`}
              />
              <Input
                value={option.option_text}
                onChange={event => updateOption(optionIndex, event.target.value)}
                placeholder={`Option ${optionIndex + 1}`}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                disabled={question.options.length <= 2}
                onClick={() => removeOption(optionIndex)}
                aria-label={`Delete option ${optionIndex + 1}`}
                className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button type="button" variant="outline" size="sm" onClick={addOption} className="mt-1 w-fit gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add option
          </Button>
        </div>
      </div>
    </div>
  )
}
