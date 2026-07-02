import { PageHeader } from '@/components/PageHeader'
import {
  AssignmentTable,
  type AssignmentListItem,
  type AssignmentListStatus,
} from '@/components/teacher/assignment/assignmentTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ClipboardList } from 'lucide-react'

const assignments: AssignmentListItem[] = [
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

const statusTabs: { value: AssignmentListStatus; label: string; badgeClass: string }[] = [
  { value: 'active', label: 'Active', badgeClass: 'bg-amber-100 text-amber-700 dark:bg-zinc-800 dark:text-amber-400' },
  { value: 'scheduled', label: 'Scheduled', badgeClass: 'bg-indigo-100 text-indigo-700 dark:bg-zinc-800 dark:text-indigo-400' },
  { value: 'completed', label: 'Completed', badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-zinc-800 dark:text-emerald-400' },
]

export function AssignmentsView() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Assignments" description="Manage and track all your assignments" icon={ClipboardList} action={{ label: 'New Assignment', icon: ClipboardList, onClick: () => {} }} />
      <Tabs defaultValue="active">
        <TabsList className="h-9 bg-muted/50">
          {statusTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 text-xs">
              {tab.label}
              <span className={`ml-1 flex h-5 min-w-5 items-center justify-center rounded-sm px-1.5 text-[10px] font-bold ${tab.badgeClass}`}>
                {assignments.filter((assignment) => assignment.status === tab.value).length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {statusTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4">
            <AssignmentTable items={assignments.filter((assignment) => assignment.status === tab.value)} showScore={tab.value === 'completed'} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
