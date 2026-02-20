import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/index.css';
import '@/i18n';
import { App } from '@/App';
import { AppLoader } from '@/components/common/app-loader';
import { PageTitleProvider } from '@/providers/page-title-provider';
import { ThemeProvider } from '@/providers/theme-provider';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <PageTitleProvider>
        <Suspense fallback={<AppLoader />}>
          <App />
        </Suspense>
      </PageTitleProvider>
    </ThemeProvider>
  </StrictMode>
);
