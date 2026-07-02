import { BookOpen, Calendar, School, Users } from 'lucide-react'

import { type ColumnDef } from '@/components/data-table'
import { StatusBadge } from '@/components/StatusBadge'
import { Progress } from '@/components/ui/progress'
import type { AssignmentListItem } from './assignmentTable'

export function assignmentColumns(showScore: boolean): ColumnDef<AssignmentListItem>[] {
    const columns: ColumnDef<AssignmentListItem>[] = [
        {
            accessorKey: 'title',
            header: 'Assignment',
            cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
        },
        {
            accessorKey: 'class',
            header: 'Class',
            cell: ({ row }) => <span className="flex items-center gap-1 text-xs text-muted-foreground"><School className="size-3" />{row.original.class}</span>,
        },
        {
            accessorKey: 'quiz',
            header: 'Quiz',
            cell: ({ row }) => <span className="flex items-center gap-1 text-xs text-muted-foreground"><BookOpen className="size-3" />{row.original.quiz}</span>,
        },
        {
            accessorKey: 'dueDate',
            header: 'Due date',
            cell: ({ row }) => <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="size-3" />{row.original.dueDate}</span>,
        },
        {
            accessorKey: 'submissionPct',
            header: 'Submissions',
            cell: ({ row }) => (
                <div className="flex min-w-28 items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-medium"><Users className="size-3 text-muted-foreground" />{row.original.submissions}</span>
                    <Progress value={row.original.submissionPct} className="h-1 w-14" />
                </div>
            ),
        },
    ]

    if (showScore) {
        columns.push({
            accessorKey: 'avgScore',
            header: 'Avg score',
            cell: ({ row }) => row.original.avgScore ? (
                <span className={row.original.avgScore >= 80 ? 'font-semibold text-emerald-600 dark:text-emerald-400' : 'font-semibold text-amber-600 dark:text-amber-400'}>
                    {row.original.avgScore}%
                </span>
            ) : <span className="text-muted-foreground">—</span>,
        })
    }

    columns.push({
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <StatusBadge variant={row.original.status === 'active' ? 'warning' : row.original.status === 'scheduled' ? 'info' : 'success'} dot>
                {row.original.status[0].toUpperCase() + row.original.status.slice(1)}
            </StatusBadge>
        ),
    })
    return columns
}
