import { IconArrowBack, IconSettings } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TableSettingsProps {
  enableColumnResizing?: boolean;
  enableColumnOrdering?: boolean;
  size?: 'sm' | 'default' | 'lg';
  resetColumnSizing?: () => void;
  resetColumnOrder?: () => void;
  className?: string;
  children?: ReactNode;
}

export function TableSettings({
  enableColumnResizing = false,
  enableColumnOrdering = true,
  size = 'default',
  resetColumnSizing,
  resetColumnOrder,
  className,
}: TableSettingsProps) {
  const { t } = useTranslation();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={size === 'sm' ? 'icon-sm' : 'icon'}
          className={className}
          aria-label={t('common.table.settings', 'Open table settings')}
        >
          <IconSettings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="scroll-m-20 font-semibold text-base tracking-tight sm:text-lg md:text-xl">
              {t('common.table.settings', 'Table Settings')}
            </h4>
            <small className="font-medium text-muted-foreground text-xs leading-none sm:text-sm">
              {t('common.table.settingsDescription', 'Manage table layout and column settings')}
            </small>
          </div>
          <div className="grid gap-2">
            {enableColumnResizing && resetColumnSizing && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetColumnSizing}
                className="justify-start"
              >
                <IconArrowBack className="mr-2 h-4 w-4" />
                {t('common.table.resetColumnSizes', 'Reset Column Sizes')}
              </Button>
            )}
            {enableColumnOrdering && resetColumnOrder && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetColumnOrder}
                className="justify-start"
              >
                <IconArrowBack className="mr-2 h-4 w-4" />
                {t('common.table.resetColumnOrder', 'Reset Column Order')}
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
