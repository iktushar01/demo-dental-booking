export type UserRole = 'admin' | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  dateOfBirth?: string;
  avatarInitials?: string;
}

export interface Dentist {
  id: string;
  name: string;
  title: string;
  specialty: string;
  avatarUrl?: string;
  avatarInitials: string;
  workingDays: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  workingHours: {
    start: string; // e.g. "09:00"
    end: string;   // e.g. "17:00"
    lunchBreak?: {
      start: string; // e.g. "13:00"
      end: string;   // e.g. "14:00"
    };
  };
  bio: string;
  education: string;
  experienceYears: number;
  email: string;
  phone: string;
  active: boolean;
}

export interface Service {
  id: string;
  name: string;
  category: 'General' | 'Cosmetic' | 'Restorative' | 'Orthodontics' | 'Surgical';
  durationMinutes: number;
  price: number;
  description: string;
  active: boolean;
  popular?: boolean;
  imageUrl?: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
export type PaymentStatus = 'pending' | 'paid_deposit' | 'paid_in_clinic' | 'refunded';
export type PaymentMethod = 'deposit_online' | 'pay_at_clinic';

export interface Appointment {
  id: string;
  bookingCode: string; // e.g. "BS-8942"
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  dentistId: string;
  serviceId: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  depositAmount: number;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  cancellationReason?: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  notes?: string;
  createdAt: string;
  pastVisitCount: number;
}

export interface BlockedSlot {
  id: string;
  dentistId?: string; // If undefined or "all", blocks all dentists
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  reason: string;
}

export interface ClinicHoliday {
  id: string;
  date: string; // "YYYY-MM-DD"
  name: string;
}

export interface ReminderRule {
  id: string;
  name: string;
  timing: '24h_before' | '2h_before' | 'post_visit';
  channel: 'email' | 'sms';
  enabled: boolean;
  template: string;
}

export interface SentReminderLog {
  id: string;
  appointmentId: string;
  bookingCode: string;
  patientName: string;
  recipient: string;
  channel: 'email' | 'sms';
  sentAt: string;
  status: 'sent' | 'delivered';
}

export interface Testimonial {
  id: string;
  patientName: string;
  treatment: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'Booking' | 'Treatments' | 'Insurance & Pricing' | 'Clinic Policies';
}

export interface ClinicConfig {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  emergencyPhone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  openHoursText: string;
  currencySymbol: string;
  depositPercentage: number; // e.g. 20 (percent)
  cancellationNoticeHours: number; // e.g. 24
}
