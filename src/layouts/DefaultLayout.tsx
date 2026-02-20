import type { ReactNode } from 'react';

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar will be added later */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header will be added later */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
