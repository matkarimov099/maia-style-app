import { useTranslation } from 'react-i18next';
import { usePageTitle } from '@/hooks/use-page-title';

export default function Dashboard() {
  const { t } = useTranslation();
  usePageTitle(t('dashboard.title'));

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl">{t('dashboard.title')}</h1>
      <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
      {/* Dashboard widgets will be added later */}
    </div>
  );
}
