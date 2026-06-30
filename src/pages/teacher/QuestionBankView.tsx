import { useState } from 'react'
import { Library, Plus, Search, FileQuestion, CheckSquare, AlignLeft, Edit, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const allQuestions = [
  { id: 1, text: 'What is the quadratic formula?', type: 'MCQ', difficulty: 'medium', subject: 'Mathematics', topic: 'Quadratic Equations', usedIn: 3 },
  { id: 2, text: 'The speed of light is approximately 3×10⁸ m/s.', type: 'T/F', difficulty: 'easy', subject: 'Physics', topic: 'Optics', usedIn: 5 },
  { id: 3, text: 'Explain Newton\'s second law of motion in your own words.', type: 'Short Answer', difficulty: 'medium', subject: 'Physics', topic: 'Dynamics', usedIn: 2 },
  { id: 4, text: 'What is the chemical formula for water?', type: 'MCQ', difficulty: 'easy', subject: 'Chemistry', topic: 'Basic Chemistry', usedIn: 7 },
  { id: 5, text: 'Solve the system: 2x + y = 5, x - y = 1', type: 'Short Answer', difficulty: 'hard', subject: 'Mathematics', topic: 'Linear Equations', usedIn: 1 },
  { id: 6, text: 'Mitochondria is the powerhouse of the cell.', type: 'T/F', difficulty: 'easy', subject: 'Biology', topic: 'Cell Biology', usedIn: 6 },
  { id: 7, text: 'Who discovered penicillin?', type: 'MCQ', difficulty: 'easy', subject: 'History', topic: 'Science History', usedIn: 4 },
  { id: 8, text: 'Derive the formula for kinetic energy.', type: 'Short Answer', difficulty: 'hard', subject: 'Physics', topic: 'Energy', usedIn: 0 },
  { id: 9, text: 'What is the Pythagorean theorem?', type: 'MCQ', difficulty: 'easy', subject: 'Mathematics', topic: 'Geometry', usedIn: 9 },
  { id: 10, text: 'All mammals are warm-blooded.', type: 'T/F', difficulty: 'easy', subject: 'Biology', topic: 'Taxonomy', usedIn: 3 },
]

const difficultyVariant = { easy: 'success', medium: 'warning', hard: 'danger' } as const
const typeIcon = { MCQ: FileQuestion, 'T/F': CheckSquare, 'Short Answer': AlignLeft }

const subjects = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History']
const types = ['All', 'MCQ', 'T/F', 'Short Answer']

export function QuestionBankView() {
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')

  const filtered = allQuestions.filter(q => {
    const matchSearch = q.text.toLowerCase().includes(search.toLowerCase()) || q.topic.toLowerCase().includes(search.toLowerCase())
    const matchSubject = subjectFilter === 'All' || q.subject === subjectFilter
    const matchType = typeFilter === 'All' || q.type === typeFilter
    return matchSearch && matchSubject && matchType
  })

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Question Bank"
        description={`${allQuestions.length} questions across all subjects`}
        icon={Library}
        action={{ label: 'Add Question', icon: Plus, onClick: () => {} }}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search questions or topics…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 flex-wrap">
            {subjects.map(s => (
              <button
                key={s}
                onClick={() => setSubjectFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${subjectFilter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-1">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${typeFilter === t ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Library} title="No questions found" description="Try adjusting your search or filters, or add a new question." action={{ label: 'Add Question', onClick: () => {} }} />
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Question</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Subject · Topic</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Difficulty</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground hidden lg:table-cell">Used In</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q, idx) => {
                  const TypeIcon = typeIcon[q.type as keyof typeof typeIcon] ?? FileQuestion
                  return (
                    <tr key={q.id} className={`border-b border-border hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-4 py-3">
                        <p className="text-foreground font-medium max-w-xs truncate">{q.text}</p>
                      </td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <TypeIcon className="h-3.5 w-3.5" />{q.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-xs font-medium text-foreground">{q.subject}</p>
                        <p className="text-[11px] text-muted-foreground">{q.topic}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge variant={difficultyVariant[q.difficulty as keyof typeof difficultyVariant]}>
                          {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-muted-foreground hidden lg:table-cell">
                        {q.usedIn > 0 ? `${q.usedIn} quizzes` : <span className="text-muted-foreground/50">Unused</span>}
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
          <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Showing {filtered.length} of {allQuestions.length} questions</span>
          </div>
        </div>
      )}
    </div>
  )
}
