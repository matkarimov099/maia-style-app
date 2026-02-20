import { DataTable } from '@/components/data-table/data-table';
import type { User } from '@/features/users/types';
import { usersTableConfig } from '../utils/table-config';
import { useUsersData } from '../utils/use-users-data';
import { getColumns } from './columns';
import { CreateUserDialog } from './create-user-dialog';

export default function UsersTable() {
  const {
    users,
    total,
    isLoading,
    page,
    pageSize,
    search,
    sorting,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleSortingChange,
  } = useUsersData();

  return (
    <DataTable<User>
      config={usersTableConfig}
      getColumns={getColumns}
      data={users}
      totalItems={total}
      idField="id"
      isLoading={isLoading}
      currentPage={page}
      pageSize={pageSize}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      sorting={sorting}
      onSortingChange={handleSortingChange}
      searchValue={search}
      onSearchChange={handleSearchChange}
      renderToolbarContent={() => ({
        right: <CreateUserDialog />,
      })}
    />
  );
}
