import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  emptyState?: React.ReactNode;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  filters?: ColumnFiltersState;
  onFilterChange?: OnChangeFn<ColumnFiltersState>;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  enableRowSelection?: boolean;
  pageCount?: number;
  rowCount?: number;
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  getRowId?: (row: TData, index: number) => string;
  hidePagination?: boolean;
  className?: string;
}

function SelectionCheckbox({
  checked,
  indeterminate,
  "aria-label": ariaLabel,
  onChange,
}: {
  checked: boolean;
  indeterminate?: boolean;
  "aria-label": string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      aria-label={ariaLabel}
      onChange={onChange}
      className="size-4 rounded-sm border-border accent-primary"
    />
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  emptyState = "No results found.",
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  filters,
  onFilterChange,
  rowSelection,
  onRowSelectionChange,
  enableRowSelection = false,
  pageCount,
  rowCount,
  manualPagination = false,
  manualSorting = false,
  manualFiltering = false,
  getRowId,
  hidePagination = false,
  className,
}: DataTableProps<TData, TValue>) {
  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
  const [internalSorting, setInternalSorting] = React.useState<SortingState>(
    [],
  );
  const [internalFilters, setInternalFilters] =
    React.useState<ColumnFiltersState>([]);
  const [internalSelection, setInternalSelection] =
    React.useState<RowSelectionState>({});

  const resolvedPagination = pagination ?? internalPagination;
  const resolvedSorting = sorting ?? internalSorting;
  const resolvedFilters = filters ?? internalFilters;
  const resolvedSelection = rowSelection ?? internalSelection;

  const selectionColumn = React.useMemo<ColumnDef<TData, TValue>>(
    () => ({
      id: "select",
      header: ({ table }) => (
        <SelectionCheckbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          aria-label="Select all rows"
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <SelectionCheckbox
          checked={row.getIsSelected()}
          aria-label="Select row"
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    }),
    [],
  );

  const resolvedColumns = React.useMemo(
    () => (enableRowSelection ? [selectionColumn, ...columns] : columns),
    [columns, enableRowSelection, selectionColumn],
  );

  const table = useReactTable({
    data,
    columns: resolvedColumns,
    state: {
      pagination: resolvedPagination,
      sorting: resolvedSorting,
      columnFilters: resolvedFilters,
      rowSelection: resolvedSelection,
    },
    enableRowSelection,
    onPaginationChange: onPaginationChange ?? setInternalPagination,
    onSortingChange: onSortingChange ?? setInternalSorting,
    onColumnFiltersChange: onFilterChange ?? setInternalFilters,
    onRowSelectionChange: onRowSelectionChange ?? setInternalSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    getPaginationRowModel: manualPagination
      ? undefined
      : getPaginationRowModel(),
    manualPagination,
    manualSorting,
    manualFiltering,
    pageCount,
    rowCount,
    getRowId,
  });

  const visibleColumnCount = table.getVisibleLeafColumns().length;
  const firstRowNumber =
    data.length === 0
      ? 0
      : resolvedPagination.pageIndex * resolvedPagination.pageSize + 1;
  const lastRowNumber = Math.min(
    firstRowNumber + table.getRowModel().rows.length - 1,
    rowCount ?? table.getFilteredRowModel().rows.length,
  );

  return (
    <div className={cn("w-full", className)}>
      <div className="w-full overflow-auto rounded-md border border-border bg-card">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  const canSort = header.column.getCanSort();
                  return (
                    <TableHead
                      key={header.id}
                      className="bg-muted text-foreground"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="-ml-1 inline-flex h-7 items-center gap-1 rounded-sm px-1 hover:bg-muted"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {sorted === "asc" ? (
                            <ArrowUp className="size-3.5" />
                          ) : sorted === "desc" ? (
                            <ArrowDown className="size-3.5" />
                          ) : (
                            <ArrowUpDown className="size-3.5 opacity-45" />
                          )}
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: resolvedPagination.pageSize }).map(
                (_, rowIndex) => (
                  <TableRow key={`loading-${rowIndex}`} aria-busy="true">
                    {Array.from({ length: visibleColumnCount }).map(
                      (__, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton className="h-4 w-full max-w-40 rounded-sm" />
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                ),
              )
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={visibleColumnCount}
                  className="h-32 text-center text-muted-foreground"
                >
                  {emptyState}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!hidePagination && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            {enableRowSelection &&
            table.getFilteredSelectedRowModel().rows.length > 0
              ? `${table.getFilteredSelectedRowModel().rows.length} selected · `
              : ""}
            {firstRowNumber}–{lastRowNumber} of{" "}
            {rowCount ?? table.getFilteredRowModel().rows.length}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Page {resolvedPagination.pageIndex + 1} of{" "}
              {Math.max(table.getPageCount(), 1)}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || loading}
              aria-label="Previous page"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || loading}
              aria-label="Next page"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
