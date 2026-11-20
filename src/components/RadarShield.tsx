import { Shield, ShieldOff, Radar } from 'lucide-react';
import { useProtection } from '../context/ProtectionContext';

export function RadarShield() {
  const { shieldActive, toggleShield } = useProtection();

  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[260px] flex-col items-center justify-center">
      {/* concentric rings */}
      <div className="absolute inset-0 rounded-full border border-neon-500/15" />
      <div className="absolute inset-[12%] rounded-full border border-neon-500/20" />
      <div className="absolute inset-[26%] rounded-full border border-neon-500/25" />
      <div className="absolute inset-[40%] rounded-full border border-neon-500/30" />

      {/* radar sweep */}
      {shieldActive && (
        <div
          className="absolute inset-[12%] rounded-full animate-radar-sweep"
          style={{
            background:
              'conic-gradient(from 0deg, rgba(0,229,255,0.35) 0deg, rgba(0,229,255,0) 60deg, rgba(0,229,255,0) 360deg)',
            maskImage: 'radial-gradient(circle, black 60%, transparent 60%)',
            WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 60%)',
          }}
        />
      )}

      {/* ping rings */}
      {shieldActive && (
        <>
          <span className="absolute h-24 w-24 rounded-full border-2 border-neon-500/60 animate-ping-ring" />
          <span
            className="absolute h-24 w-24 rounded-full border-2 border-neon-500/60 animate-ping-ring"
            style={{ animationDelay: '1.2s' }}
          />
        </>
      )}

      {/* center button */}
      <button
        type="button"
        onClick={toggleShield}
        className={`relative z-10 flex h-[46%] w-[46%] flex-col items-center justify-center rounded-full border-2 transition-all active:scale-95 ${
          shieldActive
            ? 'border-neon-500 bg-neon-500/15 shadow-neon'
            : 'border-ink-600 bg-ink-800/80'
        }`}
        aria-pressed={shieldActive}
      >
        {shieldActive ? (
          <Shield className="text-neon-500" size={42} strokeWidth={2.2} />
        ) : (
          <ShieldOff className="text-slate-500" size={42} strokeWidth={2} />
        )}
        <span
          className={`mt-1 text-[10px] font-bold uppercase tracking-wider ${
            shieldActive ? 'text-neon-400' : 'text-slate-400'
          }`}
        >
          {shieldActive ? 'Щит активний' : 'Захист вимкнено'}
        </span>
      </button>

      {/* status caption */}
      <div className="absolute -bottom-1 flex items-center gap-1.5 rounded-full bg-ink-850/90 px-3 py-1 text-[11px] ring-1 ring-white/10">
        <Radar size={12} className={shieldActive ? 'text-neon-500' : 'text-slate-500'} />
        <span className={shieldActive ? 'text-neon-400' : 'text-slate-400'}>
          {shieldActive ? 'Радар сканує месенджери' : 'Радар зупинено'}
        </span>
      </div>
    </div>
  );
}
