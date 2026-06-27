import {
  Clock,
  BellRing,
  Pill,
  Camera,
  BrainCircuit,
  ScanText,
  Cpu,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowDown,
  RotateCw,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface FlowNode {
  icon: typeof Clock;
  label: string;
  tone: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
}

const toneClasses: Record<FlowNode['tone'], string> = {
  primary: 'from-primary-500 to-primary-700 text-white shadow-glow',
  success: 'from-success-500 to-success-700 text-white shadow-success',
  warning: 'from-warning-500 to-warning-600 text-white shadow-warning',
  danger: 'from-danger-500 to-danger-600 text-white shadow-danger',
  neutral: 'from-ink-500 to-ink-700 text-white',
};

const flow: FlowNode[] = [
  { icon: Clock, label: 'Medicine Time', tone: 'primary' },
  { icon: BellRing, label: 'Reminder', tone: 'primary' },
  { icon: Pill, label: 'Patient Presents Medicine', tone: 'neutral' },
  { icon: Camera, label: 'Camera Capture', tone: 'neutral' },
  { icon: BrainCircuit, label: 'Afferens Vision API', tone: 'primary' },
  { icon: ScanText, label: 'OCR Expiry Detection', tone: 'primary' },
  { icon: Cpu, label: 'AI Decision Engine', tone: 'primary' },
];

export function ArchitectureFlow() {
  return (
    <div className="rounded-3xl border border-ink-200/70 bg-white/70 p-6 backdrop-blur-xl dark:bg-ink-900/60 dark:border-ink-800 sm:p-8">
      <div className="mb-6 text-center">
        <span className="badge bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
          How it works
        </span>
        <h3 className="mt-3 font-display text-2xl font-bold text-ink-900 dark:text-white">
          The MediSense AI Verification Pipeline
        </h3>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
          From scheduled reminder to verified intake — every step is AI-checked.
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        {flow.map((node, i) => {
          const Icon = node.icon;
          return (
            <div key={node.label}>
              <div className="flex items-center justify-center">
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-2xl bg-gradient-to-br px-5 py-3.5',
                    toneClasses[node.tone],
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-display text-sm font-semibold">{node.label}</span>
                </div>
              </div>
              {i < flow.length - 1 && (
                <div className="flex justify-center py-1.5">
                  <ArrowDown className="h-4 w-4 text-ink-300" />
                </div>
              )}
            </div>
          );
        })}

        {/* Decision branch */}
        <div className="flex justify-center py-1.5">
          <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-600 dark:bg-ink-800 dark:text-ink-300">
            Correct?
          </span>
        </div>
        <div className="flex justify-center py-1.5">
          <ArrowDown className="h-4 w-4 text-ink-300" />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-success-200 bg-success-50 p-4 text-center dark:border-success-500/30 dark:bg-success-500/10">
            <CheckCircle2 className="mx-auto h-7 w-7 text-success-600" />
            <p className="mt-2 font-display text-sm font-bold text-success-700 dark:text-success-300">
              Verified
            </p>
            <p className="text-xs text-success-700/80 dark:text-success-300/80">
              Safe to take
            </p>
          </div>
          <div className="rounded-2xl border border-danger-200 bg-danger-50 p-4 text-center dark:border-danger-500/30 dark:bg-danger-500/10">
            <XCircle className="mx-auto h-7 w-7 text-danger-600" />
            <p className="mt-2 font-display text-sm font-bold text-danger-700 dark:text-danger-300">
              Wrong Medicine
            </p>
            <p className="text-xs text-danger-700/80 dark:text-danger-300/80">
              Reminder continues
            </p>
          </div>
          <div className="rounded-2xl border border-warning-200 bg-warning-50 p-4 text-center dark:border-warning-500/30 dark:bg-warning-500/10">
            <AlertTriangle className="mx-auto h-7 w-7 text-warning-600" />
            <p className="mt-2 font-display text-sm font-bold text-warning-700 dark:text-warning-300">
              Expired
            </p>
            <p className="text-xs text-warning-700/80 dark:text-warning-300/80">
              Do not consume
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-500 dark:text-ink-400">
          <RotateCw className="h-3.5 w-3.5" />
          <span>Reminder repeats every 10 minutes until a valid medicine is scanned.</span>
        </div>
      </div>
    </div>
  );
}
