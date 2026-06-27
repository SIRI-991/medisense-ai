import { useEffect, useRef, useState } from 'react';
import { Bell, Menu, Search, Stethoscope } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import type { PageKey } from '../../lib/types';

const pageTitles: Record<PageKey, { title: string; subtitle: string }> = {
  landing: { title: 'Welcome', subtitle: 'AI-Powered Medication Verification' },
  dashboard: { title: 'Dashboard', subtitle: 'Your medication overview for today' },
  schedule: { title: 'Medicine Schedule', subtitle: 'Plan and manage daily medicines' },
  scan: { title: 'Scan Medicine', subtitle: 'AI vision verification before intake' },
  result: { title: 'Verification Result', subtitle: 'AI decision engine outcome' },
  history: { title: 'History', subtitle: 'Past verifications and reminders' },
  settings: { title: 'Settings', subtitle: 'Configure reminders and preferences' },
  profile: { title: 'Profile', subtitle: 'Patient and care team information' },
};

export function Topbar() {
  const { page, setSidebarOpen, notifications, unreadCount, markAllRead, profile } = useApp();
  const [now, setNow] = useState(new Date());
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const meta = pageTitles[page];
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <header className="sticky top-0 z-20 border-b border-ink-200/70 bg-white/80 backdrop-blur-xl dark:bg-ink-900/80 dark:border-ink-800">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-ink-600 hover:bg-ink-100 lg:hidden dark:text-ink-300 dark:hover:bg-ink-800"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white">
            <Stethoscope className="h-4 w-4" />
          </div>
          <span className="font-display text-sm font-bold text-ink-900 dark:text-white">
            MediSense AI
          </span>
        </div>

        <div className="hidden min-w-0 lg:block">
          <h1 className="font-display text-lg font-bold text-ink-900 dark:text-white">
            {meta.title}
          </h1>
          <p className="truncate text-xs text-ink-500 dark:text-ink-400">{meta.subtitle}</p>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="hidden items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-500 md:flex dark:bg-ink-900 dark:border-ink-700">
            <Search className="h-4 w-4" />
            <input
              placeholder="Search medicines…"
              className="w-40 bg-transparent text-ink-700 placeholder-ink-400 focus:outline-none dark:text-ink-200"
            />
          </div>

          {/* Clock */}
          <div className="hidden items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 py-1.5 sm:flex dark:bg-ink-900 dark:border-ink-700">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
              <span className="text-xs font-bold">{timeStr.slice(0, 2)}</span>
            </div>
            <div className="leading-tight">
              <p className="font-mono text-sm font-semibold text-ink-900 dark:text-white">
                {timeStr}
              </p>
              <p className="text-[10px] text-ink-500 dark:text-ink-400">{dateStr}</p>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative" ref={bellRef}>
            <button
              onClick={() => {
                setBellOpen((v) => !v);
                if (!bellOpen) markAllRead();
              }}
              className="relative rounded-xl border border-ink-200 bg-white p-2.5 text-ink-600 transition-colors hover:bg-ink-100 dark:bg-ink-900 dark:border-ink-700 dark:text-ink-300 dark:hover:bg-ink-800"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-ink-900">
                  {unreadCount}
                </span>
              )}
            </button>
            {bellOpen && (
              <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card animate-fade-in-scale dark:bg-ink-900 dark:border-ink-700">
                <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3 dark:border-ink-800">
                  <p className="font-display text-sm font-semibold text-ink-900 dark:text-white">
                    Notifications
                  </p>
                  <span className="text-xs text-ink-500">{notifications.length} total</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 && (
                    <p className="px-4 py-6 text-center text-sm text-ink-500">
                      No notifications yet.
                    </p>
                  )}
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        'flex gap-3 border-b border-ink-50 px-4 py-3 last:border-0 dark:border-ink-800/60',
                        !n.read && 'bg-primary-50/40 dark:bg-primary-500/5',
                      )}
                    >
                      <span
                        className={cn(
                          'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                          n.tone === 'success' && 'bg-success-500',
                          n.tone === 'danger' && 'bg-danger-500',
                          n.tone === 'warning' && 'bg-warning-500',
                          n.tone === 'info' && 'bg-primary-500',
                        )}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink-900 dark:text-white">
                          {n.title}
                        </p>
                        <p className="text-xs text-ink-500 dark:text-ink-400">{n.body}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-ink-400">
                          {n.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Avatar */}
          <button className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white py-1.5 pl-1.5 pr-3 transition-colors hover:bg-ink-100 dark:bg-ink-900 dark:border-ink-700 dark:hover:bg-ink-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white">
              {profile.name
                .split(' ')
                .map((s) => s[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold leading-tight text-ink-900 dark:text-white">
                {profile.name.split(' ')[0]}
              </p>
              <p className="text-[10px] text-ink-500 dark:text-ink-400">Patient</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
