
import {
  School, Users, ClipboardList, BarChart3, ArrowLeft,
  Mail, Calendar, TrendingUp, Award, Clock,
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/StatusBadge'
import { PageHeader } from '@/components/PageHeader'
import type { DashboardSection } from '@/components/app-sidebar'

const students = [
  { id: 1, name: 'Alex Johnson', email: 'alex@school.edu', submissionRate: 95, avgScore: 88, lastActive: '2 hrs ago', initials: 'AJ', status: 'success' as const },
  { id: 2, name: 'Maria Garcia', email: 'maria@school.edu', submissionRate: 82, avgScore: 91, lastActive: '1 day ago', initials: 'MG', status: 'success' as const },
  { id: 3, name: 'James Wilson', email: 'james@school.edu', submissionRate: 60, avgScore: 72, lastActive: '3 days ago', initials: 'JW', status: 'warning' as const },
  { id: 4, name: 'Sarah Chen', email: 'sarah@school.edu', submissionRate: 100, avgScore: 96, lastActive: '5 hrs ago', initials: 'SC', status: 'success' as const },
  { id: 5, name: 'David Kim', email: 'david@school.edu', submissionRate: 45, avgScore: 65, lastActive: '1 week ago', initials: 'DK', status: 'danger' as const },
  { id: 6, name: 'Emily Brown', email: 'emily@school.edu', submissionRate: 78, avgScore: 81, lastActive: 'Yesterday', initials: 'EB', status: 'success' as const },
]

const classAssignments = [
  { id: 1, title: 'Chapter 5 Quiz', quiz: 'Science Fundamentals', dueDate: 'Tomorrow', submissions: '18/32', status: 'warning' as const },
  { id: 2, title: 'Mid-term Assessment', quiz: 'Science Advanced', dueDate: 'In 5 days', submissions: '5/32', status: 'info' as const },
  { id: 3, title: 'Chapter 4 Review', quiz: 'Science Fundamentals', dueDate: 'Overdue', submissions: '30/32', status: 'danger' as const },
  { id: 4, title: 'Lab Safety Quiz', quiz: 'Lab Procedures', dueDate: 'Completed', submissions: '32/32', status: 'success' as const },
]

const scoreDistribution = [
  { range: '90–100', count: 8, pct: 25 },
  { range: '80–89', count: 12, pct: 37.5 },
  { range: '70–79', count: 7, pct: 21.9 },
  { range: '60–69', count: 4, pct: 12.5 },
  { range: '< 60', count: 1, pct: 3.1 },
]

interface ClassDetailViewProps {
  onNavigate: (section: DashboardSection) => void
}

export function ClassDetailView({ onNavigate }: ClassDetailViewProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Back nav */}
      <div>
        <Button variant="ghost" size="sm" onClick={() => onNavigate('classes')} className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2 mb-4">
          <ArrowLeft className="h-4 w-4" /> All Classes
        </Button>
        <PageHeader
          title="Class 10-A · Science"
          description="32 students · Last active 2 hours ago"
          icon={School}
          action={{ label: 'New Assignment', icon: ClipboardList, onClick: () => {} }}
          secondaryAction={{ label: 'Class Settings', onClick: () => {} }}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="students">
        <TabsList className="bg-muted/50 h-9">
          <TabsTrigger value="students" className="gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5" /> Students
          </TabsTrigger>
          <TabsTrigger value="assignments" className="gap-1.5 text-xs">
            <ClipboardList className="h-3.5 w-3.5" /> Assignments
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-1.5 text-xs">
            <BarChart3 className="h-3.5 w-3.5" /> Analytics
          </TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="mt-4">
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Student</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Email</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Submission</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Avg Score</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Last Active</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, idx) => (
                    <tr key={s.id} className={`border-b border-border hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">{s.initials}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{s.email}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-medium text-foreground">{s.submissionRate}%</span>
                          <Progress value={s.submissionRate} className="h-1 w-16" />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-semibold ${s.avgScore >= 85 ? 'text-emerald-600 dark:text-emerald-400' : s.avgScore >= 70 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                          {s.avgScore}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{s.lastActive}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge variant={s.status} dot>
                          {s.status === 'success' ? 'On Track' : s.status === 'warning' ? 'At Risk' : 'Behind'}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="mt-4">
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Assignment</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Quiz</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Due Date</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Submissions</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {classAssignments.map((a, idx) => (
                    <tr key={a.id} className={`border-b border-border hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-4 py-3 font-medium text-foreground">{a.title}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{a.quiz}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="flex items-center justify-center gap-1 text-muted-foreground text-xs">
                          <Calendar className="h-3 w-3" />{a.dueDate}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-foreground font-medium">{a.submissions}</span>
                          <Progress
                            value={parseInt(a.submissions.split('/')[0]) / parseInt(a.submissions.split('/')[1]) * 100}
                            className="h-1 w-16"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge variant={a.status} dot>
                          {a.status === 'success' ? 'Completed' : a.status === 'warning' ? 'Due Soon' : a.status === 'danger' ? 'Overdue' : 'Upcoming'}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Score Distribution */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Score Distribution</h3>
              <div className="flex flex-col gap-3">
                {scoreDistribution.map(d => (
                  <div key={d.range} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-16 shrink-0">{d.range}</span>
                    <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                      <div
                        className="h-full bg-primary/80 rounded flex items-center justify-end pr-2 transition-all"
                        style={{ width: `${d.pct}%` }}
                      >
                        <span className="text-[10px] text-white font-medium">{d.count}</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right">{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Completion Rate */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Completion Rates</h3>
              <div className="flex flex-col gap-4">
                {classAssignments.map(a => (
                  <div key={a.id}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-foreground font-medium truncate flex-1 mr-2">{a.title}</span>
                      <span className="text-xs text-muted-foreground shrink-0">{a.submissions}</span>
                    </div>
                    <Progress
                      value={parseInt(a.submissions.split('/')[0]) / parseInt(a.submissions.split('/')[1]) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Class Average', value: '84.2%', icon: Award, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950' },
                { label: 'Completion Rate', value: '78%', icon: TrendingUp, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950' },
                { label: 'Top Scorer', value: '96 pts', icon: Award, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950' },
                { label: 'At-Risk Students', value: '2', icon: Users, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950' },
              ].map(stat => (
                <div key={stat.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
