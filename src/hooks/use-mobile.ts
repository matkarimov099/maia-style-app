import { useMediaQuery } from '@/hooks/use-media-query';

export function useMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}
