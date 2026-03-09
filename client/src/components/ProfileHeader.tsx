import { useLanguage } from '../i18n/useLanguage';
import type { ProfileData } from '../types';

const calculateXpThreshold = (level: number) => {
  let threshold = 200;
  for (let i = 1; i < level; i++) {
    threshold += (i + 1) * 100;
  }
  return threshold;
};

const calculatePrevThreshold = (level: number) => {
  if (level <= 1) return 0;
  let threshold = 200;
  for (let i = 1; i < level - 1; i++) {
    threshold += (i + 1) * 100;
  }
  return threshold;
};

const ProfileHeader = ({ profile }: { profile: ProfileData }) => {
  const { t } = useLanguage();

  const xpThreshold = calculateXpThreshold(profile.level);
  const prevThreshold = calculatePrevThreshold(profile.level);
  const xpInLevel = profile.xp - prevThreshold;
  const xpNeeded = xpThreshold - prevThreshold;
  const xpPercent = xpNeeded > 0 ? Math.min((xpInLevel / xpNeeded) * 100, 100) : 0;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-start gap-6">
        <img
          src={profile.avatarUrl}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover border-2 border-white/10"
        />

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <span className="px-2 py-0.5 rounded-full bg-accent-purple/20 text-accent-purple text-xs font-medium">
              {t.profile.level} {profile.level}
            </span>
          </div>
          <p className="text-text-muted text-sm mb-3">
            {profile.bio || t.profile.noBio}
          </p>

          {/* XP Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>{t.profile.xp}</span>
              <span>{xpInLevel} / {xpNeeded}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-purple to-accent-blue rounded-full transition-all"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
