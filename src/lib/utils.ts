import { type ClassValue, clsx } from 'clsx';
import { format, parse, isValid } from 'date-fns';
import { AppointmentStatus, PaymentStatus } from '../types';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number, symbol: string = '$'): string {
  return `${symbol}${amount.toFixed(0)}`;
}

export function formatDateSafe(dateStr: string, formatStr: string = 'MMMM d, yyyy'): string {
  try {
    if (!dateStr) return '';
    const parsed = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`);
    if (!isValid(parsed)) return dateStr;
    return format(parsed, formatStr);
  } catch {
    return dateStr;
  }
}

export function formatTimeSlot(timeStr: string): string {
  if (!timeStr) return '';
  try {
    const parsed = parse(timeStr, 'HH:mm', new Date());
    if (!isValid(parsed)) return timeStr;
    return format(parsed, 'h:mm a');
  } catch {
    return timeStr;
  }
}

export function generateBookingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'BS-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getStatusDetails(status: AppointmentStatus) {
  switch (status) {
    case 'confirmed':
      return {
        label: 'Confirmed',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800/60',
        dot: 'bg-emerald-500',
      };
    case 'pending':
      return {
        label: 'Pending',
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800/60',
        dot: 'bg-amber-500',
      };
    case 'completed':
      return {
        label: 'Completed',
        bg: 'bg-blue-50 dark:bg-blue-950/40',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800/60',
        dot: 'bg-blue-500',
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        bg: 'bg-neutral-100 dark:bg-neutral-800',
        text: 'text-neutral-600 dark:text-neutral-400',
        border: 'border-neutral-200 dark:border-neutral-700',
        dot: 'bg-neutral-400',
      };
    case 'no_show':
      return {
        label: 'No-Show',
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-200 dark:border-rose-800/60',
        dot: 'bg-rose-500',
      };
    default:
      return {
        label: status,
        bg: 'bg-neutral-100',
        text: 'text-neutral-700',
        border: 'border-neutral-200',
        dot: 'bg-neutral-400',
      };
  }
}

export function getPaymentBadgeDetails(paymentStatus: PaymentStatus) {
  switch (paymentStatus) {
    case 'paid_deposit':
      return {
        label: 'Deposit Paid',
        bg: 'bg-teal-50 dark:bg-teal-950/40',
        text: 'text-teal-700 dark:text-teal-300',
        border: 'border-teal-200 dark:border-teal-800',
      };
    case 'paid_in_clinic':
      return {
        label: 'Paid In Clinic',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800',
      };
    case 'refunded':
      return {
        label: 'Refunded',
        bg: 'bg-neutral-100 dark:bg-neutral-800',
        text: 'text-neutral-600 dark:text-neutral-400',
        border: 'border-neutral-200 dark:border-neutral-700',
      };
    case 'pending':
    default:
      return {
        label: 'Pay at Visit',
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800',
      };
  }
}

export function downloadTextFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
