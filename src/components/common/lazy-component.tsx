import { type ReactNode, Suspense } from 'react';
import { AppLoader } from '@/components/common/app-loader';

export function LazyComponent({ children }: { children: ReactNode }) {
  return <Suspense fallback={<AppLoader />}>{children}</Suspense>;
}
