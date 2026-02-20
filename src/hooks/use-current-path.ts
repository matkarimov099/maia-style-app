import { useLocation } from 'react-router';

export function useCurrentPath(): string {
  return useLocation().pathname;
}
