import Header from '../components/Header';
import Footer from '../components/Footer';
import Leaderboard from '../components/Leaderboard';
import Button from '../components/Button';
import { useLanguage } from '../i18n/useLanguage';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-8">
        {user ? (
          <>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-accent-purple via-accent-blue to-accent-cyan bg-clip-text text-transparent text-center">
              {t.home.welcome}, {user.name}!
            </h1>
            <Button to="/game" className="mt-6 px-8 py-3">
              {t.home.newGame}
            </Button>

            <div className="flex gap-3 mt-4">
              <Button variant="secondary" to="/profile">
                {t.header.profile}
              </Button>
              <Button variant="secondary" to="/chat">
                {t.header.chat}
              </Button>
              <Button variant="secondary" to="/social">
                {t.header.social}
              </Button>
              <Button variant="secondary" to="/settings">
                {t.header.settings}
              </Button>
            </div>

            <Leaderboard />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-accent-purple via-accent-blue to-accent-cyan bg-clip-text text-transparent tracking-tight">
              TRANSCENDENCE
            </h1>

            <div className="flex gap-4 mt-4">
              <Button variant="outline" to="/login" className="px-8 py-3">
                {t.logIn.signIn}
              </Button>
              <Button to="/signUp" className="px-8 py-3">
                {t.header.signUp}
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
