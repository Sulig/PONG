import { useLanguage } from '../i18n/useLanguage';
import Card from './Card';
import type { StatsData } from '../types';

interface StatsGridProps {
  stats: StatsData;
}

const StatsGrid = ({ stats }: StatsGridProps) => {
  const { t } = useLanguage();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">{t.profile.stats}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card value={stats.gamesPlayed} label={t.profile.gamesPlayed} />
        <Card value={stats.wins} label={t.profile.wins} valueColor="text-green-400" />
        <Card value={stats.losses} label={t.profile.losses} valueColor="text-red-400" />
        <Card value={`#${stats.rank}`} label={t.profile.rank} valueColor="text-accent-purple" />
      </div>
    </div>
  );
};

export default StatsGrid;
