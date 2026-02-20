import { Outlet } from 'react-router';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function DefaultLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider className="bg-muted/30">
        <AppSidebar />
        <SidebarInset className="h-screen overflow-hidden bg-transparent">
          <AppHeader />
          <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden p-4 md:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
