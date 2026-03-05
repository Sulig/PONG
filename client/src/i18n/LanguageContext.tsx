import { createContext } from 'react';
import type { Language, TranslationKey } from './translations';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKey;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

