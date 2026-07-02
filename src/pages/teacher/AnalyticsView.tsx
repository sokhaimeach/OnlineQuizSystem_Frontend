import { BarChart3, TrendingUp, Users, Award, BookOpen, School } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const classPerformance = [
  { name: 'Class 11-C · Physics', avg: 88, students: 25, color: 'bg-violet-500' },
  { name: 'Class 12-B · Chemistry', avg: 91, students: 22, color: 'bg-emerald-500' },
  { name: 'Class 10-A · Science', avg: 84, students: 32, color: 'bg-indigo-500' },
  { name: 'Class 9-B · Mathematics', avg: 79, students: 28, color: 'bg-blue-500' },
  { name: 'Class 8-A · History', avg: 76, students: 30, color: 'bg-amber-500' },
  { name: 'Class 7-C · Biology', avg: 72, students: 35, color: 'bg-cyan-500' },
]

const topPerformers = [
  { name: 'Sarah Chen', class: 'Class 10-A', score: 96, initials: 'SC' },
  { name: 'Emily Brown', class: 'Class 12-B', score: 94, initials: 'EB' },
  { name: 'Maria Garcia', class: 'Class 9-B', score: 91, initials: 'MG' },
  { name: 'Alex Johnson', class: 'Class 11-C', score: 88, initials: 'AJ' },
  { name: 'James Wilson', class: 'Class 7-C', score: 85, initials: 'JW' },
]

const quizCompletion = [
  { title: 'Lab Safety Quiz', class: 'Class 10-A', completion: 100, avg: 84 },
  { title: 'Algebra Basics', class: 'Class 9-B', completion: 96, avg: 79 },
  { title: 'Physics Motion', class: 'Class 11-C', completion: 88, avg: 88 },
  { title: 'Chemistry Reactions', class: 'Class 12-B', completion: 75, avg: 91 },
  { title: 'Chapter 5 Quiz', class: 'Class 10-A', completion: 56, avg: 0 },
]

const weeklyData = [40, 65, 52, 78, 85, 70, 92]
const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const maxVal = Math.max(...weeklyData)

export function AnalyticsView() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Analytics"
        description="Performance insights across all your classes"
        icon={BarChart3}
      />

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Overall Avg Score" value="82.4%" icon={Award} trend={2} colorClass="text-emerald-600 dark:text-emerald-400" bgClass="bg-emerald-50 dark:bg-emerald-950" />
        <StatCard label="Total Students" value="347" icon={Users} trend={12} colorClass="text-indigo-600 dark:text-indigo-400" bgClass="bg-indigo-50 dark:bg-indigo-950" />
        <StatCard label="Completion Rate" value="78%" icon={TrendingUp} trend={3} colorClass="text-blue-600 dark:text-blue-400" bgClass="bg-blue-50 dark:bg-zinc-800" />
        <StatCard label="Quizzes Graded" value="186" icon={BookOpen} trend={8} colorClass="text-violet-600 dark:text-indigo-400" bgClass="bg-violet-50 dark:bg-zinc-800" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Submissions */}
        <div className="bg-card rounded-md border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Weekly Submissions</h3>
          <p className="text-xs text-muted-foreground mb-4">Total quiz submissions per day this week</p>
          <div className="flex items-end gap-2 h-32">
            {weeklyData.map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground">{val}</span>
                <div
                  className="w-full rounded-t-sm bg-primary/80 hover:bg-primary transition-colors"
                  style={{ height: `${(val / maxVal) * 100}%` }}
                  title={`${val} submissions`}
                />
                <span className="text-[10px] text-muted-foreground">{dayLabels[idx]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Class Performance */}
        <div className="bg-card rounded-md border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Class Performance</h3>
          <p className="text-xs text-muted-foreground mb-4">Average score per class</p>
          <div className="flex flex-col gap-3">
            {classPerformance.map(cls => (
              <div key={cls.name} className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${cls.color}`} />
                <span className="text-xs text-foreground flex-1 min-w-0 truncate">{cls.name}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <Progress value={cls.avg} className="h-1.5 w-20" />
                  <span className="text-xs font-semibold text-foreground w-8 text-right">{cls.avg}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-card rounded-md border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Top Performers</h3>
          <div className="flex flex-col gap-3">
            {topPerformers.map((student, idx) => (
              <div key={student.name} className="flex items-center gap-3">
                <span className="text-sm font-bold text-muted-foreground w-5 shrink-0 text-center">{idx + 1}</span>
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">{student.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{student.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <School className="h-3 w-3" />{student.class}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-sm font-bold text-foreground">{student.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Completion Rates */}
        <div className="bg-card rounded-md border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Quiz Completion Rates</h3>
          <div className="flex flex-col gap-4">
            {quizCompletion.map(quiz => (
              <div key={quiz.title}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="min-w-0 flex-1 mr-2">
                    <p className="text-xs font-medium text-foreground truncate">{quiz.title}</p>
                    <p className="text-[11px] text-muted-foreground">{quiz.class}</p>
                  </div>
                  <span className="text-xs font-semibold text-foreground shrink-0">{quiz.completion}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${quiz.completion === 100 ? 'bg-emerald-500' : quiz.completion >= 75 ? 'bg-indigo-500' : quiz.completion >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${quiz.completion}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
