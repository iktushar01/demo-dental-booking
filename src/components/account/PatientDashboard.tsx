import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useClinicStore } from '../../store/useClinicStore';
import { useRouter } from '../../lib/router';
import { formatDateSafe, formatTimeSlot, getStatusDetails } from '../../lib/utils';
import { MyAppointments } from './MyAppointments';
import { PatientProfile } from './PatientProfile';
import { PatientNotifications } from './PatientNotifications';
import { Button } from '../ui/Button';
import {
  Calendar,
  Clock,
  User,
  Bell,
  LogOut,
  CalendarPlus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const { currentUser, logout } = useAuthStore();
  const { appointments, dentists, services } = useClinicStore();
  const { navigate } = useRouter();

  const [activeView, setActiveView] = useState<'overview' | 'appointments' | 'profile' | 'notifications'>('overview');

  const patientEmail = currentUser?.email?.toLowerCase() || '';
  const todayStr = new Date().toISOString().split('T')[0];

  const patientAppts = appointments.filter(
    (a) => a.patientEmail.toLowerCase() === patientEmail || a.patientId === currentUser?.id
  );

  // Next upcoming appointment
  const nextAppointment = patientAppts
    .filter((a) => a.date >= todayStr && (a.status === 'confirmed' || a.status === 'pending'))
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))[0];

  const nextDentist = dentists.find((d) => d.id === nextAppointment?.dentistId);
  const nextService = services.find((s) => s.id === nextAppointment?.serviceId);

  const pastCount = patientAppts.filter((a) => a.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-neutral-200 dark:border-neutral-800 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-xl font-bold font-mono shadow-sm">
            {currentUser?.avatarInitials || 'P'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
                Welcome back, {currentUser?.name}
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-medium">
                Verified Patient
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {currentUser?.email} · Member since 2024
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={() => navigate('/book')}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold"
            leftIcon={<CalendarPlus className="w-4 h-4" />}
          >
            Book New Appointment
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="text-neutral-500 hover:text-rose-600"
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Log Out
          </Button>
        </div>
      </div>

      {/* Main Grid: Sidebar Tabs + View Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-1 bg-white dark:bg-neutral-900 p-2 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setActiveView('overview')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeView === 'overview'
                ? 'bg-teal-600 text-white shadow-xs dark:bg-teal-500 dark:text-teal-950'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveView('appointments')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeView === 'appointments'
                ? 'bg-teal-600 text-white shadow-xs dark:bg-teal-500 dark:text-teal-950'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4" />
              <span>My Appointments</span>
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                activeView === 'appointments'
                  ? 'bg-white/20 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
              }`}
            >
              {patientAppts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveView('notifications')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeView === 'notifications'
                ? 'bg-teal-600 text-white shadow-xs dark:bg-teal-500 dark:text-teal-950'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Reminder Feeds</span>
          </button>

          <button
            onClick={() => setActiveView('profile')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeView === 'profile'
                ? 'bg-teal-600 text-white shadow-xs dark:bg-teal-500 dark:text-teal-950'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Security</span>
          </button>
        </div>

        {/* Dynamic Center Stage */}
        <div className="lg:col-span-9">
          {activeView === 'overview' && (
            <div className="space-y-6">
              {/* Next Appointment Hero Card */}
              {nextAppointment ? (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-50/70 via-white to-white dark:from-teal-950/30 dark:via-neutral-900 dark:to-neutral-900 border border-teal-500/40 shadow-xs relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400">
                        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                        <span>Next Scheduled Appointment</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-1">
                        {nextService?.name || 'Dental Visit'}
                      </h3>
                    </div>

                    <span className="font-mono text-xs font-bold bg-white dark:bg-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700">
                      {nextAppointment.bookingCode}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
                    <div>
                      <span className="text-neutral-400 block">Date & Time</span>
                      <p className="font-bold text-neutral-800 dark:text-neutral-200 mt-0.5">
                        {formatDateSafe(nextAppointment.date, 'EEEE, MMM d')}
                      </p>
                      <p className="text-neutral-500 font-mono">
                        {nextAppointment.startTime} – {nextAppointment.endTime}
                      </p>
                    </div>

                    <div>
                      <span className="text-neutral-400 block">Provider</span>
                      <p className="font-bold text-neutral-800 dark:text-neutral-200 mt-0.5">
                        Dr. {nextDentist?.name || 'Staff Dentist'}
                      </p>
                      <p className="text-neutral-500">{nextDentist?.specialty}</p>
                    </div>

                    <div className="flex items-end justify-start sm:justify-end">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setActiveView('appointments')}
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Manage Booking
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        No upcoming visits scheduled
                      </h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Routine checkups are recommended every 6 months to maintain optimal oral health.
                      </p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => navigate('/book')}>
                    Book An Appointment
                  </Button>
                </div>
              )}

              {/* Stats & Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-xs text-neutral-400 font-medium">Completed Visits</span>
                  <p className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1">
                    {pastCount}
                  </p>
                  <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-0.5">
                    Records up to date
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-xs text-neutral-400 font-medium">Dental Hygiene Status</span>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                    In Good Standing
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    X-rays valid through 2027
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-xs text-neutral-400 font-medium">Primary Doctor</span>
                  <p className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-1 truncate">
                    Dr. {dentists[0]?.name}
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Lead Restorative Care
                  </p>
                </div>
              </div>

              {/* Quick Book Again Section */}
              <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    Quick Book Favorite Procedures
                  </h3>
                  <span className="text-xs text-neutral-400">1-click schedule</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {services.slice(0, 3).map((serv) => (
                    <div
                      key={serv.id}
                      onClick={() => navigate('/book', { service: serv.id })}
                      className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700/80 hover:border-teal-500 transition-colors cursor-pointer text-left group"
                    >
                      <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-teal-600 transition-colors truncate">
                        {serv.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5 font-mono">
                        ${serv.price} · {serv.durationMinutes} min
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeView === 'appointments' && <MyAppointments />}
          {activeView === 'notifications' && <PatientNotifications />}
          {activeView === 'profile' && <PatientProfile />}
        </div>
      </div>
    </div>
  );
};
