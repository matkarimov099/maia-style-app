import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({
  value = '',
  onChange,
  placeholder,
  debounceMs = 300,
  className = '',
}: SearchInputProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce(inputValue, debounceMs);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <input
      type="text"
      value={inputValue}
      onChange={e => setInputValue(e.target.value)}
      placeholder={placeholder || t('common.ui.searchPlaceholder')}
      className={`h-9 w-full rounded-md border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
    />
  );
}
