import React, { useState, useMemo } from 'react';
import {
  format,
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { useClinicStore } from '../../store/useClinicStore';
import { Dentist, Service } from '../../types';
import { generateAvailableSlots, GeneratedTimeSlot } from '../../lib/slots';
import { ChevronLeft, ChevronRight, Clock, Sun, Sunset, AlertCircle } from 'lucide-react';

interface StepDateTimeProps {
  service: Service;
  dentist: Dentist | null;
  isAnyDentist: boolean;
  selectedDate: string; // "YYYY-MM-DD"
  selectedSlot: GeneratedTimeSlot | null;
  onSelectDate: (dateStr: string) => void;
  onSelectSlot: (slot: GeneratedTimeSlot) => void;
}

export const StepDateTime: React.FC<StepDateTimeProps> = ({
  service,
  dentist,
  isAnyDentist,
  selectedDate,
  selectedSlot,
  onSelectDate,
  onSelectSlot,
}) => {
  const {
    dentists,
    appointments,
    blockedSlots,
    clinicHolidays,
  } = useClinicStore();

  const [currentMonth, setCurrentMonth] = useState<Date>(
    selectedDate ? new Date(`${selectedDate}T12:00:00`) : new Date()
  );

  const today = startOfDay(new Date());

  // Generate slots for currently selected date
  const slotData = useMemo(() => {
    if (!selectedDate) {
      return { isHoliday: false, isDayOff: false, slots: [] };
    }

    return generateAvailableSlots({
      dateStr: selectedDate,
      service,
      dentist: isAnyDentist ? null : dentist,
      allDentists: dentists,
      existingAppointments: appointments,
      blockedSlots,
      clinicHolidays,
    });
  }, [selectedDate, service, dentist, isAnyDentist, dentists, appointments, blockedSlots, clinicHolidays]);

  // Calendar matrix calculations
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Separate slots into morning (<12:00) and afternoon (>=12:00)
  const morningSlots = slotData.slots.filter((s) => {
    const hour = parseInt(s.startTime.split(':')[0], 10);
    return hour < 12;
  });

  const afternoonSlots = slotData.slots.filter((s) => {
    const hour = parseInt(s.startTime.split(':')[0], 10);
    return hour >= 12;
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => {
    if (!isBefore(startOfMonth(subMonths(currentMonth, 1)), startOfMonth(today))) {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Select Date & Appointment Time
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Pick a date on the calendar, then select an available start time.
          {dentist && !isAnyDentist && (
            <span className="text-teal-700 dark:text-teal-400 font-medium ml-1">
              (Viewing Dr. {dentist.name}'s schedule)
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Month Calendar */}
        <div className="lg:col-span-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                disabled={isBefore(startOfMonth(subMonths(currentMonth, 1)), startOfMonth(today))}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d} className="text-[11px] font-semibold text-neutral-400 py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarDays.map((day, idx) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const isPast = isBefore(day, today);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate === dateStr;
              const isClinicHoliday = clinicHolidays.some((h) => h.date === dateStr);
              const dayOfWeek = day.getDay();

              // Check if dentist works on this day
              let isDayOff = false;
              if (dentist && !isAnyDentist) {
                isDayOff = !dentist.workingDays.includes(dayOfWeek);
              } else {
                // Sunday clinic is closed
                isDayOff = dayOfWeek === 0;
              }

              const isDisabled = isPast || isClinicHoliday || isDayOff;

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onSelectDate(dateStr)}
                  className={`h-9 w-full rounded-xl flex items-center justify-center text-xs font-medium transition-all relative cursor-pointer ${
                    !isCurrentMonth ? 'text-neutral-300 dark:text-neutral-700' : ''
                  } ${
                    isSelected
                      ? 'bg-teal-600 text-white font-bold shadow-xs dark:bg-teal-500 dark:text-teal-950'
                      : isDisabled
                      ? 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed line-through decoration-neutral-300/60'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <span>{format(day, 'd')}</span>
                  {isClinicHoliday && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-rose-400" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] flex items-center justify-between text-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600" /> Selected
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" /> Holiday
            </span>
            <span className="flex items-center gap-1.5">
              <span className="line-through">0</span> Unavailable
            </span>
          </div>
        </div>

        {/* Right: Slots Grid */}
        <div className="lg:col-span-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {selectedDate
                  ? format(new Date(`${selectedDate}T12:00:00`), 'EEEE, MMMM d, yyyy')
                  : 'Select a Date'}
              </h3>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              {service.durationMinutes} min visit
            </span>
          </div>

          {/* Holiday message */}
          {slotData.isHoliday && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-200 flex items-start gap-2.5 my-4">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold">Clinic Holiday: {slotData.holidayName}</p>
                <p className="text-xs text-amber-700/80 dark:text-amber-300/80 mt-0.5">
                  The clinic is closed for this official holiday. Please choose another date.
                </p>
              </div>
            </div>
          )}

          {/* Day off message */}
          {slotData.isDayOff && (
            <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 flex items-start gap-2.5 my-4">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold">Provider Off-Duty</p>
                <p className="mt-0.5">
                  The selected dentist does not have operating hours on this weekday. Try switching to "Any Available Dentist" or pick another weekday.
                </p>
              </div>
            </div>
          )}

          {!slotData.isHoliday && !slotData.isDayOff && (
            <div className="space-y-5">
              {/* Morning Slots */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Morning Slots</span>
                </div>

                {morningSlots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {morningSlots.map((slot, i) => {
                      const isSelected = selectedSlot?.startTime === slot.startTime;

                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => onSelectSlot(slot)}
                          className={`p-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-teal-600 text-white font-bold border-teal-600 shadow-xs'
                              : slot.available
                              ? 'bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700/80 text-neutral-800 dark:text-neutral-200 hover:border-teal-500'
                              : 'bg-neutral-100/60 dark:bg-neutral-800/30 border-neutral-200/40 dark:border-neutral-800 text-neutral-400 cursor-not-allowed opacity-50'
                          }`}
                        >
                          <span className="block font-mono font-semibold">{slot.startTime}</span>
                          <span className="text-[10px] text-neutral-400 block mt-0.5 truncate">
                            {slot.available ? 'Available' : slot.reasonDisabled || 'Booked'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 italic">No morning slots for this date.</p>
                )}
              </div>

              {/* Afternoon Slots */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2.5">
                  <Sunset className="w-3.5 h-3.5 text-orange-500" />
                  <span>Afternoon Slots</span>
                </div>

                {afternoonSlots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {afternoonSlots.map((slot, i) => {
                      const isSelected = selectedSlot?.startTime === slot.startTime;

                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => onSelectSlot(slot)}
                          className={`p-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-teal-600 text-white font-bold border-teal-600 shadow-xs'
                              : slot.available
                              ? 'bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700/80 text-neutral-800 dark:text-neutral-200 hover:border-teal-500'
                              : 'bg-neutral-100/60 dark:bg-neutral-800/30 border-neutral-200/40 dark:border-neutral-800 text-neutral-400 cursor-not-allowed opacity-50'
                          }`}
                        >
                          <span className="block font-mono font-semibold">{slot.startTime}</span>
                          <span className="text-[10px] text-neutral-400 block mt-0.5 truncate">
                            {slot.available ? 'Available' : slot.reasonDisabled || 'Booked'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 italic">No afternoon slots for this date.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
