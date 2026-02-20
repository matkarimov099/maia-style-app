import { createContext, type ReactNode, useCallback, useEffect, useState } from 'react';

interface PageTitleContextType {
  title: string;
  setTitle: (title: string) => void;
}

const PageTitleContext = createContext<PageTitleContextType>({
  title: '',
  setTitle: () => null,
});

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitleState] = useState('');

  const setTitle = useCallback((newTitle: string) => {
    setTitleState(newTitle);
  }, []);

  useEffect(() => {
    document.title = title ? `${title} | Admin Dashboard` : 'Admin Dashboard';
  }, [title]);

  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>{children}</PageTitleContext.Provider>
  );
}

export { PageTitleContext };
