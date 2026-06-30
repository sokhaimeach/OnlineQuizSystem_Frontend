import {
  School, Users, ClipboardList, BookOpen, TrendingUp, Award,
  Clock, AlertCircle, CheckCircle2, ArrowRight, Activity,
} from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/StatusBadge'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import type { DashboardSection } from '@/components/app-sidebar'

const recentClasses = [
  { id: 1, name: 'Class 10-A', subject: 'Science', students: 32, assignments: 3, color: 'bg-indigo-500', initials: '10A' },
  { id: 2, name: 'Class 9-B', subject: 'Mathematics', students: 28, assignments: 2, color: 'bg-emerald-500', initials: '9B' },
  { id: 3, name: 'Class 11-C', subject: 'Physics', students: 25, assignments: 5, color: 'bg-violet-500', initials: '11C' },
  { id: 4, name: 'Class 8-A', subject: 'History', students: 30, assignments: 1, color: 'bg-amber-500', initials: '8A' },
]

const recentActivity = [
  { id: 1, event: 'Alex Johnson submitted "Chapter 5 Quiz"', time: '2 min ago', type: 'submission', icon: CheckCircle2, color: 'text-emerald-500' },
  { id: 2, event: '"Algebra Quiz" published to Class 9-B', time: '1 hr ago', type: 'publish', icon: BookOpen, color: 'text-indigo-500' },
  { id: 3, event: 'Assignment "Physics Motion" is overdue', time: '3 hrs ago', type: 'overdue', icon: AlertCircle, color: 'text-red-500' },
  { id: 4, event: '5 new students joined Class 11-C', time: 'Yesterday', type: 'students', icon: Users, color: 'text-blue-500' },
  { id: 5, event: 'Quiz "History: WWI" graded automatically', time: 'Yesterday', type: 'grade', icon: Award, color: 'text-amber-500' },
]

const upcomingDeadlines = [
  { id: 1, title: 'Algebra Final Exam', class: 'Class 9-B', dueDate: 'Tomorrow', status: 'warning' as const, submissions: '18/28' },
  { id: 2, title: 'Chapter 6 Quiz', class: 'Class 10-A', dueDate: 'In 2 days', status: 'warning' as const, submissions: '5/32' },
  { id: 3, title: 'Physics Lab Report', class: 'Class 11-C', dueDate: 'In 5 days', status: 'info' as const, submissions: '0/25' },
  { id: 4, title: 'History Essay Quiz', class: 'Class 8-A', dueDate: 'Overdue', status: 'danger' as const, submissions: '22/30' },
]

interface DashboardOverviewProps {
  onNavigate: (section: DashboardSection) => void
}

export function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Good morning, Jane! Here's what's happening today."
        icon={Activity}
        action={{ label: 'Create Quiz', icon: BookOpen, onClick: () => onNavigate('create-quiz') }}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total Classes" value="12" icon={School} trend={8} trendLabel="vs last month" colorClass="text-indigo-600 dark:text-indigo-400" bgClass="bg-indigo-50 dark:bg-indigo-950" />
        <StatCard label="Total Students" value="347" icon={Users} trend={12} trendLabel="vs last month" colorClass="text-blue-600 dark:text-blue-400" bgClass="bg-blue-50 dark:bg-blue-950" />
        <StatCard label="Active Assignments" value="8" icon={ClipboardList} trend={-2} trendLabel="vs last week" colorClass="text-amber-600 dark:text-amber-400" bgClass="bg-amber-50 dark:bg-amber-950" />
        <StatCard label="Published Quizzes" value="24" icon={BookOpen} trend={4} trendLabel="vs last month" colorClass="text-emerald-600 dark:text-emerald-400" bgClass="bg-emerald-50 dark:bg-emerald-950" />
        <StatCard label="Submission Rate" value="78%" icon={TrendingUp} trend={3} trendLabel="vs last week" colorClass="text-green-600 dark:text-green-400" bgClass="bg-green-50 dark:bg-green-950" />
        <StatCard label="Average Score" value="82.4" icon={Award} trend={1} trendLabel="vs last month" colorClass="text-violet-600 dark:text-violet-400" bgClass="bg-violet-50 dark:bg-violet-950" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Classes */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Recent Classes</h2>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('classes')} className="text-primary gap-1 text-xs h-7">
              View all <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentClasses.map(cls => (
              <button
                key={cls.id}
                onClick={() => onNavigate('class-detail')}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-left group"
              >
                <div className={`h-10 w-10 rounded-lg ${cls.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {cls.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{cls.name}</p>
                  <p className="text-xs text-muted-foreground">{cls.subject}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" />{cls.students}
                    </span>
                    <StatusBadge variant="warning" className="text-[10px] py-0 px-1.5">
                      {cls.assignments} active
                    </StatusBadge>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="flex flex-col gap-3">
            {recentActivity.map(item => (
              <div key={item.id} className="flex gap-3">
                <div className="mt-0.5 shrink-0">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-snug">{item.event}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" />{item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Upcoming Deadlines</h2>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('assignments-active')} className="text-primary gap-1 text-xs h-7">
            View all <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {upcomingDeadlines.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.class}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-muted-foreground">Submissions</p>
                  <p className="text-sm font-medium text-foreground">{item.submissions}</p>
                </div>
                <Progress
                  value={parseInt(item.submissions.split('/')[0]) / parseInt(item.submissions.split('/')[1]) * 100}
                  className="w-20 h-1.5 hidden md:block"
                />
                <StatusBadge variant={item.status} dot>
                  {item.dueDate}
                </StatusBadge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
