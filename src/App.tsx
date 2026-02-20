import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { useMediaQuery } from '@/hooks/use-media-query';
import { router } from '@/router';

function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  const isMobile = useMediaQuery('(max-width: 767px)');

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        richColors
        expand
        visibleToasts={8}
        closeButton
        position={isMobile ? 'top-center' : 'bottom-right'}
      />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export { App };
