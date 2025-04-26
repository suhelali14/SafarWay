import React, { useState } from 'react';
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { FixedSizeList as VirtualList } from 'react-window';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { Button } from './button';
import { Input } from './input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  showColumnVisibility?: boolean;
  virtualize?: boolean;
  rowHeight?: number;
  tableHeight?: number;
  defaultSorting?: SortingState;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  showColumnVisibility = true,
  virtualize = false,
  rowHeight = 48,
  tableHeight = 500,
  defaultSorting = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Filter data based on search query if searchKey is provided
  const filteredData = React.useMemo(() => {
    if (!searchKey || !searchQuery.trim()) return data;

    return data.filter((item) => {
      const value = (item as any)[searchKey];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return String(value).toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [data, searchKey, searchQuery]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Virtualized row renderer for improved performance with large datasets
  const VirtualRow = React.useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const row = table.getRowModel().rows[index];
      
      if (!row) return null;
      
      return (
        <TableRow 
          key={row.id}
          data-state={row.getIsSelected() && "selected"}
          style={{
            ...style,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {row.getVisibleCells().map(cell => (
            <TableCell 
              key={cell.id}
              style={{
                flex: `${cell.column.getSize() === Number.MAX_SAFE_INTEGER ? 1 : 0} 0 ${cell.column.getSize() === Number.MAX_SAFE_INTEGER ? 'auto' : `${cell.column.getSize()}px`}`,
                minWidth: `${cell.column.getSize() === Number.MAX_SAFE_INTEGER ? 0 : cell.column.getSize()}px`,
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      );
    },
    [table]
  );

  // Use virtualized rendering for large datasets
  const renderVirtualizedTable = () => (
    <>
      <div className="rounded-md border">
        <div>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <div key={headerGroup.id} className="flex px-4 py-3">
                {headerGroup.headers.map(header => (
                  <div
                    key={header.id}
                    className="text-sm font-medium"
                    style={{
                      flex: `${header.column.getSize() === Number.MAX_SAFE_INTEGER ? 1 : 0} 0 ${header.column.getSize() === Number.MAX_SAFE_INTEGER ? 'auto' : `${header.column.getSize()}px`}`,
                      minWidth: `${header.column.getSize() === Number.MAX_SAFE_INTEGER ? 0 : header.column.getSize()}px`,
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </TableHeader>
        </div>

        <VirtualList
          height={tableHeight}
          itemCount={table.getRowModel().rows.length}
          itemSize={rowHeight}
          width="100%"
          overscanCount={5}
        >
          {VirtualRow}
        </VirtualList>
      </div>
    </>
  );

  // Regular table rendering for smaller datasets
  const renderStandardTable = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {searchKey ? (
          <div className="flex items-center w-full max-w-sm gap-2">
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>
        ) : (
          <div />
        )}
        {showColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 px-2 lg:px-3 ml-auto"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value: boolean) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Render either virtualized or standard table based on the prop */}
      {virtualize ? renderVirtualizedTable() : renderStandardTable()}

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} of {data.length} items
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-9 px-2 lg:px-3"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden lg:inline ml-1">Previous</span>
          </Button>
          <Button
            variant="outline"
            className="h-9 px-2 lg:px-3"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="hidden lg:inline mr-1">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 