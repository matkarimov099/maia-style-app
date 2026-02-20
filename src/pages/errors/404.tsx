import { useTranslation } from 'react-i18next';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-bold text-6xl">404</h1>
      <p className="text-muted-foreground text-xl">{t('common.ui.noResults')}</p>
      <a href="/dashboard" className="text-primary underline">
        {t('common.actions.back')}
      </a>
    </div>
  );
}
