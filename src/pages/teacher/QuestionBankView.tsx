import { useMemo, useState } from 'react'
import { AlignLeft, CheckSquare, Edit, FileQuestion, Library, Plus, Search, Trash2 } from 'lucide-react'

import { DataTable, type ColumnDef } from '@/components/data-table'
import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Question {
  id: number
  text: string
  type: string
  difficulty: 'easy' | 'medium' | 'hard'
  subject: string
  topic: string
  usedIn: number
}

const allQuestions: Question[] = [
  { id: 1, text: 'What is the quadratic formula?', type: 'MCQ', difficulty: 'medium', subject: 'Mathematics', topic: 'Quadratic Equations', usedIn: 3 },
  { id: 2, text: 'The speed of light is approximately 3×10⁸ m/s.', type: 'T/F', difficulty: 'easy', subject: 'Physics', topic: 'Optics', usedIn: 5 },
  { id: 3, text: "Explain Newton's second law of motion in your own words.", type: 'Short Answer', difficulty: 'medium', subject: 'Physics', topic: 'Dynamics', usedIn: 2 },
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

const columns: ColumnDef<Question>[] = [
  {
    accessorKey: 'text',
    header: 'Question',
    cell: ({ row }) => <p className="max-w-xs truncate font-medium">{row.original.text}</p>,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const TypeIcon = typeIcon[row.original.type as keyof typeof typeIcon] ?? FileQuestion
      return <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><TypeIcon className="size-3.5" />{row.original.type}</span>
    },
  },
  {
    accessorKey: 'subject',
    header: 'Subject · topic',
    cell: ({ row }) => <div><p className="text-xs font-medium">{row.original.subject}</p><p className="text-[11px] text-muted-foreground">{row.original.topic}</p></div>,
  },
  {
    accessorKey: 'difficulty',
    header: 'Difficulty',
    cell: ({ row }) => <StatusBadge variant={difficultyVariant[row.original.difficulty]}>{row.original.difficulty[0].toUpperCase() + row.original.difficulty.slice(1)}</StatusBadge>,
  },
  {
    accessorKey: 'usedIn',
    header: 'Used in',
    cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.usedIn ? `${row.original.usedIn} quizzes` : 'Unused'}</span>,
  },
  {
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    cell: () => (
      <div className="flex gap-1">
        <Button size="icon-sm" variant="ghost" aria-label="Edit question"><Edit /></Button>
        <Button size="icon-sm" variant="ghost" className="text-destructive hover:text-destructive" aria-label="Delete question"><Trash2 /></Button>
      </div>
    ),
  },
]

export function QuestionBankView() {
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const filtered = useMemo(() => allQuestions.filter((question) => {
    const query = search.toLowerCase()
    return (question.text.toLowerCase().includes(query) || question.topic.toLowerCase().includes(query))
      && (subjectFilter === 'All' || question.subject === subjectFilter)
      && (typeFilter === 'All' || question.type === typeFilter)
  }), [search, subjectFilter, typeFilter])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Question Bank" description={`${allQuestions.length} questions across all subjects`} icon={Library} action={{ label: 'Add Question', icon: Plus, onClick: () => {} }} />
      <div className="flex flex-col gap-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search questions or topics…" value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1">
          {subjects.map((subject) => <Button key={subject} size="sm" variant={subjectFilter === subject ? 'default' : 'secondary'} onClick={() => setSubjectFilter(subject)}>{subject}</Button>)}
        </div>
        <div className="flex flex-wrap gap-1">
          {types.map((type) => <Button key={type} size="sm" variant={typeFilter === type ? 'outline' : 'ghost'} className={typeFilter === type ? 'border-primary text-primary' : ''} onClick={() => setTypeFilter(type)}>{type}</Button>)}
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        enableRowSelection
        getRowId={(row) => String(row.id)}
        emptyState="No questions match the current filters."
      />
    </div>
  )
}
