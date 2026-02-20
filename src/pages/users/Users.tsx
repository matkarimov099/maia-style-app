import { lazy, Suspense } from 'react';

const UsersTable = lazy(() => import('@/features/users/components/users-table'));

export default function Users() {
  return (
    <Suspense>
      <UsersTable />
    </Suspense>
  );
}
