import { useTranslation } from 'react-i18next';
import { usePageTitle } from '@/hooks/use-page-title';

export default function Profile() {
  const { t } = useTranslation();
  usePageTitle(t('profile.title'));

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl">{t('profile.title')}</h1>
      <p className="text-muted-foreground">{t('profile.subtitle')}</p>
      {/* Profile form will be added later */}
    </div>
  );
}
