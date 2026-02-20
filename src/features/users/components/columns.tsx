import type { ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/features/users/types';
import { RowActions } from './RowActions';

function getRoleBadgeVariant(role: string): 'default' | 'secondary' | 'outline' {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'default';
    case 'ADMIN':
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
    case 'INACTIVE':
      return 'secondary';
    case 'DELETED':
      return 'destructive';
    default:
      return 'outline';
  }
}

export function getColumns(
  _handleRowDeselection: ((rowId: string) => void) | null | undefined,
  t: TFunction
): ColumnDef<User>[] {
  return [
    {
      id: 'index',
      header: t('users.table.columns.index'),
      cell: ({ row }) => <span className="text-muted-foreground">{row.index + 1}</span>,
      size: 60,
      enableSorting: false,
      enableResizing: false,
    },
    {
      accessorKey: 'firstname',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('users.table.columns.fullName')} />
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
              {user.firstname?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-sm">
                {user.firstname} {user.lastname}
              </p>
            </div>
          </div>
        );
      },
      size: 220,
    },
    {
      accessorKey: 'username',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('users.table.columns.username')} />
      ),
      cell: ({ row }) => <span className="text-muted-foreground">{row.getValue('username')}</span>,
      size: 160,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('users.table.columns.email')} />
      ),
      cell: ({ row }) => (
        <span className="truncate text-muted-foreground">{row.getValue('email')}</span>
      ),
      size: 220,
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('users.table.columns.role')} />
      ),
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        return <Badge variant={getRoleBadgeVariant(role)}>{t(`enums.role.${role}`)}</Badge>;
      },
      size: 130,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('users.table.columns.status')} />
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge variant={getStatusBadgeVariant(status)}>{t(`enums.userStatus.${status}`)}</Badge>
        );
      },
      size: 120,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('users.table.columns.createdAt')} />
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
      header: t('users.table.columns.actions'),
      cell: ({ row }) => <RowActions user={row.original} />,
      size: 80,
      enableSorting: false,
      enableResizing: false,
    },
  ];
}
