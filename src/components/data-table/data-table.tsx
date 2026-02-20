import {
  type ColumnDef,
  type ColumnResizeMode,
  type ColumnSizingState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import type * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTableToolbar } from '@/components/data-table/toolbar.tsx';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTableResizer } from './data-table-resizer';
import { useTableColumnResize } from './hooks/use-table-column-resize';
import { DataTablePagination } from './pagination';
import type { ExportConfig, ToolbarRenderProps, ToolbarSections } from './types';
import {
  cleanupColumnResizing,
  initializeColumnSizes,
  trackColumnResizing,
} from './utils/column-sizing';
import { createKeyboardNavigationHandler } from './utils/keyboard-navigation';
import { type TableConfig, useTableConfig } from './utils/table-config';

// Types for table handlers
type ColumnOrderUpdater = (prev: string[]) => string[];
type RowSelectionUpdater = (prev: Record<string, boolean>) => Record<string, boolean>;

interface DataTableProps<TData> {
  // Allow overriding the table configuration
  config?: Partial<TableConfig>;

  // Column definitions generator
  getColumns: (
    handleRowDeselection: ((rowId: string) => void) | null | undefined,
    t: TFunction
  ) => ColumnDef<TData>[];

  // Data to display in the table
  data: TData[];

  // Total count for pagination
  totalItems: number;

  // Export configuration
  exportConfig?: ExportConfig<TData>;

  // ID field in TData for tracking selected items
  idField: keyof TData;

  // Custom page size options
  pageSizeOptions?: number[];

  // Custom toolbar content render function
  renderToolbarContent?: (props: ToolbarRenderProps<TData>) => React.ReactNode | ToolbarSections;

  // Loading state
  isLoading?: boolean;

  // Pagination props
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;

  // Sorting props
  sorting?: Array<{ id: string; desc: boolean }>;
  onSortingChange?: (
    updaterOrValue:
      | Array<{ id: string; desc: boolean }>
      | ((prev: Array<{ id: string; desc: boolean }>) => Array<{ id: string; desc: boolean }>)
  ) => void;

  // Search props
  searchValue?: string;
  onSearchChange?: (value: string) => void;

  // Column mapping for translations
  columnMapping?: Record<string, string>;
}

