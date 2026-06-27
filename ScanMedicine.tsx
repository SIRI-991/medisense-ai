import { useEffect, useRef, useState } from 'react';
import {
  Camera,
  Upload,
  ScanLine,
  RefreshCw,
  AlertCircle,
  Pill,
  BrainCircuit,
  ScanText,
  Cpu,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/utils';
import { verifyMedicine } from '../lib/api';
import type { Medicine } from '../lib/types';

type ScanPhase = 'idle' | 'camera' | 'captured' | 'scanning' | 'done';

interface PipelineStep {
  icon: typeof BrainCircuit;
  label: string;
  status: 'pending' | 'active' | 'done';
}

const initialSteps: PipelineStep[] = [
  { icon: Camera, label: 'Frame captured', status: 'pending' },
  { icon: BrainCircuit, label: 'Afferens Vision API', status: 'pending' },
  { icon: ScanText, label: 'OCR expiry detection', status: 'pending' },
  { icon: Cpu, label: 'AI decision engine', status: 'pending' },
];

export function ScanMedicine() {
  const { activeMedicine, medicines, setActiveMedicine, setLastScan, setPage } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [steps, setSteps] = useState<PipelineStep[]>(initialSteps);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const expected: Medicine = activeMedicine ?? medicines.find((m) => m.status === 'pending') ?? medicines[0];

  // Cleanup camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1280, height: 720 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setPhase('camera');
      setCapturedImage(null);
    } catch (e) {
      setError(
        'Camera access was denied or is unavailable. You can still upload an image of the medicine strip.',
      );
      console.warn('Camera error:', e);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth || 720;
    const h = video.videoHeight || 480;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    const data = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(data);
    setPhase('captured');
    stopCamera();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCapturedImage(reader.result as string);
      setPhase('captured');
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setCapturedImage(null);
    setPhase('idle');
    setSteps(initialSteps);
    setProgress(0);
    setError(null);
  };

  const runScan = async () => {
    if (!capturedImage || !expected) return;
    setPhase('scanning');
    setProgress(0);
    setSteps(initialSteps);

    // Animate pipeline steps
    const stepDelays = [400, 1800, 2800, 3600];
    stepDelays.forEach((delay, i) => {
      setTimeout(() => {
        setSteps((prev) => prev.map((s, idx) => (idx === i ? { ...s, status: 'active' } : s)));
      }, delay);
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, idx) => (idx === i ? { ...s, status: 'done' } : s)),
        );
        setProgress(((i + 1) / stepDelays.length) * 100);
      }, delay + 700);
    });

    try {
      const result = await verifyMedicine(expected, capturedImage);
      // Wait for the animation to finish before navigating
      setTimeout(() => {
        setLastScan(result);
        setPhase('done');
        setPage('result');
      }, 4400);
    } catch (e) {
      setError('Verification failed. Please try again.');
      setPhase('captured');
      console.warn(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Expected medicine banner */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
              <Pill className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                Expected medicine
              </p>
              <p className="font-display text-lg font-bold text-ink-900 dark:text-white">
                {expected?.name} · {expected?.dosage}
              </p>
              <p className="text-sm text-ink-500">
                Scheduled {expected?.scheduledTime} · {expected?.form}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {medicines
              .filter((m) => m.status === 'pending')
              .slice(0, 4)
              .map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMedicine(m)}
                  className={cn(
                    'rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors',
                    m.id === expected?.id
                      ? 'border-primary-300 bg-primary-50 text-primary-700 dark:border-primary-500/40 dark:bg-primary-500/10 dark:text-primary-300'
                      : 'border-ink-200 bg-white text-ink-600 hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300',
                  )}
                >
                  {m.name}
                </button>
              ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Camera / preview */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Scan Medicine Strip"
            subtitle="Use your webcam or upload an image of the medicine packaging"
            icon={<Camera className="h-5 w-5" />}
            action={
              phase !== 'scanning' && (
                <Button variant="ghost" size="sm" onClick={reset} leftIcon={<RefreshCw className="h-4 w-4" />}>
                  Reset
                </Button>
              )
            }
          />
          <div className="p-5 pt-3">
            {/* Viewport */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-ink-200 bg-ink-950 dark:border-ink-700">
              {/* Video feed */}
              {phase === 'camera' && (
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  playsInline
                  muted
                />
              )}

              {/* Captured image */}
              {(phase === 'captured' || phase === 'scanning' || phase === 'done') && capturedImage && (
                <img src={capturedImage} alt="Captured medicine" className="h-full w-full object-cover" />
              )}

              {/* Idle state */}
              {phase === 'idle' && (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-ink-400">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                    <Camera className="h-8 w-8" />
                  </div>
                  <p className="text-sm">Camera is off. Open the camera or upload an image.</p>
                </div>
              )}

              {/* Scanning overlay */}
              {phase === 'scanning' && (
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-primary-900/30" />
                  {/* Corner brackets */}
                  <div className="absolute left-6 top-6 h-10 w-10 border-l-4 border-t-4 border-primary-400 rounded-tl-xl" />
                  <div className="absolute right-6 top-6 h-10 w-10 border-r-4 border-t-4 border-primary-400 rounded-tr-xl" />
                  <div className="absolute bottom-6 left-6 h-10 w-10 border-b-4 border-l-4 border-primary-400 rounded-bl-xl" />
                  <div className="absolute bottom-6 right-6 h-10 w-10 border-b-4 border-r-4 border-primary-400 rounded-br-xl" />
                  {/* Scan line */}
                  <div className="absolute inset-x-6 h-1 bg-primary-400 shadow-glow animate-scan-line" style={{ top: '50%' }} />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <Badge tone="primary" className="bg-primary-500/90 text-white">
                      <span className="flex h-2 w-2 rounded-full bg-white animate-pulse" />
                      AI scanning…
                    </Badge>
                  </div>
                </div>
              )}

              {/* Captured retake hint */}
              {phase === 'captured' && (
                <button
                  onClick={reset}
                  className="absolute right-3 top-3 rounded-lg bg-ink-950/60 p-1.5 text-white hover:bg-ink-950/80"
                  aria-label="Discard"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {error && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-warning-200 bg-warning-50 p-3 text-sm text-warning-700 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              {phase === 'idle' && (
                <>
                  <Button onClick={startCamera} leftIcon={<Camera className="h-4 w-4" />}>
                    Open Camera
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    leftIcon={<Upload className="h-4 w-4" />}
                  >
                    Upload Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                  />
                </>
              )}
              {phase === 'camera' && (
                <>
                  <Button onClick={captureFrame} leftIcon={<ScanLine className="h-4 w-4" />}>
                    Capture Frame
                  </Button>
                  <Button variant="ghost" onClick={() => { stopCamera(); setPhase('idle'); }}>
                    Cancel
                  </Button>
                </>
              )}
              {phase === 'captured' && (
                <>
                  <Button onClick={runScan} leftIcon={<BrainCircuit className="h-4 w-4" />}>
                    Run AI Verification
                  </Button>
                  <Button variant="outline" onClick={reset} leftIcon={<RefreshCw className="h-4 w-4" />}>
                    Retake
                  </Button>
                </>
              )}
              {phase === 'scanning' && (
                <Button disabled leftIcon={<RefreshCw className="h-4 w-4 animate-spin" />}>
                  Processing…
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Pipeline panel */}
        <Card>
          <CardHeader
            title="AI Verification Pipeline"
            subtitle="Real-time scan progress"
            icon={<Cpu className="h-5 w-5" />}
          />
          <div className="p-5 pt-3">
            {/* Progress */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs font-semibold text-ink-500">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-700 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2">
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border p-3 transition-all',
                      s.status === 'done' && 'border-success-200 bg-success-50 dark:border-success-500/30 dark:bg-success-500/10',
                      s.status === 'active' && 'border-primary-300 bg-primary-50 dark:border-primary-500/40 dark:bg-primary-500/10',
                      s.status === 'pending' && 'border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-900',
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg',
                        s.status === 'done' && 'bg-success-600 text-white',
                        s.status === 'active' && 'bg-primary-600 text-white',
                        s.status === 'pending' && 'bg-ink-100 text-ink-400 dark:bg-ink-800',
                      )}
                    >
                      {s.status === 'done' ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : s.status === 'active' ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink-900 dark:text-white">
                        {s.label}
                      </p>
                      <p className="text-xs text-ink-500">
                        {s.status === 'done'
                          ? 'Complete'
                          : s.status === 'active'
                            ? 'Processing…'
                            : 'Waiting'}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-ink-400">#{i + 1}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-xl bg-ink-50 p-3 text-xs text-ink-500 dark:bg-ink-800/60 dark:text-ink-400">
              <p>
                <span className="font-semibold text-ink-700 dark:text-ink-200">Note:</span> The
                Afferens Vision API and OCR are simulated in this demo. Replace the placeholder
                functions in <code className="rounded bg-ink-100 px-1 py-0.5 dark:bg-ink-800">src/lib/api.ts</code> with live endpoints.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
