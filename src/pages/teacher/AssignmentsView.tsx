import { useState } from 'react'
import { ClipboardList, Calendar, School, BookOpen, Users, Search, Filter } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { StatusBadge } from '@/components/StatusBadge'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'

type AssignmentStatus = 'active' | 'scheduled' | 'completed'

interface Assignment {
  id: number
  title: string
  class: string
  quiz: string
  dueDate: string
  submissions: string
  submissionPct: number
  status: AssignmentStatus
  avgScore?: number
}

const assignments: Assignment[] = [
  { id: 1, title: 'Chapter 5 Quiz', class: 'Class 10-A', quiz: 'Science Fundamentals', dueDate: 'Jul 1, 2026', submissions: '18/32', submissionPct: 56, status: 'active' },
  { id: 2, title: 'Mid-term Assessment', class: 'Class 9-B', quiz: 'Algebra Advanced', dueDate: 'Jul 3, 2026', submissions: '5/28', submissionPct: 18, status: 'active' },
  { id: 3, title: 'Lab Safety Quiz', class: 'Class 11-C', quiz: 'Lab Procedures', dueDate: 'Jul 5, 2026', submissions: '10/25', submissionPct: 40, status: 'active' },
  { id: 4, title: 'History Chapter 4', class: 'Class 8-A', quiz: 'WWI & WWII', dueDate: 'Jul 8, 2026', submissions: '0/30', submissionPct: 0, status: 'scheduled' },
  { id: 5, title: 'Chemistry Reactions', class: 'Class 12-B', quiz: 'Organic Chemistry', dueDate: 'Jul 10, 2026', submissions: '0/22', submissionPct: 0, status: 'scheduled' },
  { id: 6, title: 'Biology Cell Quiz', class: 'Class 7-C', quiz: 'Cell Biology', dueDate: 'Jul 15, 2026', submissions: '0/35', submissionPct: 0, status: 'scheduled' },
  { id: 7, title: 'Chapter 4 Review', class: 'Class 10-A', quiz: 'Science Fundamentals', dueDate: 'Jun 25, 2026', submissions: '30/32', submissionPct: 94, status: 'completed', avgScore: 84 },
  { id: 8, title: 'Algebra Quiz 3', class: 'Class 9-B', quiz: 'Algebra Basics', dueDate: 'Jun 20, 2026', submissions: '28/28', submissionPct: 100, status: 'completed', avgScore: 79 },
  { id: 9, title: 'Physics Motion Quiz', class: 'Class 11-C', quiz: 'Kinematics', dueDate: 'Jun 18, 2026', submissions: '24/25', submissionPct: 96, status: 'completed', avgScore: 88 },
]

function AssignmentTable({ items, showScore }: { items: Assignment[]; showScore?: boolean }) {
  const [search, setSearch] = useState('')
  const filtered = items.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.class.toLowerCase().includes(search.toLowerCase()),
  )

  if (items.length === 0) {
    return <EmptyState icon={ClipboardList} title="No assignments here" description="Assignments in this category will appear here." />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search assignments…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Assignment</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Class</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Quiz</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Due Date</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Submissions</th>
                {showScore && <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground hidden lg:table-cell">Avg Score</th>}
                <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, idx) => (
                <tr key={a.id} className={`border-b border-border hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? '' : 'bg-muted/10'}`}>
                  <td className="px-4 py-3 font-medium text-foreground">{a.title}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="flex items-center gap-1 text-muted-foreground text-xs">
                      <School className="h-3 w-3" />{a.class}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="flex items-center gap-1 text-muted-foreground text-xs">
                      <BookOpen className="h-3 w-3" />{a.quiz}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />{a.dueDate}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="flex items-center gap-1 text-xs text-foreground font-medium">
                        <Users className="h-3 w-3 text-muted-foreground" />{a.submissions}
                      </span>
                      <Progress value={a.submissionPct} className="h-1 w-16" />
                    </div>
                  </td>
                  {showScore && (
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      {a.avgScore ? (
                        <span className={`font-semibold ${a.avgScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' : a.avgScore >= 70 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                          {a.avgScore}%
                        </span>
                      ) : <span className="text-muted-foreground">—</span>}
                    </td>
                  )}
                  <td className="px-4 py-3 text-center">
                    <StatusBadge
                      variant={a.status === 'active' ? 'warning' : a.status === 'scheduled' ? 'info' : 'success'}
                      dot
                    >
                      {a.status === 'active' ? 'Active' : a.status === 'scheduled' ? 'Scheduled' : 'Completed'}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function AssignmentsView() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Assignments"
        description="Manage and track all your assignments"
        icon={ClipboardList}
        action={{ label: 'New Assignment', icon: ClipboardList, onClick: () => {} }}
      />

      <Tabs defaultValue="active">
        <TabsList className="bg-muted/50 h-9">
          <TabsTrigger value="active" className="gap-1.5 text-xs">
            Active
            <span className="ml-1 h-5 min-w-5 px-1.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 text-[10px] font-bold flex items-center justify-center">
              {assignments.filter(a => a.status === 'active').length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="gap-1.5 text-xs">
            Scheduled
            <span className="ml-1 h-5 min-w-5 px-1.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 text-[10px] font-bold flex items-center justify-center">
              {assignments.filter(a => a.status === 'scheduled').length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-1.5 text-xs">
            Completed
            <span className="ml-1 h-5 min-w-5 px-1.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-[10px] font-bold flex items-center justify-center">
              {assignments.filter(a => a.status === 'completed').length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          <AssignmentTable items={assignments.filter(a => a.status === 'active')} />
        </TabsContent>
        <TabsContent value="scheduled" className="mt-4">
          <AssignmentTable items={assignments.filter(a => a.status === 'scheduled')} />
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <AssignmentTable items={assignments.filter(a => a.status === 'completed')} showScore />
        </TabsContent>
      </Tabs>
    </div>
  )
}
