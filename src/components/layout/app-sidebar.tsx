import {
  IconHelp,
  IconLayoutDashboard,
  IconLogout,
  IconPackage,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuthContext } from '@/hooks/use-auth-context';

const menuItems = [
  {
    key: 'dashboard',
    path: '/dashboard',
    icon: IconLayoutDashboard,
    titleKey: 'navigation.dashboard.title',
  },
  {
    key: 'products',
    path: '/products',
    icon: IconPackage,
    titleKey: 'navigation.products.title',
  },
  {
    key: 'users',
    path: '/users',
    icon: IconUsers,
    titleKey: 'navigation.users.title',
  },
];

const otherItems = [
  {
    key: 'settings',
    path: '#',
    icon: IconSettings,
    titleKey: 'navigation.settings.title',
  },
  {
    key: 'help',
    path: '#',
    icon: IconHelp,
    titleKey: 'navigation.helpSupport.title',
  },
];

export function AppSidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <Sidebar variant="floating" collapsible="icon">
      {/* Logo */}
      <SidebarHeader className="p-5">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-sm">
            <IconLayoutDashboard className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="truncate font-bold text-[17px] tracking-tight group-data-[collapsible=icon]:hidden">
            {t('app.name')}
          </span>
        </button>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Main section */}
        <SidebarGroup>
          <SidebarGroupLabel className="mb-1 px-3 font-semibold text-[11px] text-muted-foreground/60 uppercase tracking-widest">
            {t('navigation.sidebar.main')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {menuItems.map(item => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                    tooltip={t(item.titleKey)}
                    className="h-10 gap-3 rounded-xl px-3 data-active:font-semibold [&_svg]:size-6"
                  >
                    <item.icon />
                    <span>{t(item.titleKey)}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Other section */}
        <SidebarGroup>
          <SidebarGroupLabel className="mb-1 px-3 font-semibold text-[11px] text-muted-foreground/60 uppercase tracking-widest">
            {t('navigation.sidebar.other')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {otherItems.map(item => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    isActive={isActive(item.path)}
                    tooltip={t(item.titleKey)}
                    className="h-10 gap-3 rounded-xl px-3 [&_svg]:size-6"
                  >
                    <item.icon />
                    <span>{t(item.titleKey)}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={logout}
                  tooltip={t('common.actions.logout')}
                  className="h-10 gap-3 rounded-xl px-3 [&_svg]:size-6"
                >
                  <IconLogout />
                  <span>{t('common.actions.logout')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Help card */}
      <SidebarFooter className="p-3 group-data-[collapsible=icon]:hidden">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/70 p-5 text-primary-foreground shadow-lg">
          <p className="font-bold text-[15px]">{t('navigation.sidebar.needHelp')}</p>
          <p className="mt-1.5 text-[13px] leading-snug opacity-80">
            {t('navigation.sidebar.contactSupport')}
          </p>
          <Button
            size="sm"
            className="mt-4 w-full rounded-xl bg-white font-semibold text-primary shadow-sm hover:bg-white/90"
          >
            {t('navigation.sidebar.getSupport')}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
