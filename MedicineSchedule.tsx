import { useState } from 'react';
import {
  Pill,
  Plus,
  Clock,
  ScanLine,
  CheckCircle2,
  CalendarDays,
  Sun,
  Moon,
  Coffee,
  Utensils,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MedicineStatusBadge, VerificationBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { relativeTimeFromNow } from '../lib/utils';
import type { Medicine } from '../lib/types';

const timeOfDayIcon = (time: string) => {
  const h = parseInt(time.split(':')[0], 10);
  if (h < 11) return { icon: Sun, label: 'Morning', tone: 'warning' as const };
  if (h < 16) return { icon: Coffee, label: 'Midday', tone: 'primary' as const };
  if (h < 20) return { icon: Utensils, label: 'Evening', tone: 'primary' as const };
  return { icon: Moon, label: 'Night', tone: 'primary' as const };
};

export function MedicineSchedule() {
  const { medicines, setMedicines, setActiveMedicine, setPage } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    dosage: '',
    form: 'Tablet' as Medicine['form'],
    scheduledTime: '08:00',
    notes: '',
  });

  const sorted = [...medicines].sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const newMed: Medicine = {
      id: `med-${Date.now()}`,
      name: form.name.trim(),
      dosage: form.dosage || '—',
      form: form.form,
      scheduledTime: form.scheduledTime,
      status: 'pending',
      verification: 'pending',
      notes: form.notes,
      color: 'primary',
    };
    setMedicines((prev) => [...prev, newMed]);
    setForm({ name: '', dosage: '', form: 'Tablet', scheduledTime: '08:00', notes: '' });
    setAddOpen(false);
  };

  const handleRemove = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const handleScan = (m: Medicine) => {
    setActiveMedicine(m);
    setPage('scan');
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white">
                Daily Medicine Schedule
              </h2>
              <p className="text-sm text-ink-500 dark:text-ink-400">
                {medicines.length} medicines · {medicines.filter((m) => m.status === 'taken').length} verified today
              </p>
            </div>
          </div>
          <Button onClick={() => setAddOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
            Add Medicine
          </Button>
        </div>
      </Card>

      {/* Timeline view */}
      <Card>
        <CardHeader
          title="Today's Timeline"
          subtitle="Grouped by time of day"
          icon={<Clock className="h-5 w-5" />}
        />
        <div className="space-y-2 p-5 pt-3">
          {sorted.map((m) => {
            const meta = timeOfDayIcon(m.scheduledTime);
            const Icon = meta.icon;
            return (
              <div
                key={m.id}
                className="group flex flex-col gap-3 rounded-2xl border border-ink-100 p-4 transition-all hover:border-primary-200 hover:shadow-soft sm:flex-row sm:items-center dark:border-ink-800 dark:hover:border-primary-500/30"
              >
                <div className="flex items-center gap-3 sm:w-56">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-mono text-lg font-bold text-ink-900 dark:text-white">
                      {m.scheduledTime}
                    </p>
                    <p className="text-xs text-ink-500">{meta.label} · {relativeTimeFromNow(m.scheduledTime)}</p>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-primary-600" />
                    <p className="font-display text-base font-bold text-ink-900 dark:text-white">
                      {m.name}
                    </p>
                    <Badge tone="neutral">{m.dosage}</Badge>
                    <Badge tone="info">{m.form}</Badge>
                  </div>
                  {m.notes && (
                    <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{m.notes}</p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <MedicineStatusBadge status={m.status} />
                    <VerificationBadge status={m.verification} />
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:ml-auto">
                  {m.status === 'taken' ? (
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-success-600">
                      <CheckCircle2 className="h-4 w-4" /> Verified
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleScan(m)}
                      leftIcon={<ScanLine className="h-4 w-4" />}
                    >
                      Scan
                    </Button>
                  )}
                  <button
                    onClick={() => handleRemove(m.id)}
                    className="rounded-lg p-2 text-ink-400 opacity-0 transition-opacity hover:bg-danger-50 hover:text-danger-600 group-hover:opacity-100 dark:hover:bg-danger-500/10"
                    aria-label="Remove medicine"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Add medicine modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Medicine"
        subtitle="Add a new entry to the daily schedule"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} leftIcon={<Plus className="h-4 w-4" />}>
              Add to schedule
            </Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">
              Medicine name
            </label>
            <input
              className="input"
              placeholder="e.g. Paracetamol"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">
                Dosage
              </label>
              <input
                className="input"
                placeholder="e.g. 500mg"
                value={form.dosage}
                onChange={(e) => setForm({ ...form, dosage: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">
                Form
              </label>
              <select
                className="input"
                value={form.form}
                onChange={(e) => setForm({ ...form, form: e.target.value as Medicine['form'] })}
              >
                {['Tablet', 'Capsule', 'Syrup', 'Injection', 'Inhaler'].map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">
              Scheduled time
            </label>
            <input
              type="time"
              className="input"
              value={form.scheduledTime}
              onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">
              Notes (optional)
            </label>
            <input
              className="input"
              placeholder="e.g. Take with breakfast"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
