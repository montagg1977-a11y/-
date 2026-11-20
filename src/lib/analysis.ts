import type { AnalysisResult, RiskLevel } from '../types';
import { SCAM_PHRASES, SHORT_LINK_HOSTS, SUSPICIOUS_TLDS } from '../constants';

const PHONE_RE = /(\+?38\s?0?\d{2}\s?\d{3}[\s-]?\d{2}[\s-]?\d{2})|(\b0\d{2}\s?\d{3}[\s-]?\d{2}[\s-]?\d{2}\b)/;
const LINK_RE = /(https?:\/\/[^\s]+|[a-z0-9-]+\.([a-z]{2,})(\/[^\s]*)?)/gi;

function detectInputType(input: string): AnalysisResult['inputType'] {
  const t = input.trim();
  if (!t) return 'text';
  if (PHONE_RE.test(t.replace(/\s|-/g, '')) && t.replace(/\D/g, '').length >= 10) return 'phone';
  if (/^https?:\/\//i.test(t) || /^[\w-]+\.[a-z]{2,}/i.test(t)) return 'link';
  if (/^@[\w\d_]{3,}$/.test(t)) return 'nickname';
  return 'text';
}

function extractLinks(input: string): string[] {
  const matches = input.match(LINK_RE);
  return matches ? Array.from(new Set(matches)) : [];
}

function hostOf(link: string): string {
  try {
    const withProto = link.startsWith('http') ? link : `https://${link}`;
    return new URL(withProto).hostname.toLowerCase();
  } catch {
    return '';
  }
}

function levelFromRisk(risk: number): RiskLevel {
  if (risk >= 75) return 'critical';
  if (risk >= 50) return 'high';
  if (risk >= 25) return 'medium';
  return 'low';
}

const RISK_NOTES: Record<RiskLevel, string> = {
  low: 'Ознак шахрайства не виявлено. Завжди перевіряйте джерела самостійно.',
  medium: 'Є окремі підозрілі ознаки. Будьте обережні й не передавайте дані картки.',
  high: 'Сильна схожість із відомою схемою шахраїв. Не переходьте за посиланнями.',
  critical: 'Критичний ризик. Ймовірно, це шахрай. Перервіть контакт і не вводьте ніяких даних.',
};

export function analyzeInput(input: string): AnalysisResult {
  const trimmed = input.trim();
  const inputType = detectInputType(trimmed);
  const tags = new Set<string>();
  const flaggedPhrases: { phrase: string; note?: string }[] = [];
  let risk = 0;

  for (const rule of SCAM_PHRASES) {
    const m = trimmed.match(rule.regex);
    if (m) {
      risk += rule.weight;
      flaggedPhrases.push({ phrase: m[0], note: rule.note });
      if (rule.tag) tags.add(rule.tag);
    }
  }

  const links = extractLinks(trimmed);
  const flaggedLinks: string[] = [];
  for (const link of links) {
    const host = hostOf(link);
    let linkRisk = 0;
    if (SHORT_LINK_HOSTS.some((h: string) => host === h || host.endsWith(`.${h}`))) {
      linkRisk += 18;
      tags.add('Скоротене_посилання');
    }
    if (SUSPICIOUS_TLDS.some((tld: string) => host.endsWith(tld))) {
      linkRisk += 20;
      tags.add('Підозрілий_домен');
    }
    if (/dopomog|help|verify|bonus|win|prize|cash|pay|bank|mono|oschad/i.test(host) && !/(google|apple|gov\.ua|monobank\.com|privatbank\.ua|oschadbank\.ua)/i.test(host)) {
      linkRisk += 14;
      tags.add('Фішинг_посилання');
    }
    if (linkRisk > 0) {
      risk += linkRisk;
      flaggedLinks.push(link);
    }
  }

  // Phone: bump risk slightly, add a neutral tag
  if (inputType === 'phone') {
    risk += 8;
    if (!tags.size) tags.add('Невідомий_номер');
  }

  // High number of suspicious indicators compounds risk
  if (flaggedPhrases.length >= 3) risk += 10;
  if (flaggedLinks.length >= 1 && flaggedPhrases.length >= 1) risk += 8;

  risk = Math.min(100, Math.round(risk));
  if (risk === 0 && inputType === 'text') risk = 4;
  if (risk === 0 && inputType === 'phone') risk = 12;

  const level = levelFromRisk(risk);

  // If nothing concrete flagged, keep tag set reflective
  if (!tags.size) {
    if (inputType === 'phone') tags.add('Невідомий_номер');
    else if (inputType === 'link') tags.add('Нове_посилання');
  }

  return {
    risk,
    level,
    inputType,
    tags: Array.from(tags),
    flaggedPhrases: flaggedPhrases.map((p) => (p.note ? `${p.phrase} — ${p.note}` : p.phrase)),
    flaggedLinks,
    summary: RISK_NOTES[level],
  };
}

export function riskColor(level: RiskLevel): string {
  switch (level) {
    case 'critical':
      return 'text-alarm-500';
    case 'high':
      return 'text-amber-500';
    case 'medium':
      return 'text-amber-400';
    case 'low':
      return 'text-ok-500';
    default:
      return 'text-slate-300';
  }
}

export function riskBg(level: RiskLevel): string {
  switch (level) {
    case 'critical':
      return 'bg-alarm-500/15 border-alarm-500/50';
    case 'high':
      return 'bg-amber-500/15 border-amber-500/50';
    case 'medium':
      return 'bg-amber-400/10 border-amber-400/40';
    case 'low':
      return 'bg-ok-500/10 border-ok-500/40';
    default:
      return 'bg-ink-700/40 border-white/10';
  }
}

export function riskLabel(level: RiskLevel): string {
  switch (level) {
    case 'critical':
      return 'Критичний ризик';
    case 'high':
      return 'Високий ризик';
    case 'medium':
      return 'Середній ризик';
    case 'low':
      return 'Низький ризик';
    default:
      return 'Невідомо';
  }
}
