interface CardProps {
  value: string | number;
  label: string;
  valueColor?: string;
  highlight?: boolean;
  dimmed?: boolean;
}

const Card = ({ value, label, valueColor, highlight, dimmed }: CardProps) => {
  const bg = highlight
    ? 'bg-accent-purple/10 border-accent-purple/30'
    : 'bg-white/5 border-white/10';

  return (
    <div className={`border rounded-xl p-4 text-center transition-colors ${bg} ${dimmed ? 'opacity-40' : ''}`}>
      <div className={`text-2xl font-bold ${valueColor || ''}`}>{value}</div>
      <div className="text-xs text-text-muted mt-1 font-medium">{label}</div>
    </div>
  );
};

export default Card;
