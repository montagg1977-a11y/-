import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { MessengerKey, Plan, ConnectedDevice } from '../types';
import { LS_KEYS, loadJSON, saveJSON, loadString, saveString } from '../lib/storage';
import { MESSengers } from '../constants';

interface ProtectionContextValue {
  shieldActive: boolean;
  toggleShield: () => void;
  messengers: Record<MessengerKey, boolean>;
  toggleMessenger: (key: MessengerKey) => void;
  strangersOnly: boolean;
  toggleStrangersOnly: () => void;
  plan: Plan;
  setPlan: (plan: Plan) => void;
  isPro: boolean;
  isFamily: boolean;
  devices: ConnectedDevice[];
  addDevice: (device: Omit<ConnectedDevice, 'id'>) => void;
  removeDevice: (id: string) => void;
  toggleDeviceShield: (id: string) => void;
  paywallOpen: boolean;
  openPaywall: () => void;
  closePaywall: () => void;
}

const ProtectionContext = createContext<ProtectionContextValue | null>(null);

function initialMessengers(): Record<MessengerKey, boolean> {
  const saved = loadJSON<Record<MessengerKey, boolean> | null>(LS_KEYS.messengers, null);
  if (saved) return saved;
  const obj = {} as Record<MessengerKey, boolean>;
  for (const m of MESSengers) obj[m.key] = m.key === 'viber' || m.key === 'sms';
  return obj;
}

function initialDevices(): ConnectedDevice[] {
  return loadJSON<ConnectedDevice[]>(LS_KEYS.devices, [
    { id: 'd1', name: 'Мама', relation: 'Батьки', messengers: 'Viber / SMS', shieldActive: true },
  ]);
}

export function ProtectionProvider({ children }: { children: ReactNode }) {
  const [shieldActive, setShieldActive] = useState<boolean>(() => loadJSON(LS_KEYS.shield, true));
  const [messengers, setMessengers] = useState<Record<MessengerKey, boolean>>(initialMessengers);
  const [strangersOnly, setStrangersOnly] = useState<boolean>(() => loadJSON(LS_KEYS.strangersOnly, true));
  const [plan, setPlanState] = useState<Plan>(() => loadString(LS_KEYS.pro, 'free') as Plan);
  const [devices, setDevices] = useState<ConnectedDevice[]>(initialDevices);
  const [paywallOpen, setPaywallOpen] = useState(false);

  // URL unlock parameter for testing: ?unlock=komisar2026
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const unlock = params.get('unlock');
      if (unlock === 'komisar2026') {
        setPlanState('family');
        saveString(LS_KEYS.pro, 'family');
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => saveJSON(LS_KEYS.shield, shieldActive), [shieldActive]);
  useEffect(() => saveJSON(LS_KEYS.messengers, messengers), [messengers]);
  useEffect(() => saveJSON(LS_KEYS.strangersOnly, strangersOnly), [strangersOnly]);
  useEffect(() => saveJSON(LS_KEYS.devices, devices), [devices]);
  useEffect(() => saveString(LS_KEYS.pro, plan), [plan]);

  const toggleShield = useCallback(() => setShieldActive((v) => !v), []);
  const toggleMessenger = useCallback(
    (key: MessengerKey) => setMessengers((prev) => ({ ...prev, [key]: !prev[key] })),
    [],
  );
  const toggleStrangersOnly = useCallback(() => setStrangersOnly((v) => !v), []);
  const setPlan = useCallback((p: Plan) => setPlanState(p), []);
  const openPaywall = useCallback(() => setPaywallOpen(true), []);
  const closePaywall = useCallback(() => setPaywallOpen(false), []);

  const addDevice = useCallback((device: Omit<ConnectedDevice, 'id'>) => {
    setDevices((prev) => [...prev, { ...device, id: `d${Date.now()}` }]);
  }, []);
  const removeDevice = useCallback((id: string) => setDevices((prev) => prev.filter((d) => d.id !== id)), []);
  const toggleDeviceShield = useCallback(
    (id: string) => setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, shieldActive: !d.shieldActive } : d))),
    [],
  );

  const value = useMemo<ProtectionContextValue>(
    () => ({
      shieldActive,
      toggleShield,
      messengers,
      toggleMessenger,
      strangersOnly,
      toggleStrangersOnly,
      plan,
      setPlan,
      isPro: plan !== 'free',
      isFamily: plan === 'family',
      devices,
      addDevice,
      removeDevice,
      toggleDeviceShield,
      paywallOpen,
      openPaywall,
      closePaywall,
    }),
    [shieldActive, toggleShield, messengers, toggleMessenger, strangersOnly, toggleStrangersOnly, plan, setPlan, devices, addDevice, removeDevice, toggleDeviceShield, paywallOpen, openPaywall, closePaywall],
  );

  return <ProtectionContext.Provider value={value}>{children}</ProtectionContext.Provider>;
}

export function useProtection(): ProtectionContextValue {
  const ctx = useContext(ProtectionContext);
  if (!ctx) throw new Error('useProtection must be used within ProtectionProvider');
  return ctx;
}
