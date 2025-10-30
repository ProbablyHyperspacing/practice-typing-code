'use client';

import { Languages } from '@/types';

interface LanguageSelectorProps {
  languages: Languages;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export default function LanguageSelector({
  languages,
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Object.entries(languages).map(([key, language]) => (
        <button
          key={key}
          onClick={() => onLanguageChange(key)}
          className={`
            language-pill
            ${selectedLanguage === key ? 'language-pill-active' : ''}
            flex items-center gap-2
          `}
          style={{
            borderColor: selectedLanguage === key ? language.color : 'transparent',
          }}
        >
          <span
            className="text-lg"
            style={{ color: selectedLanguage === key ? '#1e1e1e' : language.color }}
          >
            {language.icon}
          </span>
          <span>{language.name}</span>
        </button>
      ))}
    </div>
  );
}