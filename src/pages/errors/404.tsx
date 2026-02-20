import { IconArrowLeft, IconFileUnknown } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
          <IconFileUnknown className="h-10 w-10 text-muted-foreground" />
        </div>

        <h1 className="mt-6 font-bold text-7xl text-foreground tracking-tighter">404</h1>

        <h2 className="mt-2 font-semibold text-foreground text-xl">
          {t('common.errors.notFound.title')}
        </h2>

        <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
          {t('common.errors.notFound.description')}
        </p>

        <Button
          onClick={() => navigate('/dashboard')}
          className="mt-8 gap-2 rounded-xl px-6"
          size="lg"
        >
          <IconArrowLeft className="h-4 w-4" />
          {t('common.errors.notFound.backHome')}
        </Button>
      </div>
    </div>
  );
}
