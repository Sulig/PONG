import Header from '../components/Header';
import Footer from '../components/Footer';
import SignUpForm from '../components/SignUpForm';
import { useLanguage } from '../i18n/useLanguage';

const SignUp = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-purple via-accent-blue to-accent-cyan bg-clip-text text-transparent text-center mb-8">
            {t.header.signUp}
          </h1>
          <SignUpForm />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignUp;
