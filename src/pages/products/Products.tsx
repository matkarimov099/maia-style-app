import { useTranslation } from 'react-i18next';

export default function Products() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl">{t('products.title')}</h1>
      <p className="text-muted-foreground">{t('products.subtitle')}</p>
    </div>
  );
}
