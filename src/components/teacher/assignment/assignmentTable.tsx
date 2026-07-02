import { EmptyState } from "@/components/EmptyState";
import { useMemo, useState } from "react";
import { assignmentColumns } from "./assignmentColumn";
import { ClipboardList, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";

export type AssignmentListStatus = "active" | "scheduled" | "completed"

export interface AssignmentListItem {
    id: number
    title: string
    class: string
    quiz: string
    dueDate: string
    submissions: string
    submissionPct: number
    status: AssignmentListStatus
    avgScore?: number
}

export function AssignmentTable({ items, showScore = false }: { items: AssignmentListItem[]; showScore?: boolean }) {
    const [search, setSearch] = useState('')
    const columns = useMemo(() => assignmentColumns(showScore), [showScore])
    const filtered = items.filter((assignment) =>
        assignment.title.toLowerCase().includes(search.toLowerCase()) ||
        assignment.class.toLowerCase().includes(search.toLowerCase()),
    )

    if (items.length === 0) {
        return <EmptyState icon={ClipboardList} title="No assignments here" description="Assignments in this category will appear here." />
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <div className="relative max-w-sm flex-1">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search assignments…" value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" />
                </div>
                <Button variant="outline" size="sm" className="shrink-0 gap-1.5"><Filter className="size-4" /> Filter</Button>
            </div>
            <DataTable columns={columns} data={filtered} enableRowSelection getRowId={(row) => String(row.id)} />
        </div>
    )
}
