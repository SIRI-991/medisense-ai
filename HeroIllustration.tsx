import { Camera, Pill, BrainCircuit, ShieldCheck, ScanLine } from 'lucide-react';

export function HeroIllustration() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border border-primary-200/60 bg-gradient-to-br from-primary-50 to-white dark:from-primary-500/10 dark:to-ink-900" />
      <div className="absolute inset-6 rounded-full border-2 border-dashed border-primary-200/70 dark:border-primary-500/20 animate-spin-slow" />

      {/* Center AI core */}
      <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-glow">
        <div className="absolute inset-0 rounded-full bg-primary-500/30 animate-pulse-ring" />
        <BrainCircuit className="h-12 w-12" />
        <span className="absolute -bottom-7 whitespace-nowrap rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-700 shadow-soft dark:bg-ink-900 dark:text-primary-300">
          AI Engine
        </span>
      </div>

      {/* Floating nodes */}
      <FloatNode
        className="left-2 top-10"
        icon={<Pill className="h-5 w-5" />}
        tone="primary"
        label="Medicine"
        delay="0s"
      />
      <FloatNode
        className="right-2 top-10"
        icon={<Camera className="h-5 w-5" />}
        tone="neutral"
        label="Camera"
        delay="1.5s"
      />
      <FloatNode
        className="left-2 bottom-12"
        icon={<ScanLine className="h-5 w-5" />}
        tone="primary"
        label="Scan"
        delay="0.7s"
      />
      <FloatNode
        className="right-2 bottom-12"
        icon={<ShieldCheck className="h-5 w-5" />}
        tone="success"
        label="Verified"
        delay="2.2s"
      />

      {/* Connecting lines (SVG) */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        fill="none"
        preserveAspectRatio="none"
      >
        <g stroke="currentColor" strokeWidth="0.4" className="text-primary-300/60 dark:text-primary-500/30">
          <line x1="20" y1="28" x2="50" y2="50" strokeDasharray="2 2" />
          <line x1="80" y1="28" x2="50" y2="50" strokeDasharray="2 2" />
          <line x1="20" y1="72" x2="50" y2="50" strokeDasharray="2 2" />
          <line x1="80" y1="72" x2="50" y2="50" strokeDasharray="2 2" />
        </g>
      </svg>
    </div>
  );
}

interface FloatNodeProps {
  className: string;
  icon: React.ReactNode;
  tone: 'primary' | 'neutral' | 'success';
  label: string;
  delay: string;
}

function FloatNode({ className, icon, tone, label, delay }: FloatNodeProps) {
  const toneClasses = {
    primary: 'bg-primary-600 text-white shadow-glow',
    neutral: 'bg-white text-ink-700 shadow-card dark:bg-ink-800 dark:text-ink-200',
    success: 'bg-success-600 text-white shadow-success',
  } as const;
  return (
    <div
      className={`absolute flex flex-col items-center gap-1.5 animate-float ${className}`}
      style={{ animationDelay: delay }}
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses[tone]}`}>
        {icon}
      </div>
      <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-ink-700 shadow-soft dark:bg-ink-900/90 dark:text-ink-200">
        {label}
      </span>
    </div>
  );
}
