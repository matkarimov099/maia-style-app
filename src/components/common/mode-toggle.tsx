import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-sm hover:bg-accent"
      title={t('theme.toggle')}
    >
      {theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '💻'}
    </button>
  );
}
