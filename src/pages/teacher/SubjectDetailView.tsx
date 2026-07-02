import {
  BookOpen, Library, BarChart3, ArrowLeft, Plus,
  Eye, Edit, Trash2, FileQuestion, CheckSquare, AlignLeft, Loader2,
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { StatusBadge } from '@/components/StatusBadge'
import { PageHeader } from '@/components/PageHeader'
import type { DashboardSection } from '@/components/app-sidebar'
import { useParams } from 'react-router-dom'
import { useGetAllSubjects } from '@/hooks/api/useSubject'
import { useGetQuizzesForSubject } from '@/hooks/api/useQuiz'

const demoQuizzes = [
  { id: 1, title: 'Chapter 1: Algebra Basics', questions: 15, avgScore: 82, status: 'published' as const, attempts: 28 },
  { id: 2, title: 'Chapter 2: Quadratic Equations', questions: 12, avgScore: 76, status: 'published' as const, attempts: 25 },
  { id: 3, title: 'Chapter 3: Geometry', questions: 20, avgScore: 0, status: 'draft' as const, attempts: 0 },
  { id: 4, title: 'Mid-term Review', questions: 30, avgScore: 79, status: 'published' as const, attempts: 28 },
  { id: 5, title: 'Final Exam Practice', questions: 40, avgScore: 0, status: 'draft' as const, attempts: 0 },
  { id: 6, title: 'Chapter 4: Trigonometry', questions: 18, avgScore: 85, status: 'archived' as const, attempts: 30 },
]

const questions = [
  { id: 1, text: 'What is the quadratic formula?', type: 'MCQ', difficulty: 'medium', topic: 'Quadratic Equations' },
  { id: 2, text: 'The sum of angles in a triangle is 180°.', type: 'T/F', difficulty: 'easy', topic: 'Geometry' },
  { id: 3, text: 'Solve: 2x² + 5x - 3 = 0', type: 'Short Answer', difficulty: 'hard', topic: 'Quadratic Equations' },
  { id: 4, text: 'What is sin(90°)?', type: 'MCQ', difficulty: 'easy', topic: 'Trigonometry' },
  { id: 5, text: 'Explain the Pythagorean theorem.', type: 'Short Answer', difficulty: 'medium', topic: 'Geometry' },
  { id: 6, text: 'A prime number has exactly two factors.', type: 'T/F', difficulty: 'easy', topic: 'Number Theory' },
]

const difficultyVariant = { easy: 'success', medium: 'warning', hard: 'danger' } as const
const typeIcon = { MCQ: FileQuestion, 'T/F': CheckSquare, 'Short Answer': AlignLeft }

const topicPerformance = [
  { topic: 'Algebra', avg: 82, students: 28 },
  { topic: 'Geometry', avg: 74, students: 25 },
  { topic: 'Trigonometry', avg: 85, students: 30 },
  { topic: 'Calculus', avg: 68, students: 20 },
]

interface SubjectDetailViewProps {
  onNavigate: (section: DashboardSection) => void
}

export function SubjectDetailView({ onNavigate }: SubjectDetailViewProps) {
  const { subjectId } = useParams()
  const subjectsQuery = useGetAllSubjects()
  const quizzesQuery = useGetQuizzesForSubject(subjectId)
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
  const subjectQuizzes = (quizzesQuery.data?.pages.flatMap(page => page.data) ?? [])
    .filter(quiz => !isUnassigned || quiz.subject_id === null)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button variant="ghost" size="sm" onClick={() => onNavigate('subjects')} className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2 mb-4">
          <ArrowLeft className="h-4 w-4" /> All Subjects
        </Button>
        <PageHeader
          title={subjectTitle}
          description={subjectDescription}
          icon={BookOpen}
          action={{ label: 'New Quiz', icon: Plus, onClick: () => onNavigate('create-quiz') }}
        />
      </div>

      <Tabs defaultValue="quizzes">
        <TabsList className="bg-muted/50 h-9">
          <TabsTrigger value="quizzes" className="gap-1.5 text-xs">
            <BookOpen className="h-3.5 w-3.5" /> Quizzes
          </TabsTrigger>
          <TabsTrigger value="question-bank" className="gap-1.5 text-xs">
            <Library className="h-3.5 w-3.5" /> Question Bank
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-1.5 text-xs">
            <BarChart3 className="h-3.5 w-3.5" /> Analytics
          </TabsTrigger>
        </TabsList>

        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="mt-4">
          <div className="border-y border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Quiz Title</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Questions</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Assignments</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Total Points</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzesQuery.isLoading && Array.from({ length: 3 }).map((_, index) => (
                    <tr key={index} className="border-b border-border">
                      <td colSpan={6} className="px-4 py-4 text-center text-xs text-muted-foreground">
                        Loading quizzes…
                      </td>
                    </tr>
                  ))}
                  {quizzesQuery.isError && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-sm text-destructive">
                        The quizzes could not be loaded.
                      </td>
                    </tr>
                  )}
                  {!quizzesQuery.isLoading && !quizzesQuery.isError && subjectQuizzes.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No quizzes found for this subject.
                      </td>
                    </tr>
                  )}
                  {subjectQuizzes.map((q, idx) => (
                    <tr key={q.id} className={`border-b border-border hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-4 py-3 font-medium text-foreground">{q.title}</td>
                      <td className="px-4 py-3 text-center text-muted-foreground hidden sm:table-cell">{q.question_count}</td>
                      <td className="px-4 py-3 text-center text-muted-foreground hidden sm:table-cell">{q.assignment_count ?? '—'}</td>
                      <td className="px-4 py-3 text-center text-muted-foreground hidden md:table-cell">{q.total_score}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge variant={q.is_public ? 'success' : 'muted'} dot>
                          {q.is_public ? 'Published' : 'Draft'}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {quizzesQuery.hasNextPage && (
              <div className="flex justify-center border-t border-border p-3">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={quizzesQuery.isFetchingNextPage}
                  onClick={() => void quizzesQuery.fetchNextPage()}
                >
                  {quizzesQuery.isFetchingNextPage && <Loader2 className="animate-spin" />}
                  {quizzesQuery.isFetchingNextPage ? 'Loading…' : 'View More'}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Question Bank Tab */}
        <TabsContent value="question-bank" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">{questions.length} questions in bank</p>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Question</Button>
          </div>
          <div className="border-y border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Question</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Topic</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Difficulty</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q, idx) => {
                    const TypeIcon = typeIcon[q.type as keyof typeof typeIcon] ?? FileQuestion
                    return (
                      <tr key={q.id} className={`border-b border-border hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? '' : 'bg-muted/10'}`}>
                        <td className="px-4 py-3 text-foreground max-w-xs truncate">{q.text}</td>
                        <td className="px-4 py-3 text-center hidden sm:table-cell">
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <TypeIcon className="h-3.5 w-3.5" />{q.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">{q.topic}</td>
                        <td className="px-4 py-3 text-center">
                          <StatusBadge variant={difficultyVariant[q.difficulty as keyof typeof difficultyVariant]}>
                            {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                          </StatusBadge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card rounded-md border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Performance by Topic</h3>
              <div className="flex flex-col gap-4">
                {topicPerformance.map(t => (
                  <div key={t.topic}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-medium text-foreground">{t.topic}</span>
                      <span className="text-xs text-muted-foreground">{t.avg}% avg · {t.students} students</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${t.avg >= 80 ? 'bg-emerald-500' : t.avg >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${t.avg}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-md border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Quiz Performance Overview</h3>
              <div className="flex flex-col gap-3">
                {demoQuizzes.filter(q => q.avgScore > 0).map(q => (
                  <div key={q.id} className="flex items-center gap-3">
                    <span className="text-xs text-foreground flex-1 min-w-0 truncate">{q.title}</span>
                    <Progress value={q.avgScore} className="w-20 h-1.5 shrink-0" />
                    <span className="text-xs font-medium text-foreground w-10 text-right shrink-0">{q.avgScore}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
