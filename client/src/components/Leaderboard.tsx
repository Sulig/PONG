import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/useLanguage';
import { useAuth } from '../context/AuthContext';
import Matches from '../APIs/matches';
import type { LeaderboardEntry } from '../types';

const Leaderboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (user) {
      Matches.get('/leaderboard').then(res => setLeaderboard(res.data)).catch(() => {});
    }
  }, [user]);

  if (leaderboard.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mt-10">
      <h2 className="text-lg font-semibold mb-3">{t.home.leaderboard}</h2>
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-text-muted text-xs">
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">{t.home.name}</th>
              <th className="py-3 px-4 text-center">{t.home.level}</th>
              <th className="py-3 px-4 text-center">{t.home.wins}</th>
              <th className="py-3 px-4 text-right">{t.home.winRate}</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, i) => (
              <tr key={entry.userId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 text-text-muted font-medium">{i + 1}</td>
                <td className="py-3 px-4">
                  <Link to={`/profile/${entry.userId}`} className="flex items-center gap-2 hover:text-accent-purple transition-colors">
                    <img
                      src={entry.avatarUrl}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="font-medium">{entry.name}</span>
                  </Link>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-accent-purple/20 text-accent-purple text-xs">
                    {entry.level}
                  </span>
                </td>
                <td className="py-3 px-4 text-center text-green-400">{entry.wins}</td>
                <td className="py-3 px-4 text-right text-text-muted">{Math.round(entry.winRate * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
