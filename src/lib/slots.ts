import { parse, addMinutes, format, isBefore, isAfter, isValid } from 'date-fns';
import { Dentist, Service, Appointment, BlockedSlot, ClinicHoliday } from '../types';

export interface GeneratedTimeSlot {
  startTime: string; // "09:00"
  endTime: string;   // "09:45"
  displayTime: string; // "9:00 AM - 9:45 AM"
  available: boolean;
  reasonDisabled?: string;
  dentistId?: string; // If 'any' dentist mode was used, which dentist can take this slot
}

/**
 * Single Slot-Generation Utility
 * ==============================================================================
 * Calculates available appointment slots for a given date, dentist, and service.
 *
 * Logic overview:
 * 1. Holiday Check: Verifies if dateStr is in clinicHolidays.
 * 2. Day-of-Week Check: Confirms the dentist works on this specific weekday (0=Sun..6=Sat).
 * 3. Working Hours Bounds: Iterates in 30-minute increments from workingHours.start
 *    up to workingHours.end minus service duration.
 * 4. Lunch Break Exclusion: Detects if any part of the treatment window overlaps lunch.
 * 5. Existing Appointment Overlap: Evaluates non-cancelled appointments for this dentist.
 *    Two intervals [A_start, A_end) and [B_start, B_end) overlap iff:
 *    A_start < B_end AND A_end > B_start.
 * 6. Admin Blocked Slots: Evaluates explicit admin blocks (for this dentist or clinic-wide).
 * 7. Past Time Check: If the requested date is today, past hours are marked unavailable.
 * ==============================================================================
 */
