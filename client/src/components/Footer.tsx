import { useLanguage } from '../i18n/useLanguage';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';

interface FooterProps {
  showTOS?: boolean;
  showPrivacy?: boolean;
}

const Footer = ({ showTOS = true, showPrivacy = true }: FooterProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const linkClass = 'text-sm text-text-muted hover:text-text-primary transition-colors';

  return (
    <footer className="mt-auto">
      <div className="h-px bg-gradient-to-r from-accent-purple via-accent-blue to-accent-cyan" />
      <div className="bg-bg-primary px-6 py-4 flex flex-wrap items-center justify-end gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {showTOS && (
            <button onClick={() => navigate('/tos')} className={linkClass}>
              {t.footer.termsOfService}
            </button>
          )}
          {showPrivacy && (
            <button onClick={() => navigate('/privacy')} className={linkClass}>
              {t.footer.privacyPolicy}
            </button>
          )}
          <LanguageSelector />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
