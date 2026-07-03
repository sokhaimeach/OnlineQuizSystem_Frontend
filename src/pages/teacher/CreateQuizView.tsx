import { useState } from 'react'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileQuestion,
  Globe2,
  LockKeyhole,
  PlusCircle,
} from 'lucide-react'
import type { DashboardSection } from '@/components/app-sidebar'
import { SearchableSelectInput } from '@/components/SearchableSelectInput'
import { AddQuestionCard } from '@/components/teacher/quiz/AddQuestionCard'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useCreateQuiz } from '@/hooks/api/useQuiz'
import type { CreateQuiz, QuestionWithOptions } from '@/models/quiz.interface'
import type { Subject } from '@/models/subject.interface'
// import { getSubjects } from '@/services/teacher/subject.service'
import { useGetSubjectOptions } from '@/hooks/api/useSubject'

const steps = ['Details', 'Settings', 'Questions', 'Review']

const emptyQuestion = (): QuestionWithOptions => ({
  question_text: '',
  question_type: 'SINGLE_CHOICE',
  score: 1,
  options: Array.from({ length: 4 }, () => ({
    option_text: '',
    is_correct: false,
  })),
})

const initialQuiz: CreateQuiz = {
  subject_id: "",
  title: '',
  description: '',
  duration_minutes: 5,
  is_public: false,
  passing_score: 70,
  show_result_immediately: true,
  show_correct_answers: true,
  randomize_questions: true,
  questions: [emptyQuestion()],
}

interface CreateQuizViewProps {
  onNavigate: (section: DashboardSection) => void
}

