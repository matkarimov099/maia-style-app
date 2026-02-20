import { useContext } from 'react';
import { PageTitleContext } from '@/providers/page-title-provider';

export const usePageTitle = () => useContext(PageTitleContext);