export function generateAvailableSlots(params: {
  dateStr: string; // "YYYY-MM-DD"
  service: Service;
  dentist?: Dentist | null; // null/undefined means "Any Available"
  allDentists: Dentist[];
  existingAppointments: Appointment[];
  blockedSlots: BlockedSlot[];
  clinicHolidays: ClinicHoliday[];
  currentTime?: Date; // For testing and current day past-time enforcement
}): {
  isHoliday: boolean;
  holidayName?: string;
  isDayOff: boolean;
  slots: GeneratedTimeSlot[];
} {
  const {
    dateStr,
    service,
    dentist,
    allDentists,
    existingAppointments,
    blockedSlots,
    clinicHolidays,
    currentTime = new Date(),
  } = params;

  // 1. Check if clinic holiday
  const holiday = clinicHolidays.find((h) => h.date === dateStr);
  if (holiday) {
    return {
      isHoliday: true,
      holidayName: holiday.name,
      isDayOff: false,
      slots: [],
    };
  }

  // Parse date object
  const dateObj = new Date(`${dateStr}T12:00:00`);
  if (!isValid(dateObj)) {
    return { isHoliday: false, isDayOff: false, slots: [] };
  }
  const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

  // Determine candidate dentists
  const candidateDentists: Dentist[] = dentist
    ? [dentist]
    : allDentists.filter((d) => d.active);

  // If specific dentist selected, verify working days
  if (dentist && !dentist.workingDays.includes(dayOfWeek)) {
    return {
      isHoliday: false,
      isDayOff: true,
      slots: [],
    };
  }

  // Active dentists working on this day
  const workingDentists = candidateDentists.filter((d) => d.workingDays.includes(dayOfWeek));
  if (workingDentists.length === 0) {
    return {
      isHoliday: false,
      isDayOff: true,
      slots: [],
    };
  }

  // 2. Generate standard candidate slot start times
  // Earliest start among working dentists, latest end
  let earliestStart = '09:00';
  let latestEnd = '17:00';

  if (dentist) {
    earliestStart = dentist.workingHours.start;
    latestEnd = dentist.workingHours.end;
  } else {
    // Union across all working dentists
    const startTimes = workingDentists.map((d) => d.workingHours.start).sort();
    const endTimes = workingDentists.map((d) => d.workingHours.end).sort();
    if (startTimes.length > 0) earliestStart = startTimes[0];
    if (endTimes.length > 0) latestEnd = endTimes[endTimes.length - 1];
  }

  // Create slot increments of 30 minutes
  const slots: GeneratedTimeSlot[] = [];
  const baseDate = parse(dateStr, 'yyyy-MM-dd', new Date());

  let currentSlotStart = parse(`${dateStr} ${earliestStart}`, 'yyyy-MM-dd HH:mm', baseDate);
  const dayEndLimit = parse(`${dateStr} ${latestEnd}`, 'yyyy-MM-dd HH:mm', baseDate);

  const durationMin = service.durationMinutes || 45;

  while (isBefore(addMinutes(currentSlotStart, durationMin), dayEndLimit) || 
         +addMinutes(currentSlotStart, durationMin) === +dayEndLimit) {
    const currentSlotEnd = addMinutes(currentSlotStart, durationMin);
    const startStr = format(currentSlotStart, 'HH:mm');
    const endStr = format(currentSlotEnd, 'HH:mm');
    const displayTime = `${format(currentSlotStart, 'h:mm a')} – ${format(currentSlotEnd, 'h:mm a')}`;

    // Check if slot is in the past (for today's date)
    const isPastTime = isBefore(currentSlotStart, currentTime);

    // Test each candidate dentist for availability in this window
    let isAvailable = false;
    let assignedDentistId: string | undefined = undefined;
    let disabledReason: string | undefined = undefined;

    if (isPastTime) {
      disabledReason = 'Past time';
    } else {
      for (const d of workingDentists) {
        // Must fall within this dentist's working hours
        const dStart = parse(`${dateStr} ${d.workingHours.start}`, 'yyyy-MM-dd HH:mm', baseDate);
        const dEnd = parse(`${dateStr} ${d.workingHours.end}`, 'yyyy-MM-dd HH:mm', baseDate);

        if (isBefore(currentSlotStart, dStart) || isAfter(currentSlotEnd, dEnd)) {
          continue; // outside this dentist's hours
        }

        // Must not conflict with lunch break
        if (d.workingHours.lunchBreak) {
          const lStart = parse(`${dateStr} ${d.workingHours.lunchBreak.start}`, 'yyyy-MM-dd HH:mm', baseDate);
          const lEnd = parse(`${dateStr} ${d.workingHours.lunchBreak.end}`, 'yyyy-MM-dd HH:mm', baseDate);
          // Overlap: slotStart < lEnd && slotEnd > lStart
          if (isBefore(currentSlotStart, lEnd) && isAfter(currentSlotEnd, lStart)) {
            continue; // overlaps lunch
          }
        }

        // Must not conflict with existing appointment
        const hasAppointmentConflict = existingAppointments.some((appt) => {
          if (appt.status === 'cancelled') return false;
          if (appt.date !== dateStr) return false;
          if (appt.dentistId !== d.id) return false;

          const apptStart = parse(`${dateStr} ${appt.startTime}`, 'yyyy-MM-dd HH:mm', baseDate);
          const apptEnd = parse(`${dateStr} ${appt.endTime}`, 'yyyy-MM-dd HH:mm', baseDate);

          return isBefore(currentSlotStart, apptEnd) && isAfter(currentSlotEnd, apptStart);
        });

        if (hasAppointmentConflict) {
          disabledReason = 'Booked';
          continue;
        }

        // Must not conflict with blocked slot (dentist-specific or all)
        const hasBlockedConflict = blockedSlots.some((block) => {
          if (block.date !== dateStr) return false;
          if (block.dentistId && block.dentistId !== 'all' && block.dentistId !== d.id) return false;

          const bStart = parse(`${dateStr} ${block.startTime}`, 'yyyy-MM-dd HH:mm', baseDate);
          const bEnd = parse(`${dateStr} ${block.endTime}`, 'yyyy-MM-dd HH:mm', baseDate);

          return isBefore(currentSlotStart, bEnd) && isAfter(currentSlotEnd, bStart);
        });

        if (hasBlockedConflict) {
          disabledReason = 'Reserved/Blocked';
          continue;
        }

        // Found an available dentist for this slot!
        isAvailable = true;
        assignedDentistId = d.id;
        disabledReason = undefined;
        break;
      }
    }

    slots.push({
      startTime: startStr,
      endTime: endStr,
      displayTime,
      available: isAvailable,
      reasonDisabled: isAvailable ? undefined : (disabledReason || 'Unavailable'),
      dentistId: assignedDentistId,
    });

    // Advance by 30-minute interval
    currentSlotStart = addMinutes(currentSlotStart, 30);
  }

  return {
    isHoliday: false,
    isDayOff: false,
    slots,
  };
}