export function DataTable<TData>({
  config = {},
  getColumns,
  data,
  totalItems,
  exportConfig,
  idField = 'id' as keyof TData,
  pageSizeOptions,
  renderToolbarContent,
  isLoading = false,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  sorting: externalSorting = [],
  onSortingChange,
  searchValue: externalSearchValue = '',
  onSearchChange,
  columnMapping,
}: DataTableProps<TData>) {
  const { t } = useTranslation();

  // Load table configuration with any overrides
  const tableConfig = useTableConfig(config);

  // Table ID for localStorage storage - generate a default if not provided
  const tableId = tableConfig.columnResizingTableId || 'data-table-default';

  // Use our custom hook for a column resizing
  const { columnSizing, setColumnSizing, resetColumnSizing } = useTableColumnResize(
    tableId,
    tableConfig.enableColumnResizing
  );

  // Column order state (managed separately from the URL state as it's persisted in localStorage)
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  // Column visibility state (managed separately and persisted in localStorage)
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  // PERFORMANCE FIX: Use only one selection state as the source of truth
  const [selectedItemIds, setSelectedItemIds] = useState<Record<string | number, boolean>>({});

  // No sorting from filters - use external sorting if provided, otherwise internal
  const [sorting, setSorting] = useState<Array<{ id: string; desc: boolean }>>(externalSorting);

  // Global filter state for search (used only when NOT manual searching)
  const [globalFilter, setGlobalFilter] = useState<string>('');

  // Handle search change
  const handleSearchChange = useCallback(
    (value: string) => {
      if (tableConfig.manualSearching && onSearchChange) {
        // Manual search - call external handler directly
        onSearchChange(value);
      } else {
        // Internal search - use global filter
        setGlobalFilter(value);
      }
    },
    [tableConfig.manualSearching, onSearchChange]
  );

  // Get the current search value - use external value for manual, internal for automatic
  const currentSearchValue = tableConfig.manualSearching ? externalSearchValue : globalFilter;

  // Update internal sorting when external sorting changes
  useEffect(() => {
    if (tableConfig.manualSorting) {
      setSorting(externalSorting);
    }
  }, [externalSorting, tableConfig.manualSorting]);

  // Handle sorting change
  const handleSortingChange = useCallback(
    (
      updaterOrValue:
        | Array<{ id: string; desc: boolean }>
        | ((prev: Array<{ id: string; desc: boolean }>) => Array<{ id: string; desc: boolean }>)
    ) => {
      if (tableConfig.manualSorting && onSortingChange) {
        onSortingChange(updaterOrValue);
      } else {
        // Internal sorting
        setSorting(updaterOrValue);
      }
    },
    [tableConfig.manualSorting, onSortingChange]
  );

  // Get current data items - already provided as prop
  const dataItems = useMemo(() => data || [], [data]);

  // PERFORMANCE FIX: Derive rowSelection from selectedItemIds using memoization
  const rowSelection = useMemo(() => {
    if (!dataItems.length) return {};

    // Map selectedItemIds to row indices for the table
    const selection: Record<string, boolean> = {};

    dataItems.forEach((item, index) => {
      const itemId = String(item[idField]);
      if (selectedItemIds[itemId]) {
        selection[String(index)] = true;
      }
    });

    return selection;
  }, [dataItems, selectedItemIds, idField]);

  // Calculate total selected items - memoize to avoid recalculation
  const totalSelectedItems = useMemo(() => Object.keys(selectedItemIds).length, [selectedItemIds]);

  // PERFORMANCE FIX: Optimized row deselection handler
  const handleRowDeselection = useCallback(
    (rowId: string) => {
      if (!dataItems.length) return;

      const rowIndex = Number.parseInt(rowId, 10);
      const item = dataItems[rowIndex];

      if (item) {
        const itemId = String(item[idField]);
        setSelectedItemIds(prev => {
          // Remove this item ID from selection
          const next = { ...prev };
          delete next[itemId];
          return next;
        });
      }
    },
    [dataItems, idField]
  );

  // Clear all selections
  const clearAllSelections = useCallback(() => {
    setSelectedItemIds({});
  }, []);

  // PERFORMANCE FIX: Optimized row selection handler
  const handleRowSelectionChange = useCallback(
    (updaterOrValue: RowSelectionUpdater | Record<string, boolean>) => {
      // Determine the new row selection value
      const newRowSelection =
        typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection) : updaterOrValue;

      // Batch update selectedItemIds based on the new row selection
      setSelectedItemIds(prev => {
        const next = { ...prev };

        // Process changes for the current page
        if (dataItems.length) {
          // First, handle explicit selections in newRowSelection
          for (const [rowId, isSelected] of Object.entries(newRowSelection)) {
            const rowIndex = Number.parseInt(rowId, 10);
            if (rowIndex >= 0 && rowIndex < dataItems.length) {
              const item = dataItems[rowIndex];
              const itemId = String(item[idField]);

              if (isSelected) {
                next[itemId] = true;
              } else {
                delete next[itemId];
              }
            }
          }

          // Then handle implicit deselection (rows that were selected but aren't in newRowSelection)
          dataItems.forEach((item, index) => {
            const itemId = String(item[idField]);
            const rowId = String(index);

            // If an item was selected but isn't in the new selection, deselect it
            if (prev[itemId] && newRowSelection[rowId] === undefined) {
              delete next[itemId];
            }
          });
        }

        return next;
      });
    },
    [dataItems, rowSelection, idField]
  );

  // Get selected items data
  const getSelectedItems = useCallback(async () => {
    // If nothing is selected, return an empty array
    if (totalSelectedItems === 0) {
      return [];
    }

    // Find items from the current page that are selected
    // Return current page items (since we don't have fetchByIdsFn anymore)
    return dataItems.filter(item => selectedItemIds[String(item[idField])]);
  }, [dataItems, selectedItemIds, totalSelectedItems, idField]);

  // Get all items on the current page
  const getAllItems = useCallback((): TData[] => {
    // Return current page data
    return dataItems;
  }, [dataItems]);

  // Memoized pagination state
  const pagination = useMemo(
    () => ({
      pageIndex: currentPage - 1,
      pageSize: pageSize,
    }),
    [currentPage, pageSize]
  );

  // Ref for the table container for keyboard navigation
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Get columns with the deselection handler (memoize to avoid recreation on a render)
  const columns = useMemo(() => {
    // Only pass the deselection handler if row selection is enabled
    return getColumns(tableConfig.enableRowSelection ? handleRowDeselection : null, t);
  }, [getColumns, handleRowDeselection, tableConfig.enableRowSelection, t]);

  // Handle pagination changes
  const handlePaginationChange = useCallback(
    (
      updaterOrValue:
        | { pageIndex: number; pageSize: number }
        | ((prev: { pageIndex: number; pageSize: number }) => {
            pageIndex: number;
            pageSize: number;
          })
    ) => {
      const newPagination =
        typeof updaterOrValue === 'function'
          ? updaterOrValue({
              pageIndex: currentPage - 1,
              pageSize: pageSize,
            })
          : updaterOrValue;

      if (onPageChange && newPagination.pageIndex !== currentPage - 1) {
        onPageChange(newPagination.pageIndex + 1);
      }

      if (onPageSizeChange && newPagination.pageSize !== pageSize) {
        onPageSizeChange(newPagination.pageSize);
      }
    },
    [currentPage, pageSize, onPageChange, onPageSizeChange]
  );

  const handleColumnSizingChange = useCallback(
    (updaterOrValue: ColumnSizingState | ((prev: ColumnSizingState) => ColumnSizingState)) => {
      if (typeof updaterOrValue === 'function') {
        setColumnSizing(current => updaterOrValue(current));
      } else {
        setColumnSizing(updaterOrValue);
      }
    },
    [setColumnSizing]
  );

  // Column order change handler
  const handleColumnOrderChange = useCallback(
    (updaterOrValue: ColumnOrderUpdater | string[]) => {
      setColumnOrder(prev => {
        const newColumnOrder =
          typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue;

        // Persist column order to localStorage
        try {
          localStorage.setItem(`${tableId}-column-order`, JSON.stringify(newColumnOrder));
        } catch {
          // Silently handle localStorage errors
        }

        return newColumnOrder;
      });
    },
    [tableId]
  );

  // Load column order from localStorage on initial render
  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem(`${tableId}-column-order`);
      if (savedOrder) {
        const parsedOrder = JSON.parse(savedOrder);
        setColumnOrder(parsedOrder);
      }
    } catch {
      // Silently handle localStorage errors
    }
  }, [tableId]);

  // Load column visibility from localStorage on initial render
  useEffect(() => {
    try {
      const savedVisibility = localStorage.getItem(`${tableId}-column-visibility`);
      if (savedVisibility) {
        const parsedVisibility = JSON.parse(savedVisibility);
        setColumnVisibility(parsedVisibility);
      }
    } catch {
      // Silently handle localStorage errors
    }
  }, [tableId]);

  // Column visibility change handler
  const handleColumnVisibilityChange = useCallback(
    (
      updaterOrValue:
        | Record<string, boolean>
        | ((prev: Record<string, boolean>) => Record<string, boolean>)
    ) => {
      setColumnVisibility(prev => {
        const newColumnVisibility =
          typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue;

        // Persist column visibility to localStorage
        try {
          localStorage.setItem(`${tableId}-column-visibility`, JSON.stringify(newColumnVisibility));
        } catch {
          // Silently handle localStorage errors
        }

        return newColumnVisibility;
      });
    },
    [tableId]
  );

  // Calculate total pages based on totalItems and current pageSize
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / pageSize);
  }, [totalItems, pageSize]);

  // Set up the table with a memoized state
  const table = useReactTable<TData>({
    data: dataItems,
    columns,
    state: {
      sorting,
      rowSelection,
      pagination,
      columnSizing,
      columnOrder,
      columnVisibility,
      globalFilter: tableConfig.manualSearching ? '' : globalFilter,
    },
    columnResizeMode: 'onChange' as ColumnResizeMode,
    onColumnSizingChange: handleColumnSizingChange,
    onColumnOrderChange: handleColumnOrderChange,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onSortingChange: handleSortingChange,
    onGlobalFilterChange: tableConfig.manualSearching ? undefined : setGlobalFilter,
    pageCount: totalPages,
    enableRowSelection: tableConfig.enableRowSelection,
    enableColumnResizing: tableConfig.enableColumnResizing,
    enableGlobalFilter: tableConfig.enableSearch && !tableConfig.manualSearching,
    manualPagination: tableConfig.manualPagination,
    manualSorting: tableConfig.manualSorting,
    manualFiltering: tableConfig.manualFiltering,
    onRowSelectionChange: handleRowSelectionChange,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Create keyboard navigation handler
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const handler = createKeyboardNavigationHandler(table, () => {
        // Example action on keyboard activation
      });
      handler(event);
    },
    [table]
  );

  // Initialize default column sizes when columns are available and no saved sizes exist
  useEffect(() => {
    initializeColumnSizes(columns, tableId, setColumnSizing);
  }, [columns, tableId, setColumnSizing]);

  // Handle column resizing
  useEffect(() => {
    const isResizingAny = table
      .getHeaderGroups()
      .some(headerGroup => headerGroup.headers.some(header => header.column.getIsResizing()));

    trackColumnResizing(isResizingAny);

    // Cleanup on unmounting
    return () => {
      cleanupColumnResizing();
    };
  }, [table]);

  // Reset column order
  const resetColumnOrder = useCallback(() => {
    // Reset to an empty array (which resets to the default order)
    table.setColumnOrder([]);
    setColumnOrder([]);

    // Remove from localStorage
    try {
      localStorage.removeItem(`${tableId}-column-order`);
    } catch {
      // Silently handle localStorage errors
    }
  }, [table, tableId]);

  return (
    <div className="data-table-wrapper">
      {/* Toolbar */}
      {tableConfig.enableToolbar && (
        <DataTableToolbar
          table={table}
          getSelectedItems={getSelectedItems}
          getAllItems={getAllItems}
          config={tableConfig}
          resetColumnSizing={() => {
            resetColumnSizing();
            // Force a small delay and then refresh the UI
            setTimeout(() => {
              window.dispatchEvent(new Event('resize'));
            }, 100);
          }}
          resetColumnOrder={resetColumnOrder}
          tableId={tableId}
          exportConfig={exportConfig}
          columnMapping={columnMapping || exportConfig?.columnMapping}
          searchValue={currentSearchValue}
          onSearchChange={handleSearchChange}
          customToolbarComponent={renderToolbarContent?.({
            selectedRows: dataItems.filter(item => selectedItemIds[String(item[idField])]),
            allSelectedIds: Object.keys(selectedItemIds),
            totalSelectedCount: totalSelectedItems,
            resetSelection: clearAllSelections,
          })}
        />
      )}

      <div
        ref={tableContainerRef}
        className="table-container"
        aria-label="Data table"
        role="region"
        onKeyDown={tableConfig.enableKeyboardNavigation ? handleKeyDown : undefined}
      >
        <Table
          className={`${tableConfig.enableColumnResizing ? 'resizable-table' : ''} text-foreground`}
          style={{ tableLayout: 'fixed' }}
        >
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    className="group/th relative border-border border-b bg-muted text-left font-semibold text-foreground"
                    key={header.id}
                    colSpan={header.colSpan}
                    scope="col"
                    tabIndex={-1}
                    style={{
                      width: header.getSize(),
                      minWidth: header.column.columnDef.minSize || header.getSize(),
                      maxWidth: header.column.columnDef.maxSize,
                    }}
                    data-column-resizing={header.column.getIsResizing() ? 'true' : undefined}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    {tableConfig.enableColumnResizing && header.column.getCanResize() && (
                      <DataTableResizer header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              // Loading state
              Array.from({ length: pageSize }, (_, index) => {
                const rowKey = `loading-row-${tableId}-${index}`;
                return (
                  <TableRow key={rowKey} tabIndex={-1}>
                    {Array.from({ length: table.getVisibleLeafColumns().length }, (_, colIndex) => {
                      const cellKey = `skeleton-cell-${tableId}-${index}-${colIndex}`;
                      return (
                        <TableCell
                          key={cellKey}
                          className="border-border border-b text-left text-foreground"
                          tabIndex={-1}
                        >
                          <Skeleton className="h-6 w-full border-none! bg-(--color-primary)/10" />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : table.getRowModel().rows?.length ? (
              // Data rows
              table
                .getRowModel()
                .rows.map((row, rowIndex) => (
                  <TableRow
                    key={row.id}
                    id={`row-${rowIndex}`}
                    data-row-index={rowIndex}
                    data-state={row.getIsSelected() ? 'selected' : undefined}
                    tabIndex={0}
                    aria-selected={row.getIsSelected()}
                    className={`transition-colors duration-(--motion-short) hover:bg-(--control-ghost-bg) ${
                      row.getIsSelected()
                        ? 'bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)]'
                        : ''
                    }`}
                    onClick={
                      tableConfig.enableClickRowSelect ? () => row.toggleSelected() : undefined
                    }
                    onFocus={e => {
                      // Add a data attribute to the currently focused row
                      for (const el of document.querySelectorAll('[data-focused="true"]')) {
                        el.removeAttribute('data-focused');
                      }
                      e.currentTarget.setAttribute('data-focused', 'true');
                    }}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <TableCell
                        className="border-border border-b text-left text-foreground transition-colors duration-200 hover:bg-muted/50"
                        key={cell.id}
                        id={`cell-${rowIndex}-${cellIndex}`}
                        data-cell-index={cellIndex}
                        style={{
                          width: cell.column.getSize(),
                          minWidth: cell.column.columnDef.minSize || cell.column.getSize(),
                          maxWidth: cell.column.columnDef.maxSize,
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            ) : (
              // No results
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {t('common.ui.noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {tableConfig.enablePagination && (
        <DataTablePagination
          table={table}
          totalItems={totalItems}
          totalSelectedItems={totalSelectedItems}
          pageSizeOptions={pageSizeOptions || [10, 20, 30, 40, 50]}
          size={tableConfig.size}
        />
      )}
    </div>
  );
}
