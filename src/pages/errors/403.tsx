import { useTranslation } from 'react-i18next';

export function ForbiddenPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-bold text-6xl">403</h1>
      <p className="text-muted-foreground text-xl">{t('common.states.error')}</p>
      <a href="/dashboard" className="text-primary underline">
        {t('common.actions.back')}
      </a>
    </div>
  );
}
