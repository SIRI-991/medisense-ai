import {
  Settings as SettingsIcon,
  Bell,
  Volume2,
  Globe,
  Moon,
  Phone,
  Save,
  RotateCcw,
  Mail,
  MessageSquare,
  Smartphone,
  Mic2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/utils';

export function Settings() {
  const { settings, setSettings } = useApp();

  const update = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateNotification = (key: keyof typeof settings.notifications, value: boolean) => {
    setSettings((prev) => ({ ...prev, notifications: { ...prev.notifications, [key]: value } }));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Reminder settings */}
        <Card>
          <CardHeader
            title="Reminder"
            subtitle="How and how often reminders fire"
            icon={<Bell className="h-5 w-5" />}
          />
          <div className="space-y-5 p-5 pt-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">
                Reminder interval (minutes)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={5}
                  value={settings.reminderInterval}
                  onChange={(e) => update('reminderInterval', Number(e.target.value))}
                  className="flex-1 accent-primary-600"
                />
                <span className="w-12 rounded-lg bg-primary-50 px-2 py-1 text-center text-sm font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                  {settings.reminderInterval}m
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-500">
                Reminder repeats every {settings.reminderInterval} min until a valid medicine is scanned.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">
                Alarm volume
              </label>
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-ink-400" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={settings.alarmVolume}
                  onChange={(e) => update('alarmVolume', Number(e.target.value))}
                  className="flex-1 accent-primary-600"
                />
                <span className="w-12 rounded-lg bg-primary-50 px-2 py-1 text-center text-sm font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                  {settings.alarmVolume}%
                </span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">
                Voice language
              </label>
              <div className="relative">
                <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <select
                  value={settings.voiceLanguage}
                  onChange={(e) => update('voiceLanguage', e.target.value as typeof settings.voiceLanguage)}
                  className="input pl-9"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Spanish (Spain)</option>
                  <option value="fr-FR">French (France)</option>
                  <option value="hi-IN">Hindi (India)</option>
                  <option value="ta-IN">Tamil (India)</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Appearance + emergency */}
        <Card>
          <CardHeader
            title="Appearance & Emergency"
            subtitle="Display and safety contacts"
            icon={<SettingsIcon className="h-5 w-5" />}
          />
          <div className="space-y-5 p-5 pt-3">
            <ToggleRow
              icon={<Moon className="h-4 w-4" />}
              label="Dark mode"
              hint="Switch the interface to a dark theme"
              checked={settings.darkMode}
              onChange={(v) => update('darkMode', v)}
            />
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">
                Emergency contact
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  className="input pl-9"
                  value={settings.emergencyContact}
                  onChange={(e) => update('emergencyContact', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <p className="mt-1 text-xs text-ink-500">
                Contacted automatically if a reminder is overdue by more than 30 minutes.
              </p>
            </div>

            <div className="rounded-xl bg-primary-50 p-3 text-xs text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
              <p className="font-semibold">Escalation policy</p>
              <p className="mt-0.5">
                After 3 failed verifications, the emergency contact is alerted with the medicine name and last scan result.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Notification preferences */}
      <Card>
        <CardHeader
          title="Notification Preferences"
          subtitle="Choose how MediSense AI reaches you"
          icon={<Bell className="h-5 w-5" />}
        />
        <div className="grid gap-3 p-5 pt-3 sm:grid-cols-2 lg:grid-cols-4">
          <NotificationToggle
            icon={<Smartphone className="h-5 w-5" />}
            label="Push"
            description="In-app + browser push"
            checked={settings.notifications.push}
            onChange={(v) => updateNotification('push', v)}
          />
          <NotificationToggle
            icon={<Mail className="h-5 w-5" />}
            label="Email"
            description="Daily summary + alerts"
            checked={settings.notifications.email}
            onChange={(v) => updateNotification('email', v)}
          />
          <NotificationToggle
            icon={<MessageSquare className="h-5 w-5" />}
            label="SMS"
            description="Text alerts only"
            checked={settings.notifications.sms}
            onChange={(v) => updateNotification('sms', v)}
          />
          <NotificationToggle
            icon={<Mic2 className="h-5 w-5" />}
            label="Voice"
            description="Spoken confirmation"
            checked={settings.notifications.voice}
            onChange={(v) => updateNotification('voice', v)}
          />
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge tone="success" dot>
            Auto-saved
          </Badge>
          <span className="text-xs text-ink-500">Changes apply immediately.</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() =>
              setSettings({
                reminderInterval: 10,
                voiceLanguage: 'en-US',
                alarmVolume: 70,
                darkMode: false,
                emergencyContact: '+1 (415) 555-0142',
                notifications: { push: true, email: true, sms: false, voice: true },
              })
            }
            leftIcon={<RotateCcw className="h-4 w-4" />}
          >
            Reset to defaults
          </Button>
          <Button leftIcon={<Save className="h-4 w-4" />}>Save preferences</Button>
        </div>
      </div>
    </div>
  );
}

interface ToggleRowProps {
  icon: React.ReactNode;
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ icon, label, hint, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-ink-100 p-3 dark:border-ink-800">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-ink-900 dark:text-white">{label}</p>
          <p className="text-xs text-ink-500">{hint}</p>
        </div>
      </div>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}

interface NotificationToggleProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function NotificationToggle({ icon, label, description, checked, onChange }: NotificationToggleProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-4 transition-colors',
        checked
          ? 'border-primary-300 bg-primary-50/60 dark:border-primary-500/40 dark:bg-primary-500/10'
          : 'border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-900',
      )}
    >
      <div className="flex items-center justify-between">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', checked ? 'bg-primary-600 text-white' : 'bg-ink-100 text-ink-500 dark:bg-ink-800')}>
          {icon}
        </div>
        <Switch checked={checked} onChange={onChange} />
      </div>
      <p className="mt-3 font-display text-sm font-bold text-ink-900 dark:text-white">{label}</p>
      <p className="text-xs text-ink-500 dark:text-ink-400">{description}</p>
    </div>
  );
}

interface SwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}

function Switch({ checked, onChange }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
        checked ? 'bg-primary-600' : 'bg-ink-200 dark:bg-ink-700',
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  );
}
