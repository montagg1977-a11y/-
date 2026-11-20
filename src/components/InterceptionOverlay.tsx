import { useEffect, useState } from 'react';
import { ShieldAlert, X, MessageSquare, Copy, Check, Save, Flag, Ban, Lightbulb } from 'lucide-react';
import { INCOMING_SCAM_MESSAGE, COUNTER_REPLIES, STOP_REMINDERS, SCAM_SCHEME } from '../constants';
import { copyText } from '../lib/storage';

type Phase = 'banner' | 'prompt' | 'sufler';

export function InterceptionOverlay({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>('banner');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Brief "incoming message" banner first, then the alert prompt
  useEffect(() => {
    if (phase !== 'banner') return;
    const t = setTimeout(() => setPhase('prompt'), 1600);
    return () => clearTimeout(t);
  }, [phase]);

  const handleCopy = async (idx: number, text: string) => {
    const ok = await copyText(text);
    if (ok) {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 mx-auto max-w-md">
      {/* pulsing perimeter frame */}
      <div className="pointer-events-none absolute inset-0 animate-border-pulse-alarm" />

      {/* incoming-message banner */}
      {phase === 'banner' && (
        <div className="absolute inset-x-0 top-0 animate-fade-in p-3 pt-5">
          <div className="glass animate-shake rounded-2xl border border-alarm-500/40 p-3 shadow-alarm">
            <div className="mb-1 flex items-center gap-2 text-[11px] text-slate-400">
              <MessageSquare size={13} className="text-neon-500" />
              <span className="font-semibold text-neon-400">{INCOMING_SCAM_MESSAGE.source}</span>
              <span>· {INCOMING_SCAM_MESSAGE.sender}</span>
            </div>
            <p className="text-sm leading-snug text-slate-100">{INCOMING_SCAM_MESSAGE.text}</p>
          </div>
        </div>
      )}

      {/* alert prompt sheet */}
      {phase === 'prompt' && (
        <div className="absolute inset-x-0 bottom-0 animate-slide-up">
          <div className="glass rounded-t-3xl border-t-2 border-alarm-500/60 p-5 shadow-alarm">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
            <div className="mb-2 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-alarm-500/20 ring-1 ring-alarm-500/50">
                <ShieldAlert className="text-alarm-500" size={26} />
              </div>
              <div>
                <p className="text-base font-bold text-alarm-400">Підозра шахрайства</p>
                <p className="text-sm text-slate-300">
                  Ризик <span className="font-bold text-alarm-500">{INCOMING_SCAM_MESSAGE.risk}%</span> ·
                  повідомлення у {INCOMING_SCAM_MESSAGE.source}
                </p>
              </div>
            </div>
            <p className="mb-4 rounded-xl bg-alarm-500/10 p-3 text-sm text-slate-200">
              Комісар виявив ознаки схеми «фіктивна державна допомога». Вам потрібна допомога?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPhase('sufler')}
                className="rounded-xl bg-neon-500 py-3 text-sm font-bold text-ink-950 shadow-neon active:scale-95"
              >
                ТАК, захисти мене
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-ink-700/70 py-3 text-sm font-semibold text-slate-200 ring-1 ring-white/10 active:scale-95"
              >
                НІ, я впевнений
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Суфлер контрнаступу */}
      {phase === 'sufler' && (
        <div className="absolute inset-0 overflow-y-auto no-scrollbar bg-ink-900/95 animate-fade-in">
          <div className="flex min-h-full flex-col p-4 pb-8">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="text-neon-500" size={20} />
                <h2 className="text-base font-bold text-neon-400">Суфлер контрнаступу</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-full bg-ink-700/70 text-slate-300 ring-1 ring-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* scheme breakdown */}
            <section className="mb-4 rounded-2xl border border-alarm-500/30 bg-alarm-500/5 p-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-alarm-400">
                <Ban size={15} /> Схема розводу
              </h3>
              <ol className="space-y-2">
                {SCAM_SCHEME.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-200">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-alarm-500/20 text-[11px] font-bold text-alarm-400">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </section>

            {/* stop reminders */}
            <section className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
              <h3 className="mb-2 text-sm font-bold text-amber-400">Стоп-нагадування</h3>
              <ul className="space-y-2">
                {STOP_REMINDERS.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-200">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    {r}
                  </li>
                ))}
              </ul>
            </section>

            {/* counter replies */}
            <section className="mb-4">
              <h3 className="mb-2 text-sm font-bold text-slate-200">Готові відповіді-перевірки для шахрая</h3>
              <div className="space-y-3">
                {COUNTER_REPLIES.map((reply, i) => (
                  <div key={i} className="rounded-xl border border-white/5 bg-ink-800/70 p-3">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-neon-400">
                      {reply.title}
                    </p>
                    <p className="mb-2 text-sm text-slate-100">{reply.text}</p>
                    <button
                      type="button"
                      onClick={() => handleCopy(i, reply.text)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-neon-500/15 px-3 py-1.5 text-xs font-semibold text-neon-400 ring-1 ring-neon-500/40 active:scale-95"
                    >
                      {copiedIdx === i ? <Check size={13} /> : <Copy size={13} />}
                      {copiedIdx === i ? 'Скопійовано' : 'Копіювати'}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* save evidence + report */}
            <button
              type="button"
              onClick={onClose}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-alarm-500 py-3.5 text-sm font-bold text-white shadow-alarm active:scale-95"
            >
              <Save size={16} /> Зберегти доказ і поскаржитись
            </button>
            <p className="mt-2 text-center text-[11px] text-slate-500">
              <Flag size={11} className="mr-1 inline" />
              Доказ зберігається локально на пристрої. Скарга буде надіслата до месенджера.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
