import React, { useState } from 'react';
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  eachDayOfInterval,
  isSameDay,
} from 'date-fns';
import { useClinicStore } from '../../store/useClinicStore';
import { Appointment, Dentist, Service } from '../../types';
import { formatDateSafe, formatCurrency, getStatusDetails } from '../../lib/utils';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminCalendar: React.FC = () => {
  const { appointments, dentists, services, addAppointment, updateAppointment } = useClinicStore();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [colorMode, setColorMode] = useState<'status' | 'dentist'>('dentist');

  // Modals
  const [clickedSlotInfo, setClickedSlotInfo] = useState<{ date: string; time: string } | null>(null);
  const [viewingAppt, setViewingAppt] = useState<Appointment | null>(null);

  // New appointment in slot
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [dentistId, setDentistId] = useState(dentists[0]?.id || '');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');

  // Calculate week days
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 5), // Mon - Sat (6 days)
  });

  const displayedDays = viewMode === 'week' ? weekDays : [currentDate];

  // Hours intervals 08:00 to 18:00
  const hours = Array.from({ length: 10 }).map((_, i) => `${String(8 + i).padStart(2, '0')}:00`);

  const prev = () => setCurrentDate((d) => (viewMode === 'week' ? subDays(d, 7) : subDays(d, 1)));
  const next = () => setCurrentDate((d) => (viewMode === 'week' ? addDays(d, 7) : addDays(d, 1)));
  const today = () => setCurrentDate(new Date());

  const handleCreateSlotAppt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clickedSlotInfo || !patientName.trim()) return;

    const serv = services.find((s) => s.id === serviceId) || services[0];
    const duration = serv.durationMinutes || 45;

    const [h, m] = clickedSlotInfo.time.split(':').map(Number);
    const endMin = h * 60 + m + duration;
    const endH = String(Math.floor(endMin / 60)).padStart(2, '0');
    const endM = String(endMin % 60).padStart(2, '0');

    addAppointment({
      bookingCode: `BS-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: `manual-${Date.now()}`,
      patientName: patientName.trim(),
      patientEmail: patientEmail.trim() || 'walkin@brightsmile.com',
      patientPhone: '(555) 000-0000',
      dentistId,
      serviceId,
      date: clickedSlotInfo.date,
      startTime: clickedSlotInfo.time,
      endTime: `${endH}:${endM}`,
      status: 'confirmed',
      paymentStatus: 'pending',
      paymentMethod: 'pay_at_clinic',
      depositAmount: 0,
      totalAmount: serv.price,
    });

    toast.success('Appointment created for ' + patientName);
    setClickedSlotInfo(null);
    setPatientName('');
    setPatientEmail('');
  };

  const getDentistColor = (dId: string) => {
    if (dId === 'dentist-1') return 'bg-teal-500 text-white';
    if (dId === 'dentist-2') return 'bg-sky-500 text-white';
    return 'bg-purple-500 text-white';
  };

  return (
    <div className="space-y-6 text-left">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Clinic Master Calendar
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Click any open slot to schedule or click existing appointments to inspect details.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View toggle */}
          <div className="p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center text-xs">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                viewMode === 'week' ? 'bg-white dark:bg-neutral-900 shadow-xs text-neutral-900 dark:text-neutral-100' : 'text-neutral-500'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                viewMode === 'day' ? 'bg-white dark:bg-neutral-900 shadow-xs text-neutral-900 dark:text-neutral-100' : 'text-neutral-500'
              }`}
            >
              Day
            </button>
          </div>

          {/* Color by toggle */}
          <select
            value={colorMode}
            onChange={(e) => setColorMode(e.target.value as any)}
            className="text-xs p-1.5 px-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
          >
            <option value="dentist">Color by Dentist</option>
            <option value="status">Color by Status</option>
          </select>

          {/* Date arrows */}
          <div className="flex items-center gap-1 border border-neutral-300 dark:border-neutral-700 rounded-xl p-0.5 bg-white dark:bg-neutral-900">
            <button
              onClick={prev}
              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={today}
              className="px-2 py-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-teal-600 cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={next}
              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Week / Day Grid View */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs overflow-hidden">
        {/* Days Header */}
        <div className={`grid border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850`}
             style={{ gridTemplateColumns: `60px repeat(${displayedDays.length}, minmax(0, 1fr))` }}>
          <div className="p-3 text-[11px] font-semibold text-neutral-400 text-center border-r border-neutral-200 dark:border-neutral-800">
            Time
          </div>
          {displayedDays.map((d, i) => {
            const isToday = isSameDay(d, new Date());
            return (
              <div
                key={i}
                className={`p-3 text-center border-r last:border-r-0 border-neutral-200 dark:border-neutral-800 ${
                  isToday ? 'bg-teal-50/60 dark:bg-teal-950/30' : ''
                }`}
              >
                <span className="text-[11px] font-medium text-neutral-400 block uppercase">
                  {format(d, 'EEE')}
                </span>
                <span
                  className={`text-sm font-bold font-mono mt-0.5 inline-block ${
                    isToday ? 'text-teal-600 dark:text-teal-400' : 'text-neutral-900 dark:text-neutral-100'
                  }`}
                >
                  {format(d, 'MMM d')}
                </span>
              </div>
            );
          })}
        </div>

        {/* Time Rows */}
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {hours.map((hour) => (
            <div
              key={hour}
              className="grid min-h-[72px]"
              style={{ gridTemplateColumns: `60px repeat(${displayedDays.length}, minmax(0, 1fr))` }}
            >
              {/* Hour Label */}
              <div className="p-2 text-[10px] font-mono text-neutral-400 text-center border-r border-neutral-200 dark:border-neutral-800 select-none">
                {hour}
              </div>

              {/* Day cells for this hour */}
              {displayedDays.map((day, dIdx) => {
                const dayStr = format(day, 'yyyy-MM-dd');
                const hourPrefix = hour.split(':')[0];

                // Find appointments starting in this hour on this day
                const cellAppts = appointments.filter(
                  (a) => a.date === dayStr && a.startTime.startsWith(hourPrefix) && a.status !== 'cancelled'
                );

                return (
                  <div
                    key={dIdx}
                    onClick={() => {
                      setClickedSlotInfo({ date: dayStr, time: hour });
                      setPatientName('');
                      setPatientEmail('');
                    }}
                    className="p-1 border-r last:border-r-0 border-neutral-100 dark:border-neutral-800/80 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors relative cursor-pointer group"
                  >
                    <div className="space-y-1">
                      {cellAppts.map((appt) => {
                        const dentist = dentists.find((d) => d.id === appt.dentistId);
                        const service = services.find((s) => s.id === appt.serviceId);
                        const status = getStatusDetails(appt.status);

                        const colorClass =
                          colorMode === 'dentist'
                            ? getDentistColor(appt.dentistId)
                            : `${status.bg} ${status.text} border ${status.border}`;

                        return (
                          <div
                            key={appt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingAppt(appt);
                            }}
                            className={`p-1.5 rounded-lg text-[10px] font-medium transition-transform hover:scale-[1.02] shadow-xs cursor-pointer ${colorClass}`}
                          >
                            <div className="flex items-center justify-between font-mono font-bold truncate">
                              <span>{appt.startTime}</span>
                              <span>Dr. {dentist?.name.split(' ')[0]}</span>
                            </div>
                            <p className="font-semibold truncate">{appt.patientName}</p>
                            <p className="truncate opacity-90">{service?.name}</p>
                          </div>
                        );
                      })}
                    </div>

                    {cellAppts.length === 0 && (
                      <span className="hidden group-hover:inline-block absolute top-1 right-1 text-[10px] text-teal-600 bg-teal-50 dark:bg-teal-950 px-1 rounded">
                        + Add
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Click Slot to Create Appointment Modal */}
      <Modal
        isOpen={!!clickedSlotInfo}
        onClose={() => setClickedSlotInfo(null)}
        title="Schedule In Selected Slot"
        description={clickedSlotInfo ? `${formatDateSafe(clickedSlotInfo.date)} at ${clickedSlotInfo.time}` : ''}
      >
        <form onSubmit={handleCreateSlotAppt} className="space-y-4 text-left">
          <Input
            label="Patient Name"
            required
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="e.g. Jessica Taylor"
          />

          <Input
            label="Patient Email"
            type="email"
            value={patientEmail}
            onChange={(e) => setPatientEmail(e.target.value)}
            placeholder="e.g. jessica@example.com"
          />

          <Select
            label="Assigned Dentist"
            value={dentistId}
            onChange={(e) => setDentistId(e.target.value)}
          >
            {dentists.map((d) => (
              <option key={d.id} value={d.id}>
                Dr. {d.name} ({d.specialty})
              </option>
            ))}
          </Select>

          <Select
            label="Procedure"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (${s.price} · {s.durationMinutes}m)
              </option>
            ))}
          </Select>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setClickedSlotInfo(null)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Schedule Appointment
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Appointment Details Modal */}
      <Modal
        isOpen={!!viewingAppt}
        onClose={() => setViewingAppt(null)}
        title="Appointment Summary"
        description={`Code: ${viewingAppt?.bookingCode}`}
      >
        {viewingAppt && (
          <div className="space-y-4 text-xs text-left">
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 space-y-1.5">
              <p>
                <strong>Patient:</strong> {viewingAppt.patientName} ({viewingAppt.patientPhone})
              </p>
              <p>
                <strong>Procedure:</strong>{' '}
                {services.find((s) => s.id === viewingAppt.serviceId)?.name}
              </p>
              <p>
                <strong>Dentist:</strong>{' '}
                Dr. {dentists.find((d) => d.id === viewingAppt.dentistId)?.name}
              </p>
              <p>
                <strong>Time:</strong> {viewingAppt.startTime} – {viewingAppt.endTime} on{' '}
                {formatDateSafe(viewingAppt.date)}
              </p>
              <p>
                <strong>Status:</strong> {viewingAppt.status}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  updateAppointment(viewingAppt.id, { status: 'completed' });
                  toast.success('Marked as completed');
                  setViewingAppt(null);
                }}
              >
                Mark Completed
              </Button>
              <Button size="sm" onClick={() => setViewingAppt(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
