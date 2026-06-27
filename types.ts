export type MedicineStatus = 'pending' | 'taken' | 'missed' | 'overdue';
export type VerificationStatus = 'verified' | 'wrong' | 'expired' | 'pending' | 'skipped';
export type VerificationOutcome = 'verified' | 'wrong' | 'expired';

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Inhaler';
  scheduledTime: string; // HH:mm
  status: MedicineStatus;
  verification: VerificationStatus;
  notes?: string;
  color?: string;
}

export interface HistoryEntry {
  id: string;
  date: string; // ISO date
  medicine: string;
  dosage: string;
  scheduledTime: string;
  verificationTime: string;
  status: VerificationStatus;
  remarks: string;
  confidence?: number;
  detectedName?: string;
  expiryDate?: string;
}

export interface ScanResult {
  detectedName: string;
  expectedName: string;
  expiryDate: string;
  confidence: number;
  outcome: VerificationOutcome;
  timestamp: string;
}

export interface PatientProfile {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  weight: string;
  height: string;
  medicalConditions: string[];
  allergies: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  doctor: {
    name: string;
    specialty: string;
    phone: string;
    hospital: string;
  };
  currentMedicines: string[];
}

export interface AppSettings {
  reminderInterval: number; // minutes
  voiceLanguage: 'en-US' | 'en-GB' | 'es-ES' | 'fr-FR' | 'hi-IN' | 'ta-IN';
  alarmVolume: number; // 0-100
  darkMode: boolean;
  emergencyContact: string;
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    voice: boolean;
  };
}

export type PageKey =
  | 'landing'
  | 'dashboard'
  | 'schedule'
  | 'scan'
  | 'result'
  | 'history'
  | 'settings'
  | 'profile';
