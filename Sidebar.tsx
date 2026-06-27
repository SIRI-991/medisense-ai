import {
  LayoutDashboard,
  Pill,
  ScanLine,
  History,
  Settings,
  UserCircle,
  Stethoscope,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { PageKey } from '../../lib/types';
import { cn } from '../../lib/utils';

interface NavItem {
  key: PageKey;
  label: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'schedule', label: 'Medicine Schedule', icon: Pill },
  { key: 'scan', label: 'Scan Medicine', icon: ScanLine },
  { key: 'history', label: 'History', icon: History },
  { key: 'settings', label: 'Settings', icon: Settings },
  { key: 'profile', label: 'Profile', icon: UserCircle },
];

export function Sidebar() {
  const { page, setPage, sidebarOpen, setSidebarOpen } = useApp();

  const handleNav = (key: PageKey) => {
    setPage(key);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-72 transform border-r border-ink-200/70 bg-white/80 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 dark:bg-ink-900/80 dark:border-ink-800',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between gap-2 px-6 py-5">
            <button
              onClick={() => handleNav('landing')}
              className="flex items-center gap-3 text-left"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-glow">
                <Stethoscope className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-success-500 dark:border-ink-900" />
              </div>
              <div>
                <p className="font-display text-base font-bold leading-tight text-ink-900 dark:text-white">
                  MediSense
                </p>
                <p className="text-[11px] font-medium uppercase tracking-wider text-primary-600 dark:text-primary-300">
                  AI Assistant
                </p>
              </div>
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 lg:hidden dark:hover:bg-ink-800"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
            <p className="px-3 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
              Menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = page === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleNav(item.key)}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                    active
                      ? 'bg-primary-600 text-white shadow-glow'
                      : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-white',
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 shrink-0 transition-transform',
                      active ? 'scale-110' : 'group-hover:scale-110',
                    )}
                  />
                  <span>{item.label}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/80" />}
                </button>
              );
            })}
          </nav>

          {/* Footer card */}
          <div className="p-4">
            <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-4 text-white shadow-glow">
              <p className="font-display text-sm font-semibold">Emergency Mode</p>
              <p className="mt-1 text-xs text-primary-100">
                Reminders escalate every 10 min until verified.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="flex h-2 w-2 rounded-full bg-success-400 animate-pulse" />
                <span>System active</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
