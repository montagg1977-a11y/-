import { useState } from 'react';
import { Radar, Users, Crown, Zap } from 'lucide-react';
import { ProtectionProvider, useProtection } from './context/ProtectionContext';
import { Logo, StatusBadge } from './components/ui';
import { RadarScreen } from './components/RadarScreen';
import { FamilyScreen } from './components/FamilyScreen';
import { PaywallModal } from './components/PaywallModal';

type Tab = 'radar' | 'family' | 'plans';

const TABS: { key: Tab; label: string; icon: typeof Radar }[] = [
  { key: 'radar', label: 'Радар', icon: Radar },
  { key: 'family', label: 'Сімейний захист', icon: Users },
  { key: 'plans', label: 'Тарифи PRO', icon: Crown },
];

function Shell() {
  const [tab, setTab] = useState<Tab>('radar');
  const { isPro, openPaywall } = useProtection();

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-ink-900">
      {/* header */}
      <header className="sticky top-0 z-30 glass border-b border-white/5 px-4 pb-3 pt-4">
        <div className="flex items-center gap-3">
          <Logo size={42} />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-bold leading-tight text-slate-100">Комісар ШІ</h1>
            <p className="truncate text-[11px] text-slate-400">Цифровий охоронець месенджерів</p>
          </div>
          <StatusBadge isPro={isPro} />
        </div>
      </header>

      {/* content */}
      <main className="flex-1 px-4 pb-28 pt-4">
        {tab === 'radar' && <RadarScreen onPaywall={openPaywall} />}
        {tab === 'family' && <FamilyScreen onPaywall={openPaywall} />}
        {tab === 'plans' && <PlansScreen onPaywall={openPaywall} />}
      </main>

      {/* bottom nav */}
      <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2">
        <div className="glass border-t border-white/5 px-2 pb-[env(safe-area-inset-bottom)] pt-1.5">
          <div className="grid grid-cols-3 gap-1">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`relative flex flex-col items-center gap-1 rounded-xl py-2.5 transition ${
                    active ? 'text-neon-500' : 'text-slate-500'
                  }`}
                >
                  {active && (
                    <span className="absolute -top-1.5 h-1 w-8 rounded-full bg-neon-500 shadow-neonSoft" />
                  )}
                  <Icon size={20} strokeWidth={active ? 2.4 : 2} />
                  <span className="text-[10px] font-medium leading-none">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <PaywallModal />
    </div>
  );
}

function PlansScreen({ onPaywall }: { onPaywall: () => void }) {
  const { plan, isPro } = useProtection();
  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-neon-500/20 bg-gradient-to-b from-neon-500/10 to-transparent p-5 text-center">
        <span className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-neon-500/15 text-neon-500 ring-1 ring-neon-500/40">
          <Crown size={28} />
        </span>
        <h2 className="text-lg font-bold text-neon-400">Підвищіть свій захист</h2>
        <p className="mt-1 text-sm text-slate-400">
          Безлімітний пробив, суфлер контрнаступу та захист усієї родини.
        </p>
      </div>

      {isPro ? (
        <div className="rounded-2xl border border-ok-500/30 bg-ok-500/10 p-4 text-center">
          <p className="text-sm font-bold text-ok-400">Ваш тариф активний</p>
          <p className="mt-1 text-[13px] text-slate-300">
            {plan === 'family' ? 'Сімейний захист до 4 пристроїв' : 'Особистий захист'}
          </p>
          <button
            type="button"
            onClick={onPaywall}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-ink-700/70 px-4 py-2.5 text-sm font-semibold text-slate-200 ring-1 ring-white/10 active:scale-95"
          >
            <Zap size={15} /> Змінити тариф
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onPaywall}
          className="w-full rounded-2xl bg-neon-500 py-4 text-sm font-bold text-ink-950 shadow-neon active:scale-[0.98]"
        >
          Обрати тариф PRO
        </button>
      )}

      <div className="rounded-2xl border border-white/5 bg-ink-850/60 p-4 text-[11px] leading-relaxed text-slate-500">
        <p className="mb-1 font-semibold text-slate-400">Юридичне застереження</p>
        «Комісар ШІ» — допоміжний сервіс попередження про потенційні шахрайські дії. Результати аналізу
        мають імовірнісний характер і не є офіційною класифікацією особи. Сервіс не зберігає вміст ваших
        повідомлень на сервері та не передає його стороннім. Використання відбувається на умовах публічної
        оферти. Див. Політику конфіденційності.
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ProtectionProvider>
      <Shell />
    </ProtectionProvider>
  );
}
