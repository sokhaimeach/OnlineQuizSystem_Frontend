import { useState } from 'react'
import { School, ClipboardList, Plus, Search, ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const allClasses = [
  { id: 1, name: 'Class 10-A', subject: 'Science', students: 32, assignments: 3, avgScore: 84, lastActivity: '2 hrs ago', color: 'bg-indigo-500', initials: '10A', status: 'active' as const },
  { id: 2, name: 'Class 9-B', subject: 'Mathematics', students: 28, assignments: 2, avgScore: 79, lastActivity: '1 day ago', color: 'bg-emerald-500', initials: '9B', status: 'active' as const },
  { id: 3, name: 'Class 11-C', subject: 'Physics', students: 25, assignments: 5, avgScore: 88, lastActivity: '3 hrs ago', color: 'bg-violet-500', initials: '11C', status: 'active' as const },
  { id: 4, name: 'Class 8-A', subject: 'History', students: 30, assignments: 1, avgScore: 76, lastActivity: 'Yesterday', color: 'bg-amber-500', initials: '8A', status: 'active' as const },
  { id: 5, name: 'Class 12-B', subject: 'Chemistry', students: 22, assignments: 0, avgScore: 91, lastActivity: '3 days ago', color: 'bg-rose-500', initials: '12B', status: 'active' as const },
  { id: 6, name: 'Class 7-C', subject: 'Biology', students: 35, assignments: 4, avgScore: 72, lastActivity: '5 hrs ago', color: 'bg-cyan-500', initials: '7C', status: 'active' as const },
]

export function ClassesView() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = allClasses.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Classes"
        description={`${allClasses.length} classes total`}
        icon={School}
        action={{ label: 'New Class', icon: Plus, onClick: () => {} }}
      />

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search classes or subjects…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Classes Grid */}
      {filtered.length === 0 ? (
        <EmptyState icon={School} title="No classes found" description="Try adjusting your search or create a new class." action={{ label: 'Create Class', onClick: () => {} }} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(cls => (
            <div key={cls.id} className="bg-card rounded-md border border-border overflow-hidden hover:shadow-md hover:border-primary/30 transition-all group">
              {/* Color Header */}
              <div className={`h-2 ${cls.color}`} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg ${cls.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                      {cls.initials}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{cls.name}</h3>
                      <p className="text-xs text-muted-foreground">{cls.subject}</p>
                    </div>
                  </div>
                  <StatusBadge variant="success" dot>Active</StatusBadge>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-border">
                  <div className="text-center">
                    <p className="text-base font-bold text-foreground">{cls.students}</p>
                    <p className="text-[11px] text-muted-foreground">Students</p>
                  </div>
                  <div className="text-center border-x border-border">
                    <p className="text-base font-bold text-foreground">{cls.assignments}</p>
                    <p className="text-[11px] text-muted-foreground">Active</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-foreground">{cls.avgScore}%</p>
                    <p className="text-[11px] text-muted-foreground">Avg Score</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <ClipboardList className="h-3.5 w-3.5" />
                    Last active {cls.lastActivity}
                  </p>
                  <Button size="sm" variant="ghost" onClick={() => navigate(`/teacher/classes/${cls.id}`)} className="gap-1 text-xs h-7 text-primary hover:text-primary">
                    Open <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
