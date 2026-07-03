import { ArrowRight, ClipboardList, Pencil, Trash2, Users } from 'lucide-react'
import type { Class } from '@/models/class.interface'
import { Button } from '@/components/ui/button'

interface ClassCardProps {
  classItem: Class
  onView: (classItem: Class) => void
  onEdit: (classItem: Class) => void
  onDelete: (classItem: Class) => void
}

export function ClassCard({ classItem, onView, onEdit, onDelete }: ClassCardProps) {
  const colorStyle = classItem.color ? { backgroundColor: classItem.color } : undefined

  return (
    <article className="group overflow-hidden rounded-md border border-border bg-card transition-all hover:border-primary/30 hover:shadow-md">
      <div className="h-2 bg-primary" style={colorStyle} />
      <div className="space-y-4 p-5">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground"
            style={colorStyle}
            aria-hidden="true"
          >
            {classItem.class_name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-foreground">{classItem.class_name}</h2>
            <p className="mt-0.5 line-clamp-2 min-h-8 text-xs text-muted-foreground">
              {classItem.description || 'No description provided'}
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-3 divide-x divide-border border-y border-border py-3">
          <div className="text-center">
            <dt className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
              <Users className="size-3" /> Students
            </dt>
            <dd className="mt-1 text-base font-bold text-foreground">{classItem.total_student}</dd>
          </div>
          <div className="text-center">
            <dt className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
              <ClipboardList className="size-3" /> Assignments
            </dt>
            <dd className="mt-1 text-base font-bold text-foreground">{classItem.assignment_count}</dd>
          </div>
          <div className="text-center">
            <dt className="text-[11px] text-muted-foreground">Active</dt>
            <dd className="mt-1 text-base font-bold text-foreground">{classItem.active_assignment_count}</dd>
          </div>
        </dl>

        <div className="flex items-center justify-end gap-1">
          <Button type="button" size="sm" variant="ghost" onClick={() => onEdit(classItem)}>
            <Pencil /> Edit
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(classItem)}
          >
            <Trash2 /> Delete
          </Button>
          <Button type="button" size="sm" variant="ghost" className="text-primary hover:text-primary" onClick={() => onView(classItem)}>
            View <ArrowRight />
          </Button>
        </div>
      </div>
    </article>
  )
}
