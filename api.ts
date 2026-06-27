import type { Medicine, ScanResult, VerificationOutcome } from './types';

/**
 * Placeholder API layer for the MediSense AI verification pipeline.
 * These functions simulate the Afferens Vision API + OCR + AI decision engine.
 * Replace the simulated bodies with real network calls during backend integration.
 */

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface VisionDetection {
  detectedName: string;
  confidence: number;
  form: string;
  manufacturer?: string;
}

export interface OcrResult {
  expiryDate: string;
  rawText: string;
  confidence: number;
}

/**
 * Step 1 — Afferens Vision API: identify the medicine from the captured frame.
 * TODO: replace with real POST to the Afferens Vision endpoint.
 */
export async function detectMedicineWithVisionApi(
  _imageData: string | Blob,
): Promise<VisionDetection> {
  await wait(1400);
  // Simulated detection — in production this returns the API's top match.
  return {
    detectedName: 'Paracetamol',
    confidence: 98.6,
    form: 'Tablet',
    manufacturer: 'Cipla Ltd.',
  };
}

/**
 * Step 2 — OCR: extract the expiry date printed on the medicine strip.
 * TODO: replace with the OCR provider call (Tesseract / cloud OCR).
 */
export async function extractExpiryWithOcr(
  _imageData: string | Blob,
): Promise<OcrResult> {
  await wait(900);
  return {
    expiryDate: '2027-04-30',
    rawText: 'MFG: 04-2025  EXP: 04-2027  BATCH: PC2204',
    confidence: 96.1,
  };
}

function isExpired(isoDate: string): boolean {
  const expiry = new Date(isoDate);
  return expiry.getTime() < Date.now();
}

/**
 * Step 3 — AI Decision Engine: compare detected medicine against the expected
 * schedule entry and validate the expiry date.
 */
export async function runVerificationEngine(
  expected: Medicine,
  detection: VisionDetection,
  ocr: OcrResult,
): Promise<ScanResult> {
  await wait(700);

  const nameMatches =
    detection.detectedName.toLowerCase() === expected.name.toLowerCase();
  const expired = isExpired(ocr.expiryDate);

  let outcome: VerificationOutcome;
  if (!nameMatches) outcome = 'wrong';
  else if (expired) outcome = 'expired';
  else outcome = 'verified';

  return {
    detectedName: detection.detectedName,
    expectedName: expected.name,
    expiryDate: ocr.expiryDate,
    confidence: Math.min(detection.confidence, ocr.confidence),
    outcome,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Orchestrates the full scan → detect → OCR → verify pipeline.
 * UI calls this single function; swap internals when the backend is ready.
 */
export async function verifyMedicine(
  expected: Medicine,
  imageData: string | Blob,
): Promise<ScanResult> {
  const [detection, ocr] = await Promise.all([
    detectMedicineWithVisionApi(imageData),
    extractExpiryWithOcr(imageData),
  ]);
  return runVerificationEngine(expected, detection, ocr);
}

/**
 * Text-to-speech helper for voice confirmation of the verification result.
 * Uses the browser SpeechSynthesis API when available.
 */
export function speakVerification(message: string, volume = 0.7): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = Math.max(0, Math.min(1, volume));
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch {
    // no-op: speech unavailable in this environment
  }
}
