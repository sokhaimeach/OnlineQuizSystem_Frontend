import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TablePaginationProps {
  firstRowNumber: number;
  lastRowNumber: number;
  rowCount: number;
  pageIndex: number;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
  selectedCount?: number;
  loading?: boolean;
  className?: string;
}

export function TablePagination({
  firstRowNumber,
  lastRowNumber,
  rowCount,
  pageIndex,
  pageCount,
  canPreviousPage,
  canNextPage,
  onPrevious,
  onNext,
  selectedCount,
  loading = false,
  className,
}: TablePaginationProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3",
        className,
      )}
    >
      <p className="text-xs text-muted-foreground">
        {selectedCount ? `${selectedCount} selected · ` : ""}
        {firstRowNumber}–{lastRowNumber} of {rowCount}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          Page {pageIndex + 1} of {Math.max(pageCount, 1)}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={onPrevious}
          disabled={!canPreviousPage || loading}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={onNext}
          disabled={!canNextPage || loading}
          aria-label="Next page"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
