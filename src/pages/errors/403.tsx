import { IconArrowLeft, IconLogin, IconShieldOff } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';

export function ForbiddenPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10">
          <IconShieldOff className="h-10 w-10 text-destructive" />
        </div>

        <h1 className="mt-6 font-bold text-7xl text-foreground tracking-tighter">403</h1>

        <h2 className="mt-2 font-semibold text-foreground text-xl">
          {t('common.errors.forbidden.title')}
        </h2>

        <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
          {t('common.errors.forbidden.description')}
        </p>

        <div className="mt-8 flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="gap-2 rounded-xl px-5"
            size="lg"
          >
            <IconArrowLeft className="h-4 w-4" />
            {t('common.errors.forbidden.backHome')}
          </Button>

          <Button
            onClick={() => navigate('/auth/login')}
            className="gap-2 rounded-xl px-5"
            size="lg"
          >
            <IconLogin className="h-4 w-4" />
            {t('common.errors.forbidden.login')}
          </Button>
        </div>
      </div>
    </div>
  );
}
