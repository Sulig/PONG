interface PlayerOpponentBarProps {
  playerName: string;
  opponentName: string;
  playerScore: number;
  opponentScore: number;
  winPoints: number;
  paddle: 'LEFT' | 'RIGHT';
}

const PlayerOpponentBar = ({
  playerName,
  opponentName,
  playerScore,
  opponentScore,
  winPoints,
  paddle,
}: PlayerOpponentBarProps) => {
  const leftName = paddle === 'LEFT' ? playerName : opponentName;
  const rightName = paddle === 'RIGHT' ? playerName : opponentName;
  const leftScore = paddle === 'LEFT' ? playerScore : opponentScore;
  const rightScore = paddle === 'RIGHT' ? playerScore : opponentScore;

  return (
    <div className="w-full bg-white/5 py-3 px-6 flex justify-between items-center rounded-t-lg">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <span className="text-white font-medium text-sm">{leftName}</span>
        <span className="text-2xl font-bold text-white">{leftScore}</span>
      </div>

      {/* Center - score target */}
      <span className="text-xs text-text-muted">First to {winPoints}</span>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-white">{rightScore}</span>
        <span className="text-white font-medium text-sm">{rightName}</span>
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-lg">
          🎮
        </div>
      </div>
    </div>
  );
};

export default PlayerOpponentBar;
