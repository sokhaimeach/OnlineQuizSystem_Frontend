import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ExportButton, type ExportOptions } from "./ExportButton";

export interface ReportFilters {
  search?: string;
  class_id?: string;
  subject_id?: string;
  level?: string;
}

interface ReportFilterBarProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  classes: { id: string; class_name: string }[];
  subjects?: { id: string; subject_name: string }[];
  showSubject?: boolean;
  showLevel?: boolean;
  exportOptions?: ExportOptions;
  exporting?: boolean;
  className?: string;
}

export function ReportFilterBar({
  filters,
  onFiltersChange,
  classes,
  subjects = [],
  showSubject = false,
  showLevel = false,
  exportOptions,
  exporting,
  className = "",
}: ReportFilterBarProps) {
  const set = (patch: Partial<ReportFilters>) =>
    onFiltersChange({ ...filters, ...patch });

  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap ${className}`}
    >
      <div className="relative flex-1 min-w-52 max-w-xs">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search students..."
          value={filters.search ?? ""}
          onChange={(e) => set({ search: e.target.value })}
          className="pl-8 pr-8"
        />
        {filters.search && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => set({ search: undefined })}
            aria-label="Clear search"
            className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <Select
        value={filters.class_id ?? "all"}
        onValueChange={(v) =>
          set({ class_id: v === "all" ? undefined : v })
        }
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="All classes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All classes</SelectItem>
          {classes.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.class_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showSubject && (
        <Select
          value={filters.subject_id ?? "all"}
          onValueChange={(v) =>
            set({ subject_id: v === "all" ? undefined : v })
          }
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects</SelectItem>
            {subjects.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.subject_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {showLevel && (
        <Select
          value={filters.level ?? "all"}
          onValueChange={(v) => set({ level: v === "all" ? undefined : v })}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            <SelectItem value="EXCELLENT">Excellent</SelectItem>
            <SelectItem value="GOOD">Good</SelectItem>
            <SelectItem value="AVERAGE">Average</SelectItem>
            <SelectItem value="NEEDS_IMPROVEMENT">
              Needs Improvement
            </SelectItem>
            <SelectItem value="CRITICAL">Critical</SelectItem>
            <SelectItem value="NO_DATA">No Data</SelectItem>
          </SelectContent>
        </Select>
      )}

      {exportOptions && (
        <ExportButton
          options={exportOptions}
          disabled={exporting}
          className="ml-auto"
        />
      )}
    </div>
  );
}
