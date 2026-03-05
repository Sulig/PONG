import { Link } from 'react-router-dom';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

const styles = {
  primary: 'bg-gradient-to-r from-accent-purple to-accent-blue text-bg-primary hover:opacity-90 disabled:opacity-50',
  secondary: 'border border-white/10 text-text-secondary hover:bg-white/10',
  outline: 'border border-accent-purple/30 text-accent-purple hover:bg-accent-purple/10',
  danger: 'text-red-400 border border-red-400/20 hover:bg-red-400/10',
  ghost: 'bg-accent-purple/20 text-accent-purple hover:bg-accent-purple/30',
};

type Props = {
  variant?: keyof typeof styles;
  to?: string;
  className?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ variant = 'primary', to, className = '', children, ...rest }: Props) => {
  const cls = `px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors ${styles[variant]} ${className}`;

  if (to) return <Link to={to} className={cls}>{children}</Link>;
  return <button className={cls} {...rest}>{children}</button>;
};

export default Button;
