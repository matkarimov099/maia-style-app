// Export config types
import type { ReactNode } from 'react';

export interface ExportConfig<TData = unknown> {
  filename?: string;
  entityName?: string;
  sheetName?: string;
  columnMapping?: Record<string, string>;
  columnWidths?: Array<{ wch: number }>;
  headers?: string[];
  // Transform data before export - converts complex objects to flat exportable format
  transformData?: (data: TData[]) => Record<string, unknown>[];
}

// Toolbar renders function types
export interface ToolbarRenderProps<T> {
  selectedRows: T[];
  allSelectedIds: (string | number)[];
  totalSelectedCount: number;
  resetSelection: () => void;
}

// Toolbar sections for left/right layouts
export interface ToolbarSections {
  left?: ReactNode;
  right?: ReactNode;
  filterRow?: ReactNode;
}
