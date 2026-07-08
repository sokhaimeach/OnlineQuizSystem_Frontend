import { ArrowRight, BookOpen, CalendarClock, CheckCircle2, CircleGauge, GraduationCap, Settings, Trophy } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const stats = [
  { label: "Joined Classes", value: "4", icon: GraduationCap, color: "text-indigo-600 bg-indigo-500/10" },
  { label: "Completed Quizzes", value: "18", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-500/10" },
  { label: "Pending Assignments", value: "3", icon: CalendarClock, color: "text-amber-600 bg-amber-500/10" },
  { label: "Average Score", value: "86%", icon: Trophy, color: "text-violet-600 bg-violet-500/10" },
]

export function StudentDashboardView() {
  const navigate = useNavigate()
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Student workspace</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Welcome back — ready to learn?</h1>
        <p className="mt-1 text-muted-foreground">Keep up with your classes, assignments, and quiz progress.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}><CardContent className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>
            <span className={`rounded-xl p-3 ${color}`}><Icon className="size-5" /></span>
          </CardContent></Card>
        ))}
      </div>
      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="rounded-full bg-primary/10 p-3 text-primary"><CircleGauge /></span>
          <div className="flex-1"><div className="flex justify-between text-sm"><span className="font-medium">Overall completion rate</span><span>78%</span></div><Progress value={78} className="mt-2" /></div>
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Upcoming assignments</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[["Operations Homework", "SV23 · Due Jul 9"], ["Data Structures Quiz", "Software Engineering · Due Jul 12"], ["English Grammar", "English 2 · Due Jul 15"]].map(([title, meta]) => (
              <div key={title} className="flex items-center gap-3 rounded-lg border p-3">
                <span className="rounded-lg bg-amber-500/10 p-2 text-amber-600"><CalendarClock className="size-4" /></span>
                <div className="flex-1"><p className="font-medium">{title}</p><p className="text-xs text-muted-foreground">{meta}</p></div>
                <Button size="sm" variant="ghost" onClick={() => navigate("/student/classes")}>Open <ArrowRight /></Button>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
          <CardContent className="grid gap-2">
            <Button className="justify-start" onClick={() => navigate("/student/classes")}><GraduationCap /> Join / view classes</Button>
            <Button variant="outline" className="justify-start" onClick={() => navigate("/student/results")}><Trophy /> View results</Button>
            <Button variant="outline" className="justify-start" onClick={() => navigate("/student/settings")}><Settings /> Settings</Button>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {[["Submitted", "Operations Homework", CheckCircle2], ["Joined class", "SV23", GraduationCap], ["Scored 90%", "Arithmetic Basics", BookOpen]].map(([action, detail, Icon]) => {
            const ActivityIcon = Icon as typeof CheckCircle2
            return <div key={String(detail)} className="flex gap-3"><ActivityIcon className="mt-0.5 size-4 text-primary" /><div><p className="text-sm font-medium">{String(action)}</p><p className="text-xs text-muted-foreground">{String(detail)}</p></div></div>
          })}
        </CardContent>
      </Card>
    </div>
  )
}
