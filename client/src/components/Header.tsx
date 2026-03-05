import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/useLanguage';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import MenuIcon from './icons/MenuIcon';
import CloseIcon from './icons/CloseIcon';

const Header = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    setMenuOpen(false);
    navigate(path + '?_=' + Date.now());
    window.scrollTo(0, 0);
  };

  const linkClass = 'block px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer';

  return (
    <>
      <header className="sticky top-0 z-40 bg-bg-primary">
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-accent-purple via-accent-blue to-accent-cyan bg-clip-text text-transparent tracking-tight">
            TRANSCENDENCE
          </Link>

          {user ? (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm px-3 py-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors"
              >
                {t.logIn.signIn}
              </Link>
              <Button to="/signUp">
                {t.header.signUp}
              </Button>
            </div>
          )}
        </div>
        <div className="h-px bg-gradient-to-r from-accent-purple via-accent-blue to-accent-cyan" />
      </header>

      {/* menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <nav
            className="absolute right-0 top-0 h-full w-64 bg-bg-primary border-l border-white/10 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <span className="text-sm font-medium text-text-primary">{t.header.menu}</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1 rounded text-text-secondary hover:text-text-primary transition-colors"
              >
                <CloseIcon />
              </button>
            </div>
            <div onClick={() => handleNav('/')} className={linkClass}>{t.header.home}</div>
            <div onClick={() => handleNav('/game')} className={linkClass}>{t.header.game}</div>
            <div onClick={() => handleNav('/chat')} className={linkClass}>{t.header.chat}</div>
            <div onClick={() => handleNav('/social')} className={linkClass}>{t.header.social}</div>
            <div onClick={() => handleNav('/profile')} className={linkClass}>{t.header.profile}</div>
            <div onClick={() => handleNav('/settings')} className={linkClass}>{t.header.settings}</div>
            <div className="mt-auto border-t border-white/10">
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors"
              >
                {t.footer.logout}
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
