import type { ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/features/products/types';
import { RowActions } from './RowActions';

function getCategoryBadgeVariant(category: string): 'default' | 'secondary' | 'outline' {
  switch (category) {
    case 'ELECTRONICS':
      return 'default';
    case 'CLOTHING':
      return 'secondary';
    default:
      return 'outline';
  }
}

function getStatusBadgeVariant(
  status: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'ACTIVE':
      return 'default';
    case 'DRAFT':
      return 'secondary';
    case 'ARCHIVED':
      return 'destructive';
    default:
      return 'outline';
  }
}

export function getColumns(
  _handleRowDeselection: ((rowId: string) => void) | null | undefined,
  t: TFunction
): ColumnDef<Product>[] {
  return [
    {
      id: 'index',
      header: t('products.table.columns.index'),
      cell: ({ row }) => <span className="text-muted-foreground">{row.index + 1}</span>,
      size: 60,
      enableSorting: false,
      enableResizing: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('products.table.columns.name')} />
      ),
      cell: ({ row }) => (
        <span className="truncate font-medium text-sm">{row.getValue('name')}</span>
      ),
      size: 220,
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('products.table.columns.price')} />
      ),
      cell: ({ row }) => {
        const price = row.getValue('price') as number;
        return (
          <span className="font-medium text-sm tabular-nums">
            {price?.toLocaleString('uz-UZ', { minimumFractionDigits: 0 })}
          </span>
        );
      },
      size: 140,
    },
    {
      accessorKey: 'category',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('products.table.columns.category')} />
      ),
      cell: ({ row }) => {
        const category = row.getValue('category') as string;
        return (
          <Badge variant={getCategoryBadgeVariant(category)}>
            {t(`enums.productCategory.${category}`)}
          </Badge>
        );
      },
      size: 150,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('products.table.columns.status')} />
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge variant={getStatusBadgeVariant(status)}>
            {t(`enums.productStatus.${status}`)}
          </Badge>
        );
      },
      size: 120,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('products.table.columns.createdAt')} />
      ),
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as string;
        return (
          <span className="text-muted-foreground">
            {date ? new Date(date).toLocaleDateString() : '—'}
          </span>
        );
      },
      size: 140,
    },
    {
      id: 'actions',
      header: t('products.table.columns.actions'),
      cell: ({ row }) => <RowActions product={row.original} />,
      size: 80,
      enableSorting: false,
      enableResizing: false,
    },
  ];
}
