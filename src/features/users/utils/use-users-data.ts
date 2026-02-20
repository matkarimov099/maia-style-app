import { useCallback, useState } from 'react';
import { useUserList } from '@/features/users/hooks/use-users';
import type { UserFilter } from '@/features/users/types';
import { useDebounce } from '@/hooks/use-debounce';

export function useUsersData() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<Array<{ id: string; desc: boolean }>>([]);

  const debouncedSearch = useDebounce(search, 300);

  const filter: UserFilter = {
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
  };

  const { users, total, isLoading, isFetching } = useUserList(filter);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleSortingChange = useCallback(
    (
      updaterOrValue:
        | Array<{ id: string; desc: boolean }>
        | ((prev: Array<{ id: string; desc: boolean }>) => Array<{ id: string; desc: boolean }>)
    ) => {
      setSorting(prev =>
        typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue
      );
    },
    []
  );

  return {
    users,
    total,
    isLoading,
    isFetching,
    page,
    pageSize,
    search,
    sorting,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleSortingChange,
  };
}
