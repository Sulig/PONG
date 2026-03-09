import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SignUp from './routes/SignUp';
import LogIn from './routes/LogIn';
import Home from './routes/Home';
import Game from './routes/Game';
import Chat from './routes/Chat';
import TermsOfService from './routes/TermsOfService';
import PrivacyPolicy from './routes/PrivacyPolicy';
import Profile from './routes/Profile';
import Settings from './routes/Settings';
import Social from './routes/Social';
import { LanguageProvider } from './i18n/LanguageProvider';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { useLanguage } from './i18n/useLanguage';

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-accent-purple text-xl animate-pulse">{t.common.loading}</div>
      </div>
    );
  }

  return (
    <Routes key={location.key}>
      <Route path="/" element={<Home />} />
      <Route path="/signUp" element={user ? <Navigate to="/" /> : <SignUp />} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <LogIn />} />
      <Route path="/game" element={<Game />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/profile/:id" element={user ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
      <Route path="/social" element={user ? <Social /> : <Navigate to="/login" />} />
      <Route path="/tos" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
    </Routes>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <AppRoutes />
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
