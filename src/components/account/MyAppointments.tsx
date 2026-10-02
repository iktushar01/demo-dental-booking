import React, { useState } from 'react';
import { useClinicStore } from '../../store/useClinicStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Appointment, Dentist, Service } from '../../types';
import { formatDateSafe, formatCurrency, getStatusDetails, getPaymentBadgeDetails } from '../../lib/utils';
import { generateIcsCalendar } from '../../lib/ics';
import { downloadTextFile } from '../../lib/utils';
import { generateAvailableSlots, GeneratedTimeSlot } from '../../lib/slots';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { EmptyState } from '../ui/EmptyState';
import {
  Calendar,
  Clock,
  User,
  ShieldAlert,
  Download,
  AlertCircle,
  RotateCcw,
  Ban,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

export const MyAppointments: React.FC = () => {
  const { currentUser } = useAuthStore();
  const {
    appointments,
    dentists,
    services,
    clinicConfig,
    cancelAppointment,
    rescheduleAppointment,
    blockedSlots,
    clinicHolidays,
  } = useClinicStore();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');

  // Modal states
  const [cancellingAppt, setCancellingAppt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const [reschedulingAppt, setReschedulingAppt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState<GeneratedTimeSlot | null>(null);

  // Filter patient's appointments
  const patientEmail = currentUser?.email?.toLowerCase() || '';
  const patientAppointments = appointments.filter(
    (a) => a.patientEmail.toLowerCase() === patientEmail || a.patientId === currentUser?.id
  );

  const todayStr = new Date().toISOString().split('T')[0];

  const upcomingList = patientAppointments.filter(
    (a) => a.date >= todayStr && (a.status === 'confirmed' || a.status === 'pending')
  );

  const pastList = patientAppointments.filter(
    (a) => a.date < todayStr || a.status === 'completed' || a.status === 'no_show'
  );

  const cancelledList = patientAppointments.filter((a) => a.status === 'cancelled');

  const displayedList =
    activeTab === 'upcoming'
      ? upcomingList
      : activeTab === 'past'
      ? pastList
      : cancelledList;

  const handleConfirmCancel = () => {
    if (!cancellingAppt) return;
    cancelAppointment(cancellingAppt.id, cancelReason || 'Cancelled by patient');
    toast.success('Appointment cancelled. Refund processed if eligible.');
    setCancellingAppt(null);
    setCancelReason('');
  };

  const handleConfirmReschedule = () => {
    if (!reschedulingAppt || !rescheduleDate || !rescheduleSlot) {
      toast.error('Please choose a new date and time');
      return;
    }
    rescheduleAppointment(
      reschedulingAppt.id,
      rescheduleDate,
      rescheduleSlot.startTime,
      rescheduleSlot.endTime,
      rescheduleSlot.dentistId || reschedulingAppt.dentistId
    );
    toast.success('Appointment rescheduled successfully!');
    setReschedulingAppt(null);
    setRescheduleDate('');
    setRescheduleSlot(null);
  };

  const handleDownloadIcs = (appt: Appointment) => {
    const dentist = dentists.find((d) => d.id === appt.dentistId);
    const service = services.find((s) => s.id === appt.serviceId);
    const ics = generateIcsCalendar({
      appointment: appt,
      dentist,
      service,
      clinic: clinicConfig,
    });
    downloadTextFile(ics, `dental-${appt.bookingCode}.ics`, 'text/calendar');
    toast.success('Calendar file downloaded');
  };

  // Slots calculation for reschedule modal
  const rescheduleService = services.find((s) => s.id === reschedulingAppt?.serviceId) || services[0];
  const rescheduleDentist = dentists.find((d) => d.id === reschedulingAppt?.dentistId);

  const rescheduleSlotData = rescheduleDate && rescheduleService
    ? generateAvailableSlots({
        dateStr: rescheduleDate,
        service: rescheduleService,
        dentist: rescheduleDentist,
        allDentists: dentists,
        existingAppointments: appointments.filter((a) => a.id !== reschedulingAppt?.id),
        blockedSlots,
        clinicHolidays,
      })
    : { isHoliday: false, isDayOff: false, slots: [] };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
            My Appointments
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Manage your scheduled checkups, reschedule, or export to your calendar.
          </p>
        </div>

        <Tabs
          tabs={[
            { id: 'upcoming', label: 'Upcoming', count: upcomingList.length },
            { id: 'past', label: 'Past Visits', count: pastList.length },
            { id: 'cancelled', label: 'Cancelled', count: cancelledList.length },
          ]}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as any)}
        />
      </div>

      {/* Cancellation policy banner */}
      <div className="p-3.5 rounded-xl bg-neutral-100/80 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 text-xs text-neutral-600 dark:text-neutral-300 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
        <div>
          <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
            Cancellation & Rescheduling Policy:
          </strong>{' '}
          Appointments can be modified online up to {clinicConfig.cancellationNoticeHours} hours before scheduled time with no cancellation penalty.
        </div>
      </div>

      {/* Appointment Cards */}
      {displayedList.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {displayedList.map((appt) => {
            const dentist = dentists.find((d) => d.id === appt.dentistId);
            const service = services.find((s) => s.id === appt.serviceId);
            const status = getStatusDetails(appt.status);
            const payment = getPaymentBadgeDetails(appt.paymentStatus);

            return (
              <div
                key={appt.id}
                className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 text-left"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                      {appt.bookingCode}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-semibold ${status.bg} ${status.text} border ${status.border}`}
                    >
                      {status.label}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md ${payment.bg} ${payment.text} border ${payment.border}`}
                    >
                      {payment.label}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                      {service?.name || 'Dental Appointment'}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      With{' '}
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                        {dentist ? `Dr. ${dentist.name}` : 'Doctor'}
                      </span>{' '}
                      ({dentist?.specialty || 'General Dentist'})
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      <span>{formatDateSafe(appt.date, 'EEEE, MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span className="font-mono">{appt.startTime} – {appt.endTime}</span>
                    </div>
                    <div className="font-mono font-medium text-neutral-700 dark:text-neutral-300">
                      {formatCurrency(appt.totalAmount, clinicConfig.currencySymbol)}
                    </div>
                  </div>

                  {appt.notes && (
                    <p className="text-xs text-neutral-500 italic bg-neutral-50 dark:bg-neutral-800/40 p-2 rounded-lg">
                      Notes: "{appt.notes}"
                    </p>
                  )}

                  {appt.cancellationReason && (
                    <p className="text-xs text-rose-600 dark:text-rose-400">
                      Cancelled Reason: {appt.cancellationReason}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-neutral-100 dark:border-neutral-800">
                  {appt.status !== 'cancelled' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadIcs(appt)}
                      leftIcon={<Download className="w-3 h-3" />}
                    >
                      Calendar .ics
                    </Button>
                  )}

                  {activeTab === 'upcoming' && (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setReschedulingAppt(appt);
                          setRescheduleDate(appt.date);
                          setRescheduleSlot(null);
                        }}
                        leftIcon={<RotateCcw className="w-3 h-3" />}
                      >
                        Reschedule
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        onClick={() => {
                          setCancellingAppt(appt);
                          setCancelReason('');
                        }}
                        leftIcon={<Ban className="w-3 h-3" />}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Calendar className="w-6 h-6" />}
          title={`No ${activeTab} appointments`}
          description={
            activeTab === 'upcoming'
              ? 'You have no upcoming dental visits. Keep your smile bright and book a cleaning today!'
              : `No appointments found under ${activeTab}.`
          }
          actionLabel={activeTab === 'upcoming' ? 'Book Appointment' : undefined}
          onAction={activeTab === 'upcoming' ? () => (window.location.href = '/book') : undefined}
        />
      )}

      {/* Cancel Modal */}
      <Modal
        isOpen={!!cancellingAppt}
        onClose={() => setCancellingAppt(null)}
        title="Cancel Appointment"
        description={`Booking Reference: ${cancellingAppt?.bookingCode}`}
      >
        <div className="space-y-4 text-left">
          <p className="text-xs text-neutral-600 dark:text-neutral-300">
            Are you sure you want to cancel your appointment on{' '}
            <strong>{cancellingAppt && formatDateSafe(cancellingAppt.date)}</strong> at{' '}
            <strong>{cancellingAppt?.startTime}</strong>?
          </p>

          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
              Reason for Cancellation (Optional)
            </label>
            <textarea
              rows={2}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Schedule conflict, feeling unwell..."
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setCancellingAppt(null)}>
              Keep Appointment
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmCancel}>
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        isOpen={!!reschedulingAppt}
        onClose={() => setReschedulingAppt(null)}
        title="Reschedule Appointment"
        description={`Procedure: ${rescheduleService?.name} (${rescheduleService?.durationMinutes} min)`}
        maxWidth="lg"
      >
        <div className="space-y-4 text-left">
          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
              Select New Date
            </label>
            <input
              type="date"
              min={todayStr}
              value={rescheduleDate}
              onChange={(e) => {
                setRescheduleDate(e.target.value);
                setRescheduleSlot(null);
              }}
              className="w-full text-xs sm:text-sm p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-2">
              Available Time Slots
            </label>

            {rescheduleSlotData.isHoliday ? (
              <p className="text-xs text-rose-500">Selected date is a clinic holiday.</p>
            ) : rescheduleSlotData.isDayOff ? (
              <p className="text-xs text-neutral-500">Dentist does not work on this weekday.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                {rescheduleSlotData.slots
                  .filter((s) => s.available)
                  .map((slot, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRescheduleSlot(slot)}
                      className={`p-2 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                        rescheduleSlot?.startTime === slot.startTime
                          ? 'bg-teal-600 text-white font-bold border-teal-600'
                          : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-teal-500'
                      }`}
                    >
                      {slot.startTime}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <Button variant="outline" size="sm" onClick={() => setReschedulingAppt(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!rescheduleDate || !rescheduleSlot}
              onClick={handleConfirmReschedule}
            >
              Confirm Reschedule
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
