import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useClinicStore } from '../../store/useClinicStore';
import { formatDateSafe } from '../../lib/utils';
import { Mail, MessageSquare, Bell, Clock, CheckCheck } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';

export const PatientNotifications: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { appointments, dentists, services, clinicConfig } = useClinicStore();

  const patientEmail = currentUser?.email?.toLowerCase() || '';
  const todayStr = new Date().toISOString().split('T')[0];

  const upcomingAppts = appointments.filter(
    (a) =>
      (a.patientEmail.toLowerCase() === patientEmail || a.patientId === currentUser?.id) &&
      a.date >= todayStr &&
      a.status !== 'cancelled'
  );

  return (
    <div className="space-y-6 text-left max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Appointment Reminder Feeds
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Automated SMS and email reminders generated for your upcoming visits.
        </p>
      </div>

      {upcomingAppts.length > 0 ? (
        <div className="space-y-4">
          {upcomingAppts.map((appt) => {
            const dentist = dentists.find((d) => d.id === appt.dentistId);
            const service = services.find((s) => s.id === appt.serviceId);

            return (
              <div
                key={appt.id}
                className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                      {appt.bookingCode}
                    </span>
                    <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      {service?.name} on {formatDateSafe(appt.date)}
                    </span>
                  </div>
                  <span className="text-[11px] text-teal-700 dark:text-teal-400 font-medium flex items-center gap-1">
                    <CheckCheck className="w-3.5 h-3.5" /> Scheduled Alerts
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email Preview Card */}
                  <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/80 space-y-2">
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <div className="flex items-center gap-1.5 font-semibold text-neutral-700 dark:text-neutral-300">
                        <Mail className="w-3.5 h-3.5 text-teal-600" />
                        <span>Email Alert (24h Before)</span>
                      </div>
                      <span className="text-[10px] font-mono">Queued</span>
                    </div>

                    <div className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans bg-white dark:bg-neutral-900 p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800">
                      <p className="font-semibold text-neutral-800 dark:text-neutral-200 text-[11px] mb-1">
                        Upcoming Appointment Reminder
                      </p>
                      <p className="text-[11px]">
                        Hi {appt.patientName}, your visit with{' '}
                        {dentist ? `Dr. ${dentist.name}` : 'BrightSmile Dental'} is tomorrow at{' '}
                        <strong>{appt.startTime}</strong>. Free parking available on Plaza Level B.
                      </p>
                    </div>
                  </div>

                  {/* SMS Preview Card */}
                  <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/80 space-y-2">
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <div className="flex items-center gap-1.5 font-semibold text-neutral-700 dark:text-neutral-300">
                        <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                        <span>SMS Notification (2h Before)</span>
                      </div>
                      <span className="text-[10px] font-mono">Queued</span>
                    </div>

                    <div className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-mono bg-white dark:bg-neutral-900 p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800 text-[11px]">
                      BrightSmile Alert: See you in 2 hours at {appt.startTime}! Need directions or running late? Call {clinicConfig.phone}.
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Bell className="w-6 h-6" />}
          title="No active reminders"
          description="Reminders are triggered automatically when you have upcoming confirmed visits scheduled."
        />
      )}
    </div>
  );
};
