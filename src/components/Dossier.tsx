import { Search, Phone, Link2, AtSign, FileText, AlertTriangle, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';
import { analyzeInput, riskBg, riskColor, riskLabel } from '../lib/analysis';
import type { AnalysisResult } from '../types';
import { NeonButton, Tag } from './ui';

function inputIcon(type: AnalysisResult['inputType']) {
  switch (type) {
    case 'phone':
      return <Phone size={14} />;
    case 'link':
      return <Link2 size={14} />;
    case 'nickname':
      return <AtSign size={14} />;
    default:
      return <FileText size={14} />;
  }
}

export function DossierCard({ result }: { result: AnalysisResult }) {
  return (
    <div className={`animate-fade-in rounded-2xl border p-4 ${riskBg(result.level)}`}>
      {/* risk gauge */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative grid h-20 w-20 shrink-0 place-items-center">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(result.risk / 100) * 213.6} 213.6`}
              className={riskColor(result.level)}
            />
          </svg>
          <span className={`absolute text-xl font-extrabold ${riskColor(result.level)}`}>{result.risk}%</span>
        </div>
        <div className="min-w-0">
          <p className="mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
            {inputIcon(result.inputType)} {result.inputType === 'phone' ? 'Номер' : result.inputType === 'link' ? 'Посилання' : result.inputType === 'nickname' ? 'Нікнейм' : 'Текст'}
          </p>
          <p className={`text-base font-bold ${riskColor(result.level)}`}>{riskLabel(result.level)}</p>
          <p className="mt-0.5 text-xs text-slate-400">{result.summary}</p>
        </div>
      </div>

      {/* tags */}
      {result.tags.length > 0 && (
        <div className="mb-3">
          <p className="mb-1.5 text-[11px] uppercase tracking-wider text-slate-500">Теги користувачів</p>
          <div className="flex flex-wrap gap-1.5">
            {result.tags.map((t) => (
              <Tag
                key={t}
                text={t}
                tone={
                  result.level === 'critical' || result.level === 'high'
                    ? 'alarm'
                    : result.level === 'medium'
                      ? 'amber'
                      : 'neutral'
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* flagged phrases */}
      {result.flaggedPhrases.length > 0 && (
        <div className="mb-3">
          <p className="mb-1.5 flex items-center gap-1 text-[11px] uppercase tracking-wider text-amber-400">
            <AlertTriangle size={12} /> Підозрілі слова
          </p>
          <ul className="space-y-1">
            {result.flaggedPhrases.map((p, i) => (
              <li key={i} className="rounded-lg bg-amber-500/10 px-2.5 py-1.5 text-[13px] text-slate-200">
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* flagged links */}
      {result.flaggedLinks.length > 0 && (
        <div>
          <p className="mb-1.5 flex items-center gap-1 text-[11px] uppercase tracking-wider text-alarm-400">
            <LinkIcon size={12} /> Підозрілі посилання
          </p>
          <ul className="space-y-1">
            {result.flaggedLinks.map((l, i) => (
              <li key={i} className="truncate rounded-lg bg-alarm-500/10 px-2.5 py-1.5 text-[13px] text-alarm-300">
                {l}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.flaggedPhrases.length === 0 && result.flaggedLinks.length === 0 && (
        <p className="rounded-lg bg-ok-500/10 px-3 py-2 text-[13px] text-ok-400">
          Антиспам-фільтр не знайшов підозрілих слів чи посилань.
        </p>
      )}
    </div>
  );
}

export function DossierPanel({ onPaywall }: { onPaywall: () => void }) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  function run(input?: string) {
    const value = (input ?? query).trim();
    if (!value) return;
    setQuery(value);
    setResult(analyzeInput(value));
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
      >
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Номер, нікнейм, посилання або текст"
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-ink-800/70 px-3.5 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-neon-500/60 focus:outline-none"
          />
          <NeonButton type="submit" className="shrink-0 px-4">
            <Search size={16} /> Пробити
          </NeonButton>
        </div>
      </form>

      {result ? (
        <DossierCard result={result} />
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">
          Введіть номер, посилання або текст — Комісар миттєво перевірить їх на ознаки шахрайства.
        </div>
      )}

      {!result && (
        <p className="text-center text-[11px] text-slate-600">
          Безлімітний пробив доступний у тарифі{' '}
          <button type="button" onClick={onPaywall} className="text-neon-400 underline">
            PRO
          </button>
        </p>
      )}
    </div>
  );
}
