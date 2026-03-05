import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/useLanguage';
import type { Language } from '../i18n/translations';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const languages: { code: Language; name: string }[] = [
    { code: 'es', name: 'Castellano' },
    { code: 'ca', name: 'Catala' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Francais' },
    { code: 'it', name: 'Italiano' },
    { code: 'pl', name: 'Polski' },
  ];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const current = languages.find(l => l.code === language)?.name || 'English';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="text-sm px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors"
      >
        {current}
      </button>
      {open && (
        <div className="absolute right-0 bottom-full mb-2 w-40 bg-white/5 border border-white/10 rounded-xl py-1 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                lang.code === language
                  ? 'text-accent-purple bg-accent-purple/10'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/10'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
