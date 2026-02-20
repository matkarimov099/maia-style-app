import { IconLogout, IconSearch } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { LanguageSwitcher } from '@/components/common/language-switcher';
import { ModeToggle } from '@/components/common/mode-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthContext } from '@/hooks/use-auth-context';

const PAGE_META: Record<string, { titleKey: string; descriptionKey: string }> = {
  '/dashboard': {
    titleKey: 'navigation.dashboard.title',
    descriptionKey: 'navigation.dashboard.description',
  },
  '/products': {
    titleKey: 'navigation.products.title',
    descriptionKey: 'navigation.products.description',
  },
  '/users': {
    titleKey: 'navigation.users.title',
    descriptionKey: 'navigation.users.description',
  },
  '/profile': {
    titleKey: 'navigation.profile.title',
    descriptionKey: 'navigation.profile.description',
  },
};

function usePageMeta() {
  const location = useLocation();
  const match = Object.keys(PAGE_META).find(
    path => location.pathname === path || location.pathname.startsWith(`${path}/`)
  );
  return match ? PAGE_META[match] : PAGE_META['/dashboard'];
}

export function AppHeader() {
  const { t } = useTranslation();
  const { authedUser, logout } = useAuthContext();
  const pageMeta = usePageMeta();

  return (
    <header className="shrink-0">
      {/* Top bar */}
      <div className="flex h-14 items-center gap-3 px-4 md:h-18 md:px-6 lg:px-8">
        {/* Mobile sidebar trigger */}
        <SidebarTrigger className="-ml-1 md:hidden [&_svg]:size-6!" />

        {/* Page title — desktop */}
        <div className="hidden min-w-0 flex-1 md:block">
          <h1 className="truncate font-bold text-xl tracking-tight">{t(pageMeta.titleKey)}</h1>
          <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
            {t(pageMeta.descriptionKey)}
          </p>
        </div>

        {/* Spacer — mobile */}
        <div className="min-w-0 flex-1 md:hidden" />

        {/* Search bar */}
        <div className="relative hidden w-full max-w-xs lg:block xl:max-w-sm">
          <IconSearch className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            placeholder={t('common.ui.searchPlaceholder')}
            className="h-10 w-full rounded-xl bg-card pr-4 pl-10 text-sm ring-1 ring-border/50 transition-all placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <LanguageSwitcher />
          <ModeToggle />

          {/* User profile + logout */}
          <div className="flex items-center gap-1.5 rounded-xl bg-card py-1.5 pr-1.5 pl-1.5 ring-1 ring-border/50 lg:gap-2 lg:pr-2 lg:pl-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xs md:h-9 md:w-9 md:text-sm">
                {authedUser?.firstname?.[0] ?? 'A'}
              </div>
              <div className="hidden min-w-0 text-left lg:block">
                <p className="truncate font-semibold text-sm leading-tight">
                  {authedUser ? `${authedUser.firstname} ${authedUser.lastname}` : 'Admin User'}
                </p>
                <p className="truncate text-muted-foreground text-xs leading-tight">
                  {authedUser?.username ?? 'admin@company.com'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive md:h-8 md:w-8"
              aria-label="Logout"
            >
              <IconLogout className="h-4 w-4 md:h-4.5 md:w-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile breadcrumb — page title + description */}
      <div className="px-4 pb-2 md:hidden">
        <h1 className="font-bold text-base">{t(pageMeta.titleKey)}</h1>
        <p className="text-muted-foreground text-xs">{t(pageMeta.descriptionKey)}</p>
      </div>
    </header>
  );
}