export function CreateQuizView({ onNavigate }: CreateQuizViewProps) {

  const {data: subjects = [], isLoading} = useGetSubjectOptions()
  const createQuizMutation = useCreateQuiz()

  const [step, setStep] = useState(0)
  const [quiz, setQuiz] = useState<CreateQuiz>(initialQuiz)
  const [error, setError] = useState('')

  const stepProgress = ((step + 1) / steps.length) * 100
  const totalPoints = quiz.questions.reduce((total, question) => total + question.score, 0)
  const selectedSubject = subjects.find((subject: any) => subject.id === quiz.subject_id)

  const updateQuiz = <Key extends keyof CreateQuiz>(key: Key, value: CreateQuiz[Key]) => {
    setQuiz(current => ({ ...current, [key]: value }))
    setError('')
  }

  const updateQuestion = (index: number, question: QuestionWithOptions) => {
    updateQuiz(
      'questions',
      quiz.questions.map((item, questionIndex) => questionIndex === index ? question : item),
    )
  }

  const validateStep = (stepIndex: number) => {
    if (stepIndex === 0) {
      if (!quiz.title.trim()) return 'Quiz title is required.'
    }

    if (stepIndex === 1) {
      if (quiz.duration_minutes < 1) return 'Duration must be at least 1 minute.'
      if (quiz.passing_score < 0 || quiz.passing_score > 100) {
        return 'Passing score must be between 0 and 100.'
      }
    }

    if (stepIndex === 2) {
      for (let index = 0; index < quiz.questions.length; index += 1) {
        const question = quiz.questions[index]
        const label = `Question ${index + 1}`

        if (!question.question_text.trim()) return `${label} needs question text.`
        if (question.score < 1) return `${label} must be worth at least 1 point.`
        if (question.options.length < 2) return `${label} needs at least two options.`
        if (question.options.some(option => !option.option_text.trim())) {
          return `${label} has an empty option.`
        }

        const correctAnswers = question.options.filter(option => option.is_correct).length
        if (correctAnswers === 0) return `${label} needs a correct answer.`
        if (question.question_type === 'SINGLE_CHOICE' && correctAnswers !== 1) {
          return `${label} must have exactly one correct answer.`
        }
      }
    }

    return ''
  }

  const goNext = () => {
    const validationError = validateStep(step)
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setStep(current => Math.min(steps.length - 1, current + 1))
  }

  const publishQuiz = async () => {
    const validationError = [0, 1, 2]
      .map(validateStep)
      .find(message => message)

    if (validationError) {
      setError(validationError)
      return
    }

    setError('')

    try {
      await createQuizMutation.mutateAsync(quiz)
      onNavigate('dashboard')
    } catch {
      setError('The quiz could not be published. Please check your connection and try again.')
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageHeader
        title="Create Quiz"
        description="Build a new quiz for your students"
        icon={PlusCircle}
      />

      <div className="rounded-md border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          {steps.map((label, index) => (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    if (index <= step) {
                      setStep(index)
                      setError('')
                    }
                  }}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all',
                    index < step
                      ? 'cursor-pointer bg-primary text-primary-foreground'
                      : index === step
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                        : 'cursor-default bg-muted text-muted-foreground',
                  )}
                >
                  {index < step ? <Check className="h-4 w-4" /> : index + 1}
                </button>
                <span className={cn(
                  'hidden text-[11px] font-medium sm:block',
                  index === step
                    ? 'text-primary'
                    : index < step ? 'text-foreground' : 'text-muted-foreground',
                )}>
                  {label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  'mx-2 mt-[-12px] h-px flex-1 sm:mt-[-24px]',
                  index < step ? 'bg-primary' : 'bg-border',
                )} />
              )}
            </div>
          ))}
        </div>
        <Progress value={stepProgress} className="h-1" />
      </div>

      <div className="rounded-md border border-border bg-card p-6">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-foreground">Quiz Details</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Subject</label>
              <SearchableSelectInput
                options={subjects
                  .filter((subject): subject is Subject & { id: string } => Boolean(subject.id))
                  .map(subject => ({
                    value: subject.id,
                    label: subject.subject_name
                  }))}
                value={quiz.subject_id}
                onValueChange={value => updateQuiz('subject_id', value)}
                disabled={isLoading}
                placeholder={isLoading ? 'Loading subjects…' : 'Write to search subjects'}
                emptyMessage="No similar subjects found."
              />
              <p className="text-xs text-muted-foreground">
                Optional. Search by name; the selected subject ID is stored in the payload.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Quiz Title <span className="text-destructive">*</span>
              </label>
              <Input
                value={quiz.title}
                onChange={event => updateQuiz('title', event.target.value)}
                placeholder="e.g. Introduction to Operations"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                rows={3}
                value={quiz.description}
                onChange={event => updateQuiz('description', event.target.value)}
                placeholder="What will students be tested on?"
                className="resize-none"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-foreground">Quiz Settings</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Time Limit (minutes)
                </label>
                <Input
                  type="number"
                  min={1}
                  value={quiz.duration_minutes}
                  onChange={event => updateQuiz(
                    'duration_minutes',
                    Math.max(1, Number(event.target.value) || 1),
                  )}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Passing Score (%)</label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={quiz.passing_score}
                  onChange={event => updateQuiz('passing_score', Number(event.target.value) || 0)}
                />
              </div>
            </div>

            {([
              ['show_result_immediately', 'Show results immediately', 'Show the score as soon as a student submits.'],
              ['show_correct_answers', 'Show correct answers', 'Reveal correct answers with the result.'],
              ['randomize_questions', 'Randomize questions', 'Use a different question order for each attempt.'],
            ] as const).map(([key, label, description]) => (
              <label
                key={key}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/30"
              >
                <input
                  type="checkbox"
                  checked={quiz[key]}
                  onChange={event => updateQuiz(key, event.target.checked)}
                  className="mt-0.5 accent-primary"
                />
                <span>
                  <span className="block text-sm font-medium text-foreground">{label}</span>
                  <span className="block text-xs text-muted-foreground">{description}</span>
                </span>
              </label>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Questions ({quiz.questions.length})
                </h2>
                <p className="text-xs text-muted-foreground">
                  Add single-choice or multiple-choice questions.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => updateQuiz('questions', [...quiz.questions, emptyQuestion()])}
                className="gap-1.5"
              >
                <PlusCircle className="h-4 w-4" />
                Add question
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              {quiz.questions.map((question, index) => (
                <AddQuestionCard
                  key={index}
                  index={index}
                  question={question}
                  canDelete={quiz.questions.length > 1}
                  onChange={value => updateQuestion(index, value)}
                  onDelete={() => updateQuiz(
                    'questions',
                    quiz.questions.filter((_, questionIndex) => questionIndex !== index),
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-foreground">Review & Publish</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { label: 'Title', value: quiz.title },
                { label: 'Subject', value: selectedSubject?.subject_name ?? 'No subject' },
                { label: 'Time Limit', value: `${quiz.duration_minutes} minutes` },
                { label: 'Passing Score', value: `${quiz.passing_score}%` },
                { label: 'Questions', value: `${quiz.questions.length} questions` },
                { label: 'Total Points', value: `${totalPoints} points` },
              ].map(item => (
                <div key={item.label} className="flex flex-col gap-0.5 rounded-lg bg-muted/30 p-3">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className="truncate text-sm font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <div>
                <p className="text-sm font-medium text-foreground">Quiz visibility</p>
                <p className="text-xs text-muted-foreground">
                  This choice is submitted as the boolean <code>is_public</code> value.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => updateQuiz('is_public', false)}
                  className={cn(
                    'flex items-start gap-3 rounded-lg border p-3 text-left transition-colors',
                    !quiz.is_public
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:bg-muted/30',
                  )}
                >
                  <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <span className="block text-sm font-medium">Draft</span>
                    <span className="block text-xs text-muted-foreground">
                      Keep the quiz private.
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => updateQuiz('is_public', true)}
                  className={cn(
                    'flex items-start gap-3 rounded-lg border p-3 text-left transition-colors',
                    quiz.is_public
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:bg-muted/30',
                  )}
                >
                  <Globe2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <span className="block text-sm font-medium">Public</span>
                    <span className="block text-xs text-muted-foreground">
                      Publish for students to access.
                    </span>
                  </span>
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-border p-3">
              <div className="mb-2 flex items-center gap-2">
                <FileQuestion className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Questions</span>
              </div>
              <ol className="flex list-decimal flex-col gap-1 pl-5 text-sm text-muted-foreground">
                {quiz.questions.map((question, index) => (
                  <li key={index}>{question.question_text}</li>
                ))}
              </ol>
            </div>

            <Button onClick={publishQuiz} disabled={createQuizMutation.isPending} className="w-full">
              {createQuizMutation.isPending
                ? 'Saving…'
                : quiz.is_public ? 'Publish Quiz' : 'Save as Draft'}
            </Button>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setStep(current => Math.max(0, current - 1))
            setError('')
          }}
          disabled={step === 0}
          className="gap-1.5"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        {step < steps.length - 1 && (
          <Button type="button" onClick={goNext} className="gap-1.5">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
