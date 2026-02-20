import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchInput } from '@/components/common/search-input.tsx';
import { Button } from '@/components/ui/button';
import { DataTableExport } from './data-export';
import { TableSettings } from './table-settings';
import type { ExportConfig, ToolbarSections } from './types';
import type { TableConfig } from './utils/table-config';
import { DataTableViewOptions } from './view-options';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  totalSelectedItems?: number;
  deleteSelection?: () => void;
  getSelectedItems?: () => Promise<TData[]>;
  getAllItems?: () => TData[];
  config: TableConfig;
  resetColumnSizing?: () => void;
  resetColumnOrder?: () => void;
  tableId?: string;
  exportConfig?: ExportConfig<TData>;
  columnMapping?: Record<string, string>;
  customToolbarComponent?: ReactNode | ToolbarSections;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function DataTableToolbar<TData>({
  table,
  getSelectedItems,
  getAllItems,
  config,
  resetColumnSizing,
  resetColumnOrder,
  tableId,
  exportConfig,
  columnMapping,
  customToolbarComponent,
  searchValue,
  onSearchChange,
}: Omit<DataTableToolbarProps<TData>, 'totalSelectedItems' | 'deleteSelection'>) {
  const { t } = useTranslation();
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    table.getState().globalFilter ||
    (config.manualSearching && searchValue);

  // Check if the customToolbarComponent is ToolbarSections (has left/right/filterRow)
  const isToolbarSections =
    customToolbarComponent &&
    typeof customToolbarComponent === 'object' &&
    ('left' in customToolbarComponent ||
      'right' in customToolbarComponent ||
      'filterRow' in customToolbarComponent);

  const toolbarSections = isToolbarSections ? (customToolbarComponent as ToolbarSections) : null;

  // Common table controls component
  const TableControls = () => (
    <>
      {config.enableExport && getAllItems && exportConfig && (
        <DataTableExport<TData>
          table={table}
          data={getAllItems()}
          selectedData={[]}
          getSelectedItems={getSelectedItems}
          entityName={exportConfig.filename || exportConfig.entityName}
          columnMapping={exportConfig.columnMapping}
          columnWidths={exportConfig.columnWidths}
          headers={exportConfig.headers}
          size={config.size}
          transformData={exportConfig.transformData}
        />
      )}

      {/* Column visibility */}
      {config.enableColumnVisibility && (
        <DataTableViewOptions
          table={table}
          size={config.size}
          tableId={tableId}
          columnMapping={columnMapping}
        />
      )}

      {/* Table settings */}
      <TableSettings
        enableColumnResizing={config.enableColumnResizing}
        resetColumnSizing={resetColumnSizing}
        resetColumnOrder={resetColumnOrder}
        size={config.size}
      />
    </>
  );

  return (
    <div className="data-table-toolbar mb-2">
      {/* Desktop layouts */}
      <div className="toolbar-desktop hidden lg:block">
        {/* Row 1 - Main toolbar */}
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Search or Custom Left Section */}
          <div className="toolbar-left flex flex-1 items-center gap-2">
            {toolbarSections ? (
              // If ToolbarSections, render a left section
              toolbarSections.left
            ) : (
              // Default: Search
              <>
                {config.enableSearch && (
                  <SearchInput
                    placeholder={t('common.actions.search')}
                    value={
                      config.manualSearching
                        ? (searchValue ?? '')
                        : ((table.getState().globalFilter as string) ?? '')
                    }
                    onValueChange={value => {
                      if (config.manualSearching && onSearchChange) {
                        onSearchChange(value);
                      } else {
                        table.setGlobalFilter(value);
                      }
                    }}
                    className="w-full max-w-75"
                  />
                )}
                {/*/!* Clear filters *!/*/}
                {/*{!isFiltered && (*/}
                {/*  <Button*/}
                {/*    variant="ghost"*/}
                {/*    onClick={() => {*/}
                {/*      table.resetColumnFilters();*/}
                {/*      if (config.manualSearching && onSearchChange) {*/}
                {/*        onSearchChange('');*/}
                {/*      } else {*/}
                {/*        table.setGlobalFilter('');*/}
                {/*      }*/}
                {/*    }}*/}
                {/*    leftIcon={<X className="h-4 w-4" />}*/}
                {/*    hideIcon={false}*/}
                {/*    className="h-8 px-2"*/}
                {/*    aria-label={t('common.table.clearFilters')}*/}
                {/*  />*/}
                {/*)}*/}
              </>
            )}
          </div>

          {/* Right side - Actions or Custom Right Section */}
          <div className="toolbar-right flex items-center gap-2">
            {toolbarSections
              ? // If ToolbarSections, render the right section
                toolbarSections.right
              : !isToolbarSections && customToolbarComponent
                ? (customToolbarComponent as ReactNode)
                : null}

            <TableControls />
          </div>
        </div>

        {/* Row 2 - Filter row (if exists) */}
        {toolbarSections?.filterRow && (
          <div className="toolbar-filter-row">{toolbarSections.filterRow}</div>
        )}
      </div>

      {/* Mobile layouts */}
      <div className="toolbar-mobile flex flex-col gap-2 lg:hidden">
        {toolbarSections ? (
          // If ToolbarSections, render mobile stacked layouts
          <>
            {/* Row 1: Left section (search + filter icon) */}
            <div className="flex items-center gap-2">
              {toolbarSections.left && <div className="flex-1">{toolbarSections.left}</div>}
            </div>
            {/* Row 2: Right section (create task) + Table controls (export, column visibility, settings) */}
            <div className="flex items-center gap-2">
              {toolbarSections.right && (
                <div className="flex shrink-0 items-center gap-2">{toolbarSections.right}</div>
              )}
              <div className="flex shrink-0 items-center gap-2">
                <TableControls />
              </div>
            </div>
            {/* Row 3 - Filter row (if exists) */}
            {toolbarSections.filterRow && (
              <div className="toolbar-filter-row w-full">{toolbarSections.filterRow}</div>
            )}
          </>
        ) : (
          // Default mobile layouts
          <>
            {/* First row - Search and table controls */}
            <div className="flex flex-wrap items-center gap-2">
              {config.enableSearch && (
                <SearchInput
                  placeholder="Search..."
                  value={
                    config.manualSearching
                      ? (searchValue ?? '')
                      : ((table.getState().globalFilter as string) ?? '')
                  }
                  onValueChange={value => {
                    if (config.manualSearching && onSearchChange) {
                      onSearchChange(value);
                    } else {
                      table.setGlobalFilter(value);
                    }
                  }}
                  className="flex-1"
                  inputClassName="w-full"
                />
              )}

              {/* Clear filters */}
              {isFiltered && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    table.resetColumnFilters();
                    if (config.manualSearching && onSearchChange) {
                      onSearchChange('');
                    } else {
                      table.setGlobalFilter('');
                    }
                  }}
                  leftIcon={<X className="h-4 w-4" />}
                  hideIcon={false}
                  className="h-8 px-2"
                  aria-label={t('common.table.clearFilters')}
                />
              )}

              {/* Table controls */}
              <div className="flex shrink-0 items-center gap-2">
                <TableControls />
              </div>
            </div>

            {/* Second row - Custom toolbar component (full width) */}
            {!isToolbarSections && customToolbarComponent && (
              <div className="w-full">{customToolbarComponent as ReactNode}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
