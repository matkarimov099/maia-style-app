import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'uz', label: "O'zbekcha" },
  { code: 'ru', label: 'Русский' },
] as const;

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = useCallback(
    (lng: string) => {
      i18n.changeLanguage(lng);
      localStorage.setItem('lang', lng);
    },
    [i18n]
  );

  return (
    <div className="flex items-center gap-1">
      {LANGUAGES.map(lang => (
        <button
          key={lang.code}
          type="button"
          onClick={() => changeLanguage(lang.code)}
          className={`rounded-md px-2 py-1 font-medium text-xs transition-colors ${
            i18n.language === lang.code
              ? 'bg-primary text-white'
              : 'bg-muted text-muted-foreground hover:bg-accent'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
