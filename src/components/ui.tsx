import type { ReactNode } from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export function Logo({ size = 44 }: { size?: number }) {
  return (
    <div
      className="relative grid place-items-center overflow-hidden rounded-2xl ring-1 ring-neon-500/40 shadow-neonSoft"
      style={{ width: size, height: size }}
    >
      <img src="/icon.svg" alt="Комісар ШІ" width={size} height={size} className="h-full w-full object-cover" />
    </div>
  );
}

export function StatusBadge({ isPro }: { isPro: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wider ${
        isPro
          ? 'bg-neon-500/15 text-neon-400 ring-1 ring-neon-500/40'
          : 'bg-ink-700/60 text-slate-300 ring-1 ring-white/10'
      }`}
    >
      {isPro ? <ShieldCheck size={13} /> : <ShieldAlert size={13} />}
      {isPro ? 'PRO' : 'FREE'}
    </span>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-2xl border border-white/5 p-4 ${className}`}>{children}</div>
  );
}

export function SectionTitle({ icon, title, hint }: { icon?: ReactNode; title: string; hint?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
        {icon}
        {title}
      </h2>
      {hint && <span className="text-[11px] text-slate-500">{hint}</span>}
    </div>
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  sublabel?: string;
  accent?: 'neon' | 'amber' | 'alarm';
  icon?: ReactNode;
}

export function Toggle({ checked, onChange, label, sublabel, accent = 'neon', icon }: ToggleProps) {
  const accentOn =
    accent === 'neon'
      ? 'bg-neon-500 shadow-neonSoft'
      : accent === 'amber'
        ? 'bg-amber-500 shadow-amber'
        : 'bg-alarm-500 shadow-alarm';
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-ink-800/60 px-3 py-2.5 text-left transition active:scale-[0.99]"
    >
      {icon && <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink-700/70 text-slate-300">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-slate-100">{label}</span>
        {sublabel && <span className="block truncate text-[11px] text-slate-500">{sublabel}</span>}
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? accentOn : 'bg-ink-600'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  );
}

export function NeonButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'danger' | 'amber';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  const styles = {
    primary: 'bg-neon-500 text-ink-950 shadow-neon hover:bg-neon-400',
    ghost: 'bg-ink-700/60 text-slate-100 ring-1 ring-white/10 hover:bg-ink-700',
    danger: 'bg-alarm-500 text-white shadow-alarm hover:bg-alarm-600',
    amber: 'bg-amber-500 text-ink-950 shadow-amber hover:bg-amber-400',
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Tag({ text, tone = 'neutral' }: { text: string; tone?: 'neutral' | 'alarm' | 'amber' | 'neon' }) {
  const tones = {
    neutral: 'bg-ink-700/70 text-slate-300 ring-1 ring-white/10',
    alarm: 'bg-alarm-500/15 text-alarm-400 ring-1 ring-alarm-500/40',
    amber: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/40',
    neon: 'bg-neon-500/15 text-neon-400 ring-1 ring-neon-500/40',
  }[tone];
  return <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${tones}`}>#{text}</span>;
}
