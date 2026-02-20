import { useTranslation } from 'react-i18next';
import { usePageTitle } from '@/hooks/use-page-title';

export default function Products() {
  const { t } = useTranslation();
  usePageTitle(t('products.title'));

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl">{t('products.title')}</h1>
      <p className="text-muted-foreground">{t('products.subtitle')}</p>
      {/* Products table will be added later */}
    </div>
  );
}
