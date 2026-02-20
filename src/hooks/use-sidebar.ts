import { useCallback, useState } from 'react';

const SIDEBAR_KEY = 'sidebar-collapsed';

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem(SIDEBAR_KEY) === 'true';
  });

  const toggle = useCallback(() => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_KEY, String(next));
      return next;
    });
  }, []);

  const collapse = useCallback(() => {
    setIsCollapsed(true);
    localStorage.setItem(SIDEBAR_KEY, 'true');
  }, []);

  const expand = useCallback(() => {
    setIsCollapsed(false);
    localStorage.setItem(SIDEBAR_KEY, 'false');
  }, []);

  return { isCollapsed, toggle, collapse, expand };
}
