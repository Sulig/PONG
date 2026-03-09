import { useLanguage } from '../i18n/useLanguage';
import Card from './Card';
import type { StatsData } from '../types';

const ALL_ACHIEVEMENTS = ['first_game', 'first_win', 'perfect_game', 'five_games'];

interface AchievementsProps {
  stats: StatsData;
}

const Achievements = ({ stats }: AchievementsProps) => {
  const { t } = useLanguage();

  const achievementLabels: Record<string, string> = {
    first_game: t.profile.firstGame,
    first_win: t.profile.firstWin,
    perfect_game: t.profile.perfectGame,
    five_games: t.profile.fiveGames,
  };

  const unlockedTypes = new Set(stats.achievements.map(a => a.type));

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">{t.profile.achievements}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ALL_ACHIEVEMENTS.map(type => {
          const unlocked = unlockedTypes.has(type);
          return (
            <Card
              key={type}
              value={unlocked ? '✓' : '✗'}
              label={achievementLabels[type]}
              highlight={unlocked}
              dimmed={!unlocked}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
