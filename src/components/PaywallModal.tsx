import { useState } from 'react';
import { X, Check, ShieldCheck, Users, FileText, ScrollText, ExternalLink } from 'lucide-react';
import { PLANS } from '../constants';
import { useProtection } from '../context/ProtectionContext';
import type { Plan } from '../types';

// Gumroad checkout links — замініть на ваші точні посилання з Gumroad

 const GUMROAD_LINKS = {
   personal: 'https://montagg.gumroad.com/l/miqgi?wanted=true',
  family: 'https://montagg.gumroad.com/l/dgnivd?wanted=true',
};


export function PaywallModal() {
  const { paywallOpen, closePaywall, plan } = useProtection();
  const [selected, setSelected] = useState<Plan>('family');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!paywallOpen) return null;

  function handlePay() {
    const url = GUMROAD_LINKS[selected];
    if (!url) {
      setError('Не вдалося визначити тариф для оплати.');
      return;
    }
    setProcessing(true);
    setError(null);
    window.open(url, '_blank', 'noopener,noreferrer');
    setProcessing(false);
  }

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-md flex-col">
      <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm animate-fade-in" onClick={closePaywall} />
      <div className="relative mt-auto max-h-[92vh] overflow-y-auto no-scrollbar rounded-t-3xl border-t border-neon-500/30 bg-ink-900 p-5 pb-8 animate-slide-up">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-bold text-neon-400">Тарифи PRO</h2>
          <button
            type="button"
            onClick={closePaywall}
            className="grid h-9 w-9 place-items-center rounded-full bg-ink-700/70 text-slate-300 ring-1 ring-white/10"
          >
            <X size={18} />
          </button>
        </div>
        <p className="mb-5 text-sm text-slate-400">
          Підвищений захист для себе та близьких. Скасувати можна в будь-який момент.
        </p>

        <div className="space-y-3">
          {PLANS.map((p) => {
            const active = selected === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelected(p.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  active
                    ? 'border-neon-500 bg-neon-500/10 shadow-neonSoft'
                    : 'border-white/5 bg-ink-800/60'
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-base font-bold text-slate-100">
                    {p.id === 'family' ? <Users size={18} className="text-neon-500" /> : <ShieldCheck size={18} className="text-neon-500" />}
                    {p.title}
                  </span>
                  {p.highlight && (
                    <span className="rounded-full bg-neon-500/20 px-2 py-0.5 text-[10px] font-bold text-neon-400">
                      ПОПУЛЯРНИЙ
                    </span>
                  )}
                </div>
                <p className="mb-2 text-2xl font-extrabold text-neon-400">
                  {p.price} <span className="text-sm font-medium text-slate-400">грн / {p.period}</span>
                </p>
                <ul className="space-y-1.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2 text-[13px] text-slate-300">
                      <Check size={15} className="mt-0.5 shrink-0 text-ok-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {plan !== 'free' && (
          <p className="mt-3 rounded-lg bg-ok-500/10 px-3 py-2 text-center text-xs text-ok-400">
            У вас активний тариф PRO. Дякуємо за довіру!
          </p>
        )}

        {error && <p className="mt-3 rounded-lg bg-alarm-500/10 px-3 py-2 text-center text-xs text-alarm-400">{error}</p>}

        <button
          type="button"
          onClick={handlePay}
          disabled={processing}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neon-500 py-4 text-sm font-bold text-ink-950 shadow-neon active:scale-[0.98] disabled:opacity-60"
        >
          {processing ? (
            'Перехід до оплати…'
          ) : (
            <>
              <ExternalLink size={16} /> Оплатити {PLANS.find((p) => p.id === selected)?.price} грн
            </>
          )}
        </button>
        <p className="mt-2 text-center text-[11px] text-slate-500">
          Платіж через захищений шлюз. Дані картки не зберігаються.
        </p>

        {/* legal footer */}
        <div className="mt-6 space-y-2 border-t border-white/5 pt-4 text-[11px] leading-relaxed text-slate-500">
          <p className="flex items-start gap-1.5">
            <ScrollText size={12} className="mt-0.5 shrink-0 text-slate-600" />
            Натискаючи «Оплатити», ви приймаєте умови публічної оферти та даєте згоду на обробку персональних
            даних згідно з Політикою конфіденційності.
          </p>
          <p className="flex items-start gap-1.5">
            <FileText size={12} className="mt-0.5 shrink-0 text-slate-600" />
            Застосунок «Комісар ШІ» є допоміжним інструментом і не гарантує 100% виявлення шахраїв. Рішення
            щодо переказів та передачі даних ви приймаєте самостійно.
          </p>
        </div>
      </div>
    </div>
  );
}
