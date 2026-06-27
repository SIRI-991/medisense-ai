import {
  ArrowRight,
  PlayCircle,
  ShieldCheck,
  BrainCircuit,
  ScanText,
  BellRing,
  Activity,
  Clock,
  CheckCircle2,
  Star,
  HeartPulse,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { HeroIllustration } from '../components/landing/HeroIllustration';
import { ArchitectureFlow } from '../components/landing/ArchitectureFlow';

const features = [
  {
    icon: BrainCircuit,
    title: 'AI Vision Verification',
    body: 'The Afferens Vision API identifies the medicine from a single webcam frame before intake.',
    tone: 'primary',
  },
  {
    icon: ScanText,
    title: 'OCR Expiry Detection',
    body: 'Printed expiry dates are extracted with OCR and validated against today’s date.',
    tone: 'primary',
  },
  {
    icon: BellRing,
    title: 'Smart Escalating Reminders',
    body: 'Reminders repeat every 10 minutes with alarm + voice until a valid medicine is scanned.',
    tone: 'warning',
  },
  {
    icon: ShieldCheck,
    title: 'Three-Way Safety Decision',
    body: 'Verified, Wrong Medicine, or Expired — each with a clear, color-coded action screen.',
    tone: 'success',
  },
];

const steps = [
  { icon: Clock, label: 'Schedule', desc: 'Set daily medicines & times' },
  { icon: BellRing, label: 'Remind', desc: 'Alarm + medicine name at due time' },
  { icon: Activity, label: 'Scan', desc: 'Webcam captures the strip' },
  { icon: CheckCircle2, label: 'Verify', desc: 'AI confirms & logs the dose' },
];

export function Landing() {
  const { setPage } = useApp();

  return (
    <div className="relative overflow-hidden bg-ink-50 dark:bg-ink-950">
      {/* Background aurora */}
      <div className="pointer-events-none absolute inset-0 bg-aurora" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent" />

      {/* Top bar */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-glow">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-base font-bold leading-tight text-ink-900 dark:text-white">
              MediSense AI
            </p>
            <p className="text-[11px] font-medium uppercase tracking-wider text-primary-600 dark:text-primary-300">
              Intelligent Medication Verification
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setPage('dashboard')}>
            Sign in
          </Button>
          <Button size="sm" onClick={() => setPage('dashboard')} rightIcon={<ArrowRight className="h-4 w-4" />}>
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="animate-fade-in">
            <span className="badge bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
              <ShieldCheck className="h-3.5 w-3.5" /> AI-Powered Healthcare
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-ink-900 dark:text-white sm:text-5xl lg:text-6xl">
              MediSense <span className="text-primary-600 dark:text-primary-400">AI</span>
            </h1>
            <p className="mt-3 font-display text-xl font-semibold text-ink-700 dark:text-ink-200">
              AI-Powered Medication Verification for Safer Healthcare
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-600 dark:text-ink-300">
              MediSense AI goes beyond reminders. Before every dose, the patient scans the
              medicine strip — the AI verifies the correct medicine and checks the expiry date,
              then confirms it is safe to take. Wrong or expired medicines are blocked and the
              reminder keeps escalating until a valid dose is scanned.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={() => setPage('dashboard')} rightIcon={<ArrowRight className="h-5 w-5" />}>
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setPage('scan')}
                leftIcon={<PlayCircle className="h-5 w-5" />}
              >
                View Demo
              </Button>
            </div>

            {/* Trust row */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-ink-500 dark:text-ink-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['A', 'M', 'R', 'S'].map((c) => (
                    <div
                      key={c}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-[10px] font-bold text-white ring-2 ring-white dark:ring-ink-950"
                    >
                      {c}
                    </div>
                  ))}
                </div>
                <span>Trusted by care teams</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex text-warning-500">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span>4.9 patient rating</span>
              </div>
            </div>
          </div>

          <div className="animate-fade-in-scale">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* Steps strip */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Card className="overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-y divide-ink-100 dark:divide-ink-800 sm:grid-cols-4 sm:divide-y-0">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-3 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-300">
                      Step {i + 1}
                    </p>
                    <p className="font-display text-sm font-bold text-ink-900 dark:text-white">
                      {s.label}
                    </p>
                    <p className="text-xs text-ink-500 dark:text-ink-400">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <span className="badge bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-300">
            Why MediSense AI
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink-900 dark:text-white">
            An intelligent assistant, not just a reminder
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-ink-500 dark:text-ink-400">
            Every dose is verified by computer vision and OCR before the patient is cleared to
            take it — built for elderly care and high-stakes regimens.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            const toneBg = {
              primary: 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300',
              success: 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-300',
              warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-300',
            }[f.tone] as string;
            return (
              <Card key={f.title} hover className="p-5">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneBg}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-ink-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
                  {f.body}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Architecture flow */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ArchitectureFlow />
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 p-8 text-white shadow-glow sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-success-400/20 blur-2xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                Ready to make every dose safer?
              </h2>
              <p className="mt-2 max-w-xl text-primary-100">
                Open the dashboard to see today’s schedule, or jump straight to a live scan demo.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="success"
                size="lg"
                onClick={() => setPage('dashboard')}
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Open Dashboard
              </Button>
              <Button
                className="bg-white/10 text-white hover:bg-white/20"
                size="lg"
                onClick={() => setPage('scan')}
                leftIcon={<PlayCircle className="h-5 w-5" />}
              >
                Try Scan Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-ink-200/70 bg-white/60 backdrop-blur-xl dark:border-ink-800 dark:bg-ink-900/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-ink-500 sm:flex-row sm:px-6 lg:px-8 dark:text-ink-400">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-primary-600" />
            <span>MediSense AI — Intelligent Medication Verification Assistant</span>
          </div>
          <p>Built for safer healthcare · Hackathon demo</p>
        </div>
      </footer>
    </div>
  );
}
