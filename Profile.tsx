import {
  User,
  HeartPulse,
  Phone,
  Stethoscope,
  Pill,
  AlertCircle,
  Droplet,
  Ruler,
  Weight,
  Activity,
  ShieldAlert,
  Pencil,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/utils';

export function Profile() {
  const { profile } = useApp();
  const initials = profile.name
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="space-y-6">
      {/* Header card */}
      <Card className="overflow-hidden">
        <div className="relative h-28 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 left-6 h-32 w-32 rounded-full bg-success-400/20 blur-2xl" />
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-2xl font-bold text-white shadow-card ring-4 ring-white dark:ring-ink-900">
                {initials}
              </div>
              <div className="pb-1">
                <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white">
                  {profile.name}
                </h2>
                <p className="text-sm text-ink-500 dark:text-ink-400">
                  {profile.age} yrs · {profile.gender} · {profile.bloodGroup}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge tone="primary" dot>
                    <HeartPulse className="h-3 w-3" /> Active patient
                  </Badge>
                  <Badge tone="success">Compliance 88%</Badge>
                </div>
              </div>
            </div>
            <Button variant="outline" leftIcon={<Pencil className="h-4 w-4" />}>
              Edit profile
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Personal info */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Personal Information"
            subtitle="Basic health vitals"
            icon={<User className="h-5 w-5" />}
          />
          <div className="grid gap-3 p-5 pt-3 sm:grid-cols-2">
            <InfoTile icon={<Droplet className="h-4 w-4" />} label="Blood group" value={profile.bloodGroup} />
            <InfoTile icon={<Weight className="h-4 w-4" />} label="Weight" value={profile.weight} />
            <InfoTile icon={<Ruler className="h-4 w-4" />} label="Height" value={profile.height} />
            <InfoTile icon={<Activity className="h-4 w-4" />} label="Age" value={`${profile.age} years`} />
          </div>

          <div className="px-5 pb-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
              Medical conditions
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.medicalConditions.map((c) => (
                <Badge key={c} tone="warning">
                  <AlertCircle className="h-3 w-3" /> {c}
                </Badge>
              ))}
            </div>

            <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-ink-500">
              Allergies
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.allergies.map((a) => (
                <Badge key={a} tone="danger">
                  <ShieldAlert className="h-3 w-3" /> {a}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Emergency contact */}
        <Card>
          <CardHeader
            title="Emergency Contact"
            subtitle="Notified on escalation"
            icon={<Phone className="h-5 w-5" />}
          />
          <div className="p-5 pt-3">
            <div className="rounded-2xl bg-gradient-to-br from-danger-50 to-white p-4 dark:from-danger-500/10 dark:to-ink-900">
              <p className="font-display text-lg font-bold text-ink-900 dark:text-white">
                {profile.emergencyContact.name}
              </p>
              <p className="text-sm text-ink-500">{profile.emergencyContact.relationship}</p>
              <p className="mt-2 flex items-center gap-2 font-mono text-sm font-semibold text-danger-700 dark:text-danger-300">
                <Phone className="h-4 w-4" /> {profile.emergencyContact.phone}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Doctor + medicines */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Primary Doctor"
            subtitle="Care team"
            icon={<Stethoscope className="h-5 w-5" />}
          />
          <div className="p-5 pt-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-base font-bold text-ink-900 dark:text-white">
                  {profile.doctor.name}
                </p>
                <p className="text-sm text-ink-500">{profile.doctor.specialty}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <InfoTile icon={<Phone className="h-4 w-4" />} label="Phone" value={profile.doctor.phone} />
              <InfoTile icon={<Stethoscope className="h-4 w-4" />} label="Hospital" value={profile.doctor.hospital} />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Current Medicines"
            subtitle="Active prescriptions"
            icon={<Pill className="h-5 w-5" />}
          />
          <div className="p-5 pt-3">
            <ul className="space-y-2">
              {profile.currentMedicines.map((m) => (
                <li
                  key={m}
                  className="flex items-center gap-3 rounded-xl border border-ink-100 p-3 dark:border-ink-800"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
                    <Pill className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-ink-800 dark:text-ink-100">{m}</span>
                  <span className="ml-auto h-2 w-2 rounded-full bg-success-500" />
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface InfoTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoTile({ icon, label, value }: InfoTileProps) {
  return (
    <div className="rounded-xl border border-ink-100 p-3 dark:border-ink-800">
      <div className="flex items-center gap-2">
        <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300')}>
          {icon}
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</p>
      </div>
      <p className="mt-2 font-display text-base font-bold text-ink-900 dark:text-white">{value}</p>
    </div>
  );
}
