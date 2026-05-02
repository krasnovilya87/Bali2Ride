import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, translations, Translations } from './i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0] as Language;
  const supportedLanguages: Language[] = [
    'en', 'ru', 'id', 'zh', 'de', 'es', 'fr', 'pt', 'ja', 'ko',
    'it', 'tr', 'vi', 'th', 'pl', 'nl', 'hi', 'ar', 'bn', 'ms'
  ];
  return supportedLanguages.includes(browserLang) ? browserLang : 'en';
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage());

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
