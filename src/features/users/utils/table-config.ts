import type { TableConfig } from '@/components/data-table/utils/table-config';

export const usersTableConfig: Partial<TableConfig> = {
  enableRowSelection: false,
  enableSearch: true,
  enablePagination: true,
  enableExport: false,
  enableColumnResizing: true,
  enableColumnVisibility: true,
  enableToolbar: true,
  columnResizingTableId: 'users-table',
  manualPagination: true,
  manualSorting: true,
  manualFiltering: true,
  manualSearching: true,
};
