import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/useLanguage';
import { useAuth } from '../context/AuthContext';
import Auth from '../APIs/auth';
import Button from './Button';
import GoogleIcon from './icons/GoogleIcon';
import OctocatIcon from './icons/OctocatIcon';
import EyeIcon from './icons/EyeIcon';
import EyeOffIcon from './icons/EyeOffIcon';

const LogInForm = () => {
  const { t } = useLanguage();
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError(t.logIn.emailPasswordRequired);
      return;
    }

    try {
      const res = await Auth.post('/login', { email, password });
      setUser(res.data.user);
      navigate('/');
    } catch (err: unknown) {
      let errorMessage = t.logIn.loginFailed;
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { data?: { message?: string } } }).response;
        errorMessage = response?.data?.message || errorMessage;
      }
      setError(errorMessage);
    }
  };

  const inputClass = 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/50 transition-colors';

  return (
    <form onSubmit={handleSignIn} className="space-y-5">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <input
        type="email"
        placeholder={t.logIn.emailPlaceholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputClass}
      />

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={t.logIn.passwordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${inputClass} pr-12`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
          tabIndex={-1}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      <Button type="submit" className="w-full py-3">
        {t.logIn.signIn}
      </Button>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-text-muted text-sm">{t.logIn.orContinueWith}</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`}
        >
          <OctocatIcon className="w-5 h-5" />
          <span className="text-sm">GitHub</span>
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`}
        >
          <GoogleIcon />
          <span className="text-sm">Google</span>
        </Button>
      </div>

      <p className="text-center text-sm text-text-muted">
        {t.logIn.noAccount}{' '}
        <button
          type="button"
          onClick={() => navigate('/signUp')}
          className="text-accent-purple hover:text-accent-blue transition-colors"
        >
          {t.logIn.signUp}
        </button>
      </p>
    </form>
  );
};

export default LogInForm;
