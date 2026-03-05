import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileHeader from '../components/ProfileHeader';
import StatsGrid from '../components/StatsGrid';
import Achievements from '../components/Achievements';
import MatchHistory from '../components/MatchHistory';
import { useLanguage } from '../i18n/useLanguage';
import { useAuth } from '../context/AuthContext';
import ProfileAPI from '../APIs/profile';
import Matches from '../APIs/matches';
import type { ProfileData, StatsData } from '../types';

const Profile = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { id } = useParams<{ id?: string }>();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    if (id && (!user || String(user.id) !== id)) {
      ProfileAPI.get(`/${id}`).then(res => setProfile(res.data)).catch(() => {});
      Matches.get(`/stats/${id}`).then(res => setStats(res.data)).catch(() => {});
    } else {
      ProfileAPI.get('/me', { withCredentials: true }).then(res => setProfile(res.data)).catch(() => {});
      if (user) {
        Matches.get(`/stats/${user.id}`).then(res => setStats(res.data)).catch(() => {});
      }
    }
  }, [user, id]);

  if (!profile || !stats) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-accent-purple text-xl animate-pulse">{t.common.loading}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
      <Header />

      <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 md:py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <ProfileHeader profile={profile} />
          <StatsGrid stats={stats} />
          <Achievements stats={stats} />
          <MatchHistory userId={profile.userId} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
