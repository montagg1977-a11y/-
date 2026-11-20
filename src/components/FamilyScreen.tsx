import { useState } from 'react';
import { UserPlus, Trash2, Bell, ShieldCheck, ShieldOff, Copy, Check, Users } from 'lucide-react';
import { useProtection } from '../context/ProtectionContext';
import { Card, NeonButton, SectionTitle, Toggle } from './ui';
import { genInviteCode, copyText } from '../lib/storage';

export function FamilyScreen({ onPaywall }: { onPaywall: () => void }) {
  const { devices, addDevice, removeDevice, toggleDeviceShield, isFamily } = useProtection();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [testAlert, setTestAlert] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Дитина');
  const [messenger, setMessenger] = useState('Viber');

  function handleGenerate() {
    if (!isFamily) {
      onPaywall();
      return;
    }
    setInviteCode(genInviteCode());
  }

  async function handleCopyCode() {
    if (!inviteCode) return;
    const ok = await copyText(inviteCode);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  function handleAdd() {
    if (!name.trim()) return;
    addDevice({
      name: name.trim(),
      relation,
      messengers: messenger,
      shieldActive: true,
    });
    setName('');
  }

  return (
    <div className="space-y-5">
      {/* invite code */}
      <Card>
        <SectionTitle icon={<Users size={15} className="text-neon-500" />} title="Інвайт-код підключення" />
        <p className="mb-3 text-[13px] text-slate-400">
          Згенеруйте 6-значний код, щоб підключити телефон батьків або дитини до сімейного захисту.
        </p>

        {inviteCode ? (
          <div className="mb-3 rounded-xl border border-neon-500/40 bg-neon-500/10 p-4 text-center">
            <p className="mb-1 text-[11px] uppercase tracking-wider text-slate-400">Ваш інвайт-код</p>
            <p className="font-mono text-3xl font-extrabold tracking-[0.3em] text-neon-400">{inviteCode}</p>
            <button
              type="button"
              onClick={handleCopyCode}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-neon-500/15 px-3 py-1.5 text-xs font-semibold text-neon-400 ring-1 ring-neon-500/40 active:scale-95"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Скопійовано' : 'Копіювати код'}
            </button>
          </div>
        ) : (
          <NeonButton onClick={handleGenerate} className="w-full">
            <UserPlus size={16} /> Згенерувати код
          </NeonButton>
        )}
        {!isFamily && (
          <p className="mt-2 text-center text-[11px] text-amber-400">
            Потрібен тариф «Сімейний захист».
          </p>
        )}
      </Card>

      {/* add device form */}
      <Card>
        <SectionTitle title="Додати пристрій" />
        <div className="space-y-2.5">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ім'я (напр. Син, Бабуся)"
            className="w-full rounded-xl border border-white/10 bg-ink-800/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-neon-500/60 focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-2.5">
            <select
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-ink-800/70 px-3 py-2.5 text-sm text-slate-100 focus:border-neon-500/60 focus:outline-none"
            >
              <option>Дитина</option>
              <option>Батьки</option>
              <option>Чоловік/дружина</option>
              <option>Інше</option>
            </select>
            <select
              value={messenger}
              onChange={(e) => setMessenger(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-ink-800/70 px-3 py-2.5 text-sm text-slate-100 focus:border-neon-500/60 focus:outline-none"
            >
              <option>Viber</option>
              <option>Telegram</option>
              <option>WhatsApp</option>
              <option>SMS</option>
              <option>Viber / SMS</option>
            </select>
          </div>
          <NeonButton onClick={handleAdd} disabled={!name.trim()} variant="ghost" className="w-full">
            <UserPlus size={16} /> Додати
          </NeonButton>
        </div>
      </Card>

      {/* connected devices */}
      <Card>
        <SectionTitle
          icon={<ShieldCheck size={15} className="text-neon-500" />}
          title="Підключені пристрої"
          hint={`${devices.length}`}
        />
        {devices.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-500">Пристроїв ще немає.</p>
        ) : (
          <ul className="space-y-2.5">
            {devices.map((d) => (
              <li
                key={d.id}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-ink-800/60 p-3"
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                    d.shieldActive ? 'bg-neon-500/15 text-neon-500' : 'bg-ink-700/70 text-slate-500'
                  }`}
                >
                  {d.shieldActive ? <ShieldCheck size={20} /> : <ShieldOff size={20} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-100">
                    {d.name} <span className="text-slate-500">· {d.relation}</span>
                  </p>
                  <p className="truncate text-[11px] text-slate-400">
                    {d.messengers} ·{' '}
                    <span className={d.shieldActive ? 'text-neon-400' : 'text-slate-500'}>
                      {d.shieldActive ? 'Щит активний' : 'Щит вимкнено'}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleDeviceShield(d.id)}
                  className="rounded-lg px-2 py-1 text-[11px] text-neon-400 ring-1 ring-neon-500/30 active:scale-95"
                >
                  {d.shieldActive ? 'Вимк.' : 'Увімк.'}
                </button>
                <button
                  type="button"
                  onClick={() => removeDevice(d.id)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-alarm-400 ring-1 ring-alarm-500/30 active:scale-95"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* test alert */}
      <Card>
        <SectionTitle title="Тест тривоги від батьків" />
        <p className="mb-3 text-[13px] text-slate-400">
          Перевірте, як виглядає сповіщення на телефоні дитини, коли батьки надсилають тривогу.
        </p>
        <Toggle
          checked={false}
          onChange={() => setTestAlert(true)}
          label="Надіслати тестову тривогу"
          sublabel="Показати приклад сповіщення"
          accent="amber"
          icon={<Bell size={16} />}
        />
      </Card>

      {testAlert && (
        <div className="fixed inset-0 z-50 mx-auto flex max-w-md items-end">
          <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={() => setTestAlert(false)} />
          <div className="relative mb-4 w-full animate-slide-up rounded-2xl border-t-2 border-amber-500/60 bg-ink-900 p-4 shadow-amber">
            <div className="mb-2 flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/20 text-amber-500">
                <Bell size={18} />
              </span>
              <div>
                <p className="text-sm font-bold text-amber-400">Тривога від батьків</p>
                <p className="text-[11px] text-slate-400">Мама · зараз</p>
              </div>
            </div>
            <p className="mb-3 text-sm text-slate-100">
              «Синку, не передавай нікому код із SMS! Це шахрай. Зателефонуй мені.»
            </p>
            <button
              type="button"
              onClick={() => setTestAlert(false)}
              className="w-full rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-ink-950 active:scale-95"
            >
              Зрозуміло
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
