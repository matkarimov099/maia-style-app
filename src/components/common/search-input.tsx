import { IconSearch, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  inputClassName?: string;
}

export function SearchInput({
  value = '',
  onValueChange,
  placeholder,
  debounceMs = 300,
  className,
  inputClassName,
}: SearchInputProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce(inputValue, debounceMs);

  useEffect(() => {
    onValueChange?.(debouncedValue);
  }, [debouncedValue, onValueChange]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className={cn('relative', className)}>
      <IconSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder={placeholder || t('common.ui.searchPlaceholder')}
        className={cn(
          'h-9 w-full rounded-lg border border-border/50 bg-card pr-8 pl-9 text-sm transition-all',
          'placeholder:text-muted-foreground/50',
          'focus:outline-none focus:ring-2 focus:ring-primary/30',
          inputClassName
        )}
      />
      {inputValue && (
        <button
          type="button"
          onClick={() => setInputValue('')}
          className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground/60 transition-colors hover:text-foreground"
        >
          <IconX className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
