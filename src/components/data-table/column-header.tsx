import { IconArrowDown, IconArrowUp, IconEyeOff, IconSelector } from '@tabler/icons-react';
import type { Column } from '@tanstack/react-table';
import type { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface DataTableColumnHeaderProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { t } = useTranslation();

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  // Get the current sort direction for this column
  const currentDirection = column.getIsSorted();

  // Use direct method to set sort with an explicit direction
  const setSorting = (direction: 'asc' | 'desc' | false) => {
    // If we're clearing a sort, use an empty array
    if (direction === false) {
      column.toggleSorting(undefined, false);
      return;
    }

    // Set explicit sort with the direction
    // The second param (false) prevents multi-sort
    column.toggleSorting(direction === 'desc', false);
  };

  return (
    <div className={cn('flex items-center space-x-2 py-0.5', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-fit text-foreground transition-colors duration-200 hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary data-[state=open]:bg-primary/10"
          >
            <span>{title}</span>
            {currentDirection === 'desc' ? (
              <IconArrowDown className="ml-2 h-4 w-4" />
            ) : currentDirection === 'asc' ? (
              <IconArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <IconSelector className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setSorting('asc')}>
            <IconArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            {t('common.ui.asc')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSorting('desc')}>
            <IconArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            {t('common.ui.desc')}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <IconEyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            {t('common.actions.hide')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
