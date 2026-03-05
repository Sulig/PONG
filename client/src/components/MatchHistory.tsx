import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/useLanguage';
import Matches from '../APIs/matches';
import type { Match } from '../types';

const MatchHistory = ({ userId }: { userId: number }) => {
  const { t } = useLanguage();
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    Matches.get(`/history/${userId}`).then(res => setMatches(res.data)).catch(() => {});
  }, [userId]);

  if (matches.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-2">{t.profile.matchHistory}</h2>
        <p className="text-text-muted text-sm">{t.profile.noMatches}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <h2 className="text-lg font-semibold px-4 pt-4 pb-2">{t.profile.matchHistory}</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-text-muted text-xs">
            <th className="py-3 px-4 text-left">{t.profile.opponent}</th>
            <th className="py-3 px-4 text-center">{t.profile.score}</th>
            <th className="py-3 px-4 text-center">{t.profile.result}</th>
            <th className="py-3 px-4 text-right">{t.profile.date}</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(m => {
            const won = m.userScore > m.opponentScore;
            const opponent = m.playMode === 'AI' ? `AI (${m.aiLevel})` : (m.guestName || 'Guest');
            const date = m.completedAt ? new Date(m.completedAt).toLocaleDateString() : '';

            return (
              <tr key={m.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 px-4">{opponent}</td>
                <td className="py-3 px-4 text-center font-medium">{m.userScore} - {m.opponentScore}</td>
                <td className="py-3 px-4 text-center">
                  <span className={won ? 'text-green-400' : 'text-red-400'}>
                    {won ? t.profile.win : t.profile.loss}
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-text-muted">{date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MatchHistory;
