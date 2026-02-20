import { useContext, useEffect } from 'react';
import { PageTitleContext } from '@/providers/page-title-provider';

export function usePageTitle(title?: string) {
  const context = useContext(PageTitleContext);

  useEffect(() => {
    if (title) {
      context.setTitle(title);
    }
  }, [title, context]);

  return context;
}
