import { IconMoon, IconSun } from '@tabler/icons-react';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && systemIsDark);

  const toggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="relative flex h-10 w-[4.75rem] items-center rounded-full bg-muted p-1 transition-colors duration-300"
      aria-label="Toggle theme"
    >
      {/* Sliding indicator */}
      <span
        className={cn(
          'absolute h-8 w-8 rounded-full bg-background shadow-md transition-transform duration-300 ease-in-out',
          isDark ? 'translate-x-[calc(100%+2px)]' : 'translate-x-0'
        )}
      />
      {/* Sun */}
      <span
        className={cn(
          'relative z-10 flex h-8 w-8 items-center justify-center transition-colors duration-300',
          !isDark ? 'text-foreground' : 'text-muted-foreground/40'
        )}
      >
        <IconSun className="h-5 w-5" />
      </span>
      {/* Moon */}
      <span
        className={cn(
          'relative z-10 flex h-8 w-8 items-center justify-center transition-colors duration-300',
          isDark ? 'text-foreground' : 'text-muted-foreground/40'
        )}
      >
        <IconMoon className="h-5 w-5" />
      </span>
    </button>
  );
}
