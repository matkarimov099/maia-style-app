import type { Table } from '@tanstack/react-table';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const getButtonSizeClass = (size: 'sm' | 'default' | 'lg') => {
  switch (size) {
    case 'sm':
      return 'h-7 w-7 p-0';
    case 'lg':
      return 'h-11 w-11 p-0';
    default:
      return 'h-8 w-8 p-0';
  }
};

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalItems?: number; // Total number of items from API
  totalSelectedItems?: number; // Totally selected items across all pages
  pageSizeOptions?: number[]; // Custom page size options
  size?: 'sm' | 'default' | 'lg'; // Size prop for components
}

export function DataTablePagination<TData>({
  table,
  totalItems = 0,
  totalSelectedItems = 0,
  pageSizeOptions = [10, 20, 30, 40, 50], // Default options if none provided
  size = 'default',
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation();
  // Convert 'lg' size to 'default' for SelectTrigger since it only accepts 'sm' | 'default'
  const selectSize = size === 'lg' ? 'default' : size;

  return (
    <div className="mt-2 flex w-full flex-col items-center justify-between gap-4 overflow-auto rounded-md border border-border/50 bg-background/90 px-4 py-3 shadow-sm saturate-[150%] backdrop-blur-md sm:flex-row sm:gap-8">
      <div className="flex-1 text-muted-foreground text-sm">
        {t('common.pagination.showing')} {totalSelectedItems} {t('common.pagination.of_total')}{' '}
        {totalItems} {t('common.pagination.items')}
      </div>
      <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4 lg:gap-6">
        <div className="flex items-center space-x-2" data-slot="pagination-select">
          <small className="hidden whitespace-nowrap font-medium text-foreground leading-none sm:block">
            {t('common.pagination.per_page')}
          </small>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={value => {
              // Force URL update via direct window manipulation first
              // This ensures the URL gets updated before the table state changes
              const url = new URL(window.location.href);
              url.searchParams.set('pageSize', value);
              url.searchParams.set('page', '1'); // Always reset to page 1
              window.history.replaceState({}, '', url.toString());

              // Then use the table's pagination change handler to update the table state
              // This order ensures the URL is already set when the table state updates
              table.setPagination({
                pageIndex: 0, // Reset to the first page
                pageSize: Number(value),
              });
            }}
          >
            <SelectTrigger
              className="w-fit cursor-pointer"
              size={selectSize === 'sm' ? 'sm' : 'md'}
              aria-label={t('common.pagination.selectPage')}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top" className="cursor-pointer">
              {pageSizeOptions.map(pageSize => (
                <SelectItem key={pageSize} value={`${pageSize}`} className="cursor-pointer">
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center font-medium text-foreground text-sm">
          {t('common.pagination.page')} {table.getState().pagination.pageIndex + 1}{' '}
          {t('common.pagination.of')} {table.getPageCount() || 1}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            aria-label={t('common.pagination.first')}
            variant="outline"
            className={`${getButtonSizeClass(size)} hidden cursor-pointer lg:flex`}
            onClick={() =>
              table.setPagination({
                pageIndex: 0,
                pageSize: table.getState().pagination.pageSize,
              })
            }
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeftIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label={t('common.pagination.previous')}
            variant="outline"
            className={`${getButtonSizeClass(size)} cursor-pointer`}
            onClick={() =>
              table.setPagination({
                pageIndex: table.getState().pagination.pageIndex - 1,
                pageSize: table.getState().pagination.pageSize,
              })
            }
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label={t('common.pagination.next')}
            variant="outline"
            className={`${getButtonSizeClass(size)} cursor-pointer`}
            onClick={() =>
              table.setPagination({
                pageIndex: table.getState().pagination.pageIndex + 1,
                pageSize: table.getState().pagination.pageSize,
              })
            }
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label={t('common.pagination.last')}
            variant="outline"
            className={`${getButtonSizeClass(size)} hidden cursor-pointer lg:flex`}
            onClick={() =>
              table.setPagination({
                pageIndex: table.getPageCount() - 1,
                pageSize: table.getState().pagination.pageSize,
              })
            }
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRightIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
