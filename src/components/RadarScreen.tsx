import { useState } from 'react';
import { Search, MessageSquare, FlaskConical, UserCheck, ShieldCheck } from 'lucide-react';
import { useProtection } from '../context/ProtectionContext';
import { MESSengers } from '../constants';
import { Card, NeonButton, SectionTitle, Toggle } from './ui';
import { RadarShield } from './RadarShield';
import { DossierPanel } from './Dossier';
import { InterceptionOverlay } from './InterceptionOverlay';
import type { MessengerKey } from '../types';

function MessengerIcon({ k }: { k: MessengerKey }) {
  const common = 'size-4';
  switch (k) {
    case 'viber':
      return <MessageSquare className={common} />;
    case 'telegram':
      return <MessageSquare className={common} />;
    case 'whatsapp':
      return <MessageSquare className={common} />;
    case 'instagram':
      return <MessageSquare className={common} />;
    case 'sms':
      return <MessageSquare className={common} />;
  }
}

export function RadarScreen({ onPaywall }: { onPaywall: () => void }) {
  const { messengers, toggleMessenger, strangersOnly, toggleStrangersOnly, shieldActive, isPro } = useProtection();
  const [intercepting, setIntercepting] = useState(false);

  const protectedCount = MESSengers.filter((m) => messengers[m.key]).length;

  return (
    <div className="space-y-5">
      {/* radar shield */}
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-grid p-5">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-500/5 to-transparent" />
        <div className="relative">
          <RadarShield />
          <p className="mt-5 text-center text-sm text-slate-400">
            {shieldActive
              ? `Захищено ${protectedCount} ${pluralUA(protectedCount, 'месенджер', 'месенджери', 'месенджерів')}. Радар активний.`
              : 'Увімкніть щит, щоб радар почав сканувати вхідні повідомлення.'}
          </p>
        </div>
      </div>

      {/* test interception */}
      <button
        type="button"
        onClick={() => setIntercepting(true)}
        className="flex w-full items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-left transition active:scale-[0.99]"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-500">
          <FlaskConical size={22} />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-amber-400">Тест перехоплення шахрая</span>
          <span className="block text-[12px] text-slate-400">
            Симуляція вхідного повідомлення у Viber і реакції Комісара
          </span>
        </span>
      </button>

      {/* protected messengers */}
      <Card>
        <SectionTitle
          icon={<ShieldCheck size={15} className="text-neon-500" />}
          title="Захищені месенджери"
          hint={`${protectedCount}/${MESSengers.length}`}
        />
        <div className="space-y-2">
          {MESSengers.map((m) => (
            <Toggle
              key={m.key}
              checked={messengers[m.key]}
              onChange={() => toggleMessenger(m.key)}
              label={m.label}
              sublabel={messengers[m.key] ? 'Під охороною Комісара' : 'Не перевіряється'}
              icon={<MessengerIcon k={m.key} />}
            />
          ))}
        </div>
        <div className="mt-3 border-t border-white/5 pt-3">
          <Toggle
            checked={strangersOnly}
            onChange={toggleStrangersOnly}
            label="Перевіряти лише незнайомців"
            sublabel={strangersOnly ? 'Контакти з телефонної книги пропускаються' : 'Перевіряти всіх відправників'}
            accent="amber"
            icon={<UserCheck size={16} />}
          />
        </div>
      </Card>

      {/* quick manual check */}
      <Card>
        <SectionTitle icon={<Search size={15} className="text-neon-500" />} title="Швидка перевірка вручну" />
        <DossierPanel onPaywall={onPaywall} />
      </Card>

      {!isPro && (
        <NeonButton onClick={onPaywall} variant="ghost" className="w-full">
          <ShieldCheck size={16} /> Розблокувати повний захист
        </NeonButton>
      )}

      {intercepting && <InterceptionOverlay onClose={() => setIntercepting(false)} />}
    </div>
  );
}

function pluralUA(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
