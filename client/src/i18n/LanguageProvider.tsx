import { useState } from 'react';
import type { ReactNode } from 'react';
import { LanguageContext } from './LanguageContext';
import type { LanguageContextType } from './LanguageContext';
import { translations } from './translations';
import type { Language } from './translations';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const value: LanguageContextType = {
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
