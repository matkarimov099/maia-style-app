import { usePageTitle } from '@/hooks/use-page-title';

export function PageTitle() {
  const { title } = usePageTitle();

  if (!title) return null;

  return (
    <div className="flex items-center gap-2">
      <h1 className="font-semibold text-lg">{title}</h1>
    </div>
  );
}
