import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-8">
        <h1 className="text-center font-bold text-2xl">{t('auth.title')}</h1>
        <p className="text-center text-muted-foreground">{t('auth.subtitle')}</p>
        {/* LoginForm will be added later */}
      </div>
    </div>
  );
}
