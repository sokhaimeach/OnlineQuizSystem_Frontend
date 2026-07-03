import { Plus, Search } from "lucide-react"
import type { AssignmentStatus } from "@/models/assignment.interface"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type AssignmentStatusFilter = AssignmentStatus | "ALL"

interface AssignmentFiltersProps {
  search: string
  filter: AssignmentStatusFilter
  onSearchChange: (value: string) => void
  onStatusChange: (value: AssignmentStatusFilter) => void
  onCreate: () => void
}

export function AssignmentFilters({
  search,
  filter,
  onSearchChange,
  onStatusChange,
  onCreate,
}: AssignmentFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1 sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={event => onSearchChange(event.target.value)}
          placeholder="Search assignment titles…"
          aria-label="Search assignments by title"
          className="pl-9"
        />
      </div>
      <Select value={filter} onValueChange={value => onStatusChange(value as AssignmentStatusFilter)}>
        <SelectTrigger className="w-full sm:w-40" aria-label="Filter assignments by status">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All statuses</SelectItem>
          <SelectItem value="DRAFT">Draft</SelectItem>
          <SelectItem value="PUBLISHED">Published</SelectItem>
          <SelectItem value="CLOSED">Closed</SelectItem>
        </SelectContent>
      </Select>
      <Button type="button" className="gap-1.5 sm:ml-auto" onClick={onCreate}>
        <Plus className="size-4" /> Create assignment
      </Button>
    </div>
  )
}
