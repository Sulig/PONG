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

const SignUpForm = () => {
  const { t } = useLanguage();
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError(t.signUp.allFieldsRequired);
      return;
    }

    if (password.length < 12) {
      setError(t.signUp.passwordMinLength);
      return;
    }

    setLoading(true);

    try {
      const res = await Auth.post('/register', {
        name: name.trim(),
        email: email.trim(),
        password,
      });
      setUser(res.data.user);
      navigate('/');
    } catch (err: unknown) {
      let errorMessage = t.signUp.registrationFailed;
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { data?: { message?: string } } }).response;
        errorMessage = response?.data?.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/50 transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <input
          type="text"
          placeholder={t.signUp.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
        <p className="text-xs text-text-muted mt-1.5 px-1">{t.signUp.nameComment}</p>
      </div>

      <div>
        <input
          type="email"
          placeholder={t.signUp.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        <p className="text-xs text-text-muted mt-1.5 px-1">{t.signUp.emailComment}</p>
      </div>

      <div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder={t.signUp.passwordPlaceholder}
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
        <p className="text-xs text-text-muted mt-1.5 px-1">{t.signUp.passwordComment}</p>
      </div>

      <Button type="submit" className="w-full py-3" disabled={loading}>
        {loading ? '...' : t.signUp.submit}
      </Button>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-text-muted text-sm">{t.signUp.orContinueWith}</span>
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
        {t.signUp.hasAccount}{' '}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-accent-purple hover:text-accent-blue transition-colors"
        >
          {t.logIn.signIn}
        </button>
      </p>
    </form>
  );
};

export default SignUpForm;
