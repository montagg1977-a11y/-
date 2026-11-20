export type MessengerKey = 'viber' | 'telegram' | 'whatsapp' | 'instagram' | 'sms';

export interface MessengerState {
  key: MessengerKey;
  label: string;
  protected: boolean;
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface AnalysisResult {
  risk: number; // 0-100
  level: RiskLevel;
  inputType: 'phone' | 'link' | 'nickname' | 'text';
  tags: string[];
  flaggedPhrases: string[];
  flaggedLinks: string[];
  summary: string;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  relation: string;
  messengers: string;
  shieldActive: boolean;
}

export type Plan = 'free' | 'personal' | 'family';

export interface PlanInfo {
  id: Plan;
  title: string;
  price: number;
  period: string;
  features: string[];
  highlight?: boolean;
}
