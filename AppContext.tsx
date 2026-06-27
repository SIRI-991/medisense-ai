import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  defaultProfile,
  defaultSettings,
  historyEntries,
  todayMedicines,
} from '../lib/mockData';
import type {
  AppSettings,
  HistoryEntry,
  Medicine,
  PageKey,
  PatientProfile,
  ScanResult,
} from '../lib/types';

interface AppContextValue {
  page: PageKey;
  setPage: (page: PageKey) => void;

  medicines: Medicine[];
  setMedicines: React.Dispatch<React.SetStateAction<Medicine[]>>;
  activeMedicine: Medicine | null;
  setActiveMedicine: (m: Medicine | null) => void;

  lastScan: ScanResult | null;
  setLastScan: (s: ScanResult | null) => void;

  history: HistoryEntry[];
  addHistoryEntry: (entry: HistoryEntry) => void;

  profile: PatientProfile;
  setProfile: React.Dispatch<React.SetStateAction<PatientProfile>>;

  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;

  notifications: NotificationItem[];
  pushNotification: (n: Omit<NotificationItem, 'id' | 'time' | 'read'>) => void;
  markAllRead: () => void;
  unreadCount: number;

  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  tone: 'info' | 'success' | 'warning' | 'danger';
  time: string;
  read: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageKey>('landing');
  const [medicines, setMedicines] = useState<Medicine[]>(todayMedicines);
  const [activeMedicine, setActiveMedicine] = useState<Medicine | null>(null);
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(historyEntries);
  const [profile, setProfile] = useState<PatientProfile>(defaultProfile);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      title: 'Time for Atorvastatin',
      body: 'Your 1:00 PM medicine is due. Please scan to verify.',
      tone: 'info',
      time: '12:55',
      read: false,
    },
    {
      id: 'n-2',
      title: 'Verification successful',
      body: 'Paracetamol 500mg verified. Safe to take.',
      tone: 'success',
      time: '08:04',
      read: true,
    },
    {
      id: 'n-3',
      title: 'Wrong medicine detected',
      body: 'Rosuvastatin scanned instead of Atorvastatin. Reminder continues.',
      tone: 'danger',
      time: 'Yesterday',
      read: true,
    },
  ]);

  // Apply dark mode class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [settings.darkMode]);

  const addHistoryEntry = useCallback((entry: HistoryEntry) => {
    setHistory((prev) => [entry, ...prev]);
  }, []);

  const pushNotification = useCallback(
    (n: Omit<NotificationItem, 'id' | 'time' | 'read'>) => {
      const item: NotificationItem = {
        ...n,
        id: `n-${Date.now()}`,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        read: false,
      };
      setNotifications((prev) => [item, ...prev].slice(0, 30));
    },
    [],
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const value: AppContextValue = {
    page,
    setPage,
    medicines,
    setMedicines,
    activeMedicine,
    setActiveMedicine,
    lastScan,
    setLastScan,
    history,
    addHistoryEntry,
    profile,
    setProfile,
    settings,
    setSettings,
    notifications,
    pushNotification,
    markAllRead,
    unreadCount,
    sidebarOpen,
    setSidebarOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
