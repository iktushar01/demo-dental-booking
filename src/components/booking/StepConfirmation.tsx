import React, { useState } from 'react';
import { Appointment, Dentist, Service } from '../../types';
import { useClinicStore } from '../../store/useClinicStore';
import { useRouter } from '../../lib/router';
import { generateIcsCalendar } from '../../lib/ics';
import { downloadTextFile, formatDateSafe, formatCurrency } from '../../lib/utils';
import { Button } from '../ui/Button';
import {
  CheckCircle,
  Calendar,
  Download,
  Mail,
  User,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface StepConfirmationProps {
  appointment: Appointment;
  dentist?: Dentist;
  service: Service;
}

export const StepConfirmation: React.FC<StepConfirmationProps> = ({
  appointment,
  dentist,
  service,
}) => {
  const { clinicConfig } = useClinicStore();
  const { navigate } = useRouter();
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  const handleDownloadCalendar = () => {
    const icsContent = generateIcsCalendar({
      appointment,
      dentist,
      service,
      clinic: clinicConfig,
    });
    downloadTextFile(icsContent, `dental-appointment-${appointment.bookingCode}.ics`, 'text/calendar');
  };

  return (
    <div className="space-y-8 text-left max-w-2xl mx-auto py-2">
      {/* Success Hero */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto border border-teal-200 dark:border-teal-800 shadow-sm animate-in zoom-in-75">
          <CheckCircle className="w-9 h-9 stroke-[2.5]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/70 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Appointment Reserved & Confirmed</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
          We look forward to seeing you, {appointment.patientName}!
        </h2>

        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
          A confirmation with pre-visit instructions has been simulated and recorded in your portal.
        </p>

        <div className="inline-block mt-2 p-2 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
          <span className="text-xs text-neutral-400 mr-2">Booking Reference:</span>
          <span className="font-mono font-bold text-sm text-teal-700 dark:text-teal-400">
            {appointment.bookingCode}
          </span>
        </div>
      </div>

      {/* Appointment Summary Card */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          Reservation Summary
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-neutral-400 block font-medium">Date & Time</span>
              <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
                {formatDateSafe(appointment.date, 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-neutral-500 font-mono">
                {appointment.startTime} – {appointment.endTime} ({service.durationMinutes} min)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <User className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-neutral-400 block font-medium">Dentist</span>
              <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
                {dentist ? `Dr. ${dentist.name}` : 'BrightSmile Staff Doctor'}
              </p>
              <p className="text-neutral-500">
                {dentist?.specialty || 'General Dentistry'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-neutral-400 block font-medium">Procedure & Payment</span>
              <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
                {service.name}
              </p>
              <p className="text-neutral-500 font-mono">
                Total: {formatCurrency(appointment.totalAmount, clinicConfig.currencySymbol)} ·{' '}
                {appointment.paymentMethod === 'deposit_online' ? 'Deposit Paid' : 'Pay at Reception'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-neutral-400 block font-medium">Location</span>
              <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
                {clinicConfig.name}
              </p>
              <p className="text-neutral-500">
                {clinicConfig.address}, {clinicConfig.city}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
        <Button
          size="md"
          onClick={handleDownloadCalendar}
          variant="outline"
          className="w-full sm:w-auto"
          leftIcon={<Download className="w-4 h-4 text-teal-600" />}
        >
          Add to Calendar (.ics)
        </Button>

        <Button
          size="md"
          onClick={() => navigate('/account')}
          className="w-full sm:w-auto"
        >
          View in Patient Portal
        </Button>

        <Button
          size="md"
          variant="ghost"
          onClick={() => navigate('/')}
          className="w-full sm:w-auto"
        >
          Return Home
        </Button>
      </div>

      {/* Confirmation Email Simulator Dropdown */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-4">
        <button
          type="button"
          onClick={() => setShowEmailPreview(!showEmailPreview)}
          className="w-full flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-teal-600 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-teal-600" />
            <span>Simulated Confirmation Email Preview</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${showEmailPreview ? 'rotate-180' : ''}`}
          />
        </button>

        {showEmailPreview && (
          <div className="mt-4 p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-3 font-sans">
            <div className="border-b border-neutral-100 dark:border-neutral-800 pb-2">
              <p className="text-neutral-400">From: care@brightsmiledental.com</p>
              <p className="text-neutral-400">To: {appointment.patientEmail}</p>
              <p className="font-bold text-neutral-800 dark:text-neutral-200 mt-1">
                Subject: Appointment Confirmed: {service.name} with {dentist ? `Dr. ${dentist.name}` : 'BrightSmile Dental'} [{appointment.bookingCode}]
              </p>
            </div>

            <div className="space-y-2 text-neutral-700 dark:text-neutral-300 leading-relaxed">
              <p>Dear {appointment.patientName},</p>
              <p>
                Your appointment at <strong>{clinicConfig.name}</strong> is confirmed for{' '}
                <strong>{formatDateSafe(appointment.date)}</strong> at{' '}
                <strong>{appointment.startTime}</strong>.
              </p>
              <p>
                <strong>Pre-Visit Checklist:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1 text-neutral-500">
                <li>Please arrive 10 minutes before your appointment time.</li>
                <li>Bring a valid photo ID and current dental insurance card (if applicable).</li>
                <li>Free parking is available in the plaza garage on Level B.</li>
              </ul>
              <p className="pt-2 text-neutral-400">
                Need to reschedule? You may adjust your slot through the patient portal up to 24 hours prior.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
