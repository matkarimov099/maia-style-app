import { useTranslation } from 'react-i18next';
import { usePageTitle } from '@/hooks/use-page-title';

export default function Users() {
  const { t } = useTranslation();
  usePageTitle(t('users.title'));

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl">{t('users.title')}</h1>
      <p className="text-muted-foreground">{t('users.subtitle')}</p>
      {/* Users table will be added later */}
    </div>
  );
}
