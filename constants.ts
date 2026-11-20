import type { PlanInfo, MessengerKey } from './types';

export const MESSengers: { key: MessengerKey; label: string; brand: string }[] = [
  { key: 'viber', label: 'Viber', brand: '#7360F2' },
  { key: 'telegram', label: 'Telegram', brand: '#229ED9' },
  { key: 'whatsapp', label: 'WhatsApp', brand: '#25D366' },
  { key: 'instagram', label: 'Instagram', brand: '#E1306C' },
  { key: 'sms', label: 'SMS', brand: '#94A3B8' },
];

export const PLANS: PlanInfo[] = [
  {
    id: 'personal',
    title: 'Особистий захист',
    price: 89,
    period: 'міс',
    features: [
      'Радар для всіх месенджерів',
      'Безлімітний пробив номерів і посилань',
      'Суфлер контрнаступу в реальному часі',
      'Історія перевірок (останні 30 днів)',
    ],
  },
  {
    id: 'family',
    title: 'Сімейний захист',
    price: 169,
    period: 'міс',
    features: [
      'Усе з тарифу «Особистий захист»',
      'До 4 пристроїв у сімейному захисті',
      'Тривога від батьків — миттєве сповіщення',
      'Звіт про підозрілі контакти дитини',
      'Пріоритетна підтримка 24/7',
    ],
    highlight: true,
  },
];

// Ukrainian scam patterns for the local detection engine
export const SCAM_PHRASES: { regex: RegExp; weight: number; tag?: string; note?: string }[] = [
  { regex: /допомог[аи]?\s+\d{2,5}/i, weight: 28, note: 'Обіцянка державної допомоги' },
  { regex: /нараховано\s+(допомог[аи]?|грош[іи]|субсиді[яю])/i, weight: 26, note: '«Нараховано» — типова приманка' },
  { regex: /перевірте\s+(картку|рахунок)/i, weight: 18 },
  { regex: /(смс[- ]?код|код\s+з\s+смс|cvv|cvc)/i, weight: 30, note: 'Прохання коду з SMS/CVV' },
  { regex: /(перейд[іи]ть|переход[ь]?те)\s+за\s+(посиланн|лінк|ссилк)/i, weight: 16 },
  { regex: /(монобанка|monobank|приватбанк|оскол|oschadbank)/i, weight: 10, tag: 'Фейк_Банк' },
  { regex: /(olx|delivr|промюа)/i, weight: 14, tag: 'Шахрай_OLX' },
  { regex: /тренер|курс[и]|заробіток\s+ онлайн|крипт[оа]/i, weight: 12, tag: 'Піраміда' },
  { regex: /розіграш|приз|виграш|ви\s+виграл/i, weight: 22, note: 'Фіктивний виграш' },
  { regex: /заблокован[оа]\s+(картк|рахунок)|розблокувати\s+(картк|рахунок)/i, weight: 24, note: 'Блокування рахунку — тиск' },
  { regex: /кур[\'’]?єр|доставка.*?(оплат|предопл)/i, weight: 14, tag: 'Шахрай_OLX' },
  { regex: /(грн)\s*[\d\s]{2,6}/i, weight: 6 },
  { regex: /(nakarta|nakar[rt]a|nakarta\.|nakart\.)/i, weight: 20, tag: 'Фейк_Банк' },
  { regex: /податок|комісі[яю]\s+банк|збір\s+за\s+переказ/i, weight: 18, note: 'Фіктивний збір/податок' },
];

export const SHORT_LINK_HOSTS = ['bit.ly', 'tinyurl.com', 'cutt.ly', 't.me', 'vk.cc', 'is.gd', 'shorturl.at', 't.ly', 'rb.gy'];

export const SUSPICIOUS_TLDS = ['.ru', '.su', '.top', '.xyz', '.click', '.bid', '.zip', '.review', '.country', '.kim'];

export const COUNTER_REPLIES: { title: string; text: string }[] = [
  {
    title: 'Спробувати зателефонувати',
    text: 'Зараз не зручно писати. За яких саме реквізитів нарахування? Давайте я зателефоную вам на гарячу лінію банку й перевірю.',
  },
  {
    title: 'Запитати деталі, які знає лише банк',
    text: 'Я не надаю коди з SMS та CVV нікому, навіть банку — це вимога НБУ. Якщо це справді банк, ви знаєте мої останні 4 цифри картки та дату операції. Називіть їх.',
  },
  {
    title: 'Послати на офіційний канал',
    text: 'Я звернувся до офіційної підтримки в застосунку банку. Якщо нарахування реальне — воно відображається в додатку. Посилання стороннім не відкриваю.',
  },
];

export const STOP_REMINDERS: string[] = [
  'Ніколи не називайте SMS-код підтвердження — навіть «співробітнику банку».',
  'Не повідомляйте CVV/CVC-код із оборотної сторони картки.',
  'Банк ніколи не просить переказати «збір» або «податок» для отримання допомоги.',
  'Не переходьте за посиланнями з повідомлень — відкривайте лише офіційний застосунок.',
];

export const SCAM_SCHEME: string[] = [
  'Шахрай видає себе за «державну програму» або банк і повідомляє про нібито нарахування допомоги.',
  'Просить перейти за посиланням і ввести дані картки «для зарахування».',
  'Під виглядом «перевірки» вимагає SMS-код або CVV — цього достатньо, щоб обнулити рахунок.',
  'Тискає терміном («зареєструйтеся до кінця дня, інакше виплата згорне») — ознака манипуляції.',
];

export const INCOMING_SCAM_MESSAGE = {
  source: 'Viber',
  sender: '+38 0XX XXX 19 04',
  text: 'Вам нараховано допомогу 6500 грн від держави. Перевірте картку та перейдіть за посиланням для зарахування: https://dopomoga-ukr.store/verify',
  risk: 94,
};
