import { lazy, Suspense } from 'react';

const UsersTable = lazy(() => import('@/features/users/components/UsersTable'));

export default function Users() {
  return (
    <Suspense>
      <UsersTable />
    </Suspense>
  );
}
