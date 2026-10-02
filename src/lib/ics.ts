import { parse, format } from 'date-fns';
import { Appointment, Dentist, Service, ClinicConfig } from '../types';

export function generateIcsCalendar(params: {
  appointment: Appointment;
  dentist?: Dentist;
  service?: Service;
  clinic: ClinicConfig;
}): string {
  const { appointment, dentist, service, clinic } = params;

  // Format start and end date times
  const startDate = parse(`${appointment.date} ${appointment.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
  const endDate = parse(`${appointment.date} ${appointment.endTime}`, 'yyyy-MM-dd HH:mm', new Date());

  const formatIcsDate = (date: Date) => {
    return format(date, "yyyyMMdd'T'HHmmss");
  };

  const serviceName = service?.name || 'Dental Appointment';
  const dentistName = dentist ? `Dr. ${dentist.name}` : 'BrightSmile Dentist';
  const clinicLocation = `${clinic.name}, ${clinic.address}, ${clinic.city}, ${clinic.state} ${clinic.postalCode}`;

  const descriptionLines = [
    `Appointment Reference: ${appointment.bookingCode}`,
    `Service: ${serviceName}`,
    `Dentist: ${dentistName}`,
    `Location: ${clinicLocation}`,
    `Clinic Phone: ${clinic.phone}`,
    appointment.notes ? `Patient Notes: ${appointment.notes}` : '',
    '',
    'Please arrive 10 minutes prior to your appointment time. If you need to reschedule or cancel, please provide at least 24 hours notice.',
  ].filter(Boolean).join('\\n');

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BrightSmile Dental//Appointment Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${appointment.bookingCode}-${startDate.getTime()}@brightsmiledental.com`,
    `DTSTAMP:${formatIcsDate(new Date())}Z`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:${serviceName} at ${clinic.name}`,
    `DESCRIPTION:${descriptionLines}`,
    `LOCATION:${clinicLocation}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Dental appointment in 2 hours',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return icsLines.join('\r\n');
}
