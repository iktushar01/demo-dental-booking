import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Dentist,
  Service,
  Appointment,
  Patient,
  BlockedSlot,
  ClinicHoliday,
  ReminderRule,
  SentReminderLog,
  ClinicConfig,
} from '../types';
import { defaultClinicConfig } from '../lib/config';
import {
  seedDentists,
  seedServices,
  createSeedAppointments,
  seedPatients,
  seedClinicHolidays,
  seedBlockedSlots,
  seedReminderRules,
  seedSentReminders,
} from '../data/seed';

interface ClinicStoreState {
  dentists: Dentist[];
  services: Service[];
  appointments: Appointment[];
  patients: Patient[];
  blockedSlots: BlockedSlot[];
  clinicHolidays: ClinicHoliday[];
  reminderRules: ReminderRule[];
  sentReminders: SentReminderLog[];
  clinicConfig: ClinicConfig;

  // Appointment actions
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Appointment;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (id: string, reason?: string) => void;
  rescheduleAppointment: (
    id: string,
    newDate: string,
    newStartTime: string,
    newEndTime: string,
    newDentistId?: string
  ) => void;
  deleteAppointment: (id: string) => void;

  // Patient actions
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'pastVisitCount'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;

  // Dentist actions
  addDentist: (dentist: Omit<Dentist, 'id'>) => Dentist;
  updateDentist: (id: string, updates: Partial<Dentist>) => void;

  // Service actions
  addService: (service: Omit<Service, 'id'>) => Service;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;

  // Blocked slots & holidays actions
  addBlockedSlot: (slot: Omit<BlockedSlot, 'id'>) => BlockedSlot;
  deleteBlockedSlot: (id: string) => void;
  addHoliday: (holiday: Omit<ClinicHoliday, 'id'>) => ClinicHoliday;
  deleteHoliday: (id: string) => void;

  // Reminder rules actions
  updateReminderRule: (id: string, updates: Partial<ReminderRule>) => void;

  // Config actions
  updateClinicConfig: (updates: Partial<ClinicConfig>) => void;

  // Reset to seed data
  resetDemoData: () => void;
}

export const useClinicStore = create<ClinicStoreState>()(
  persist(
    (set, get) => ({
      dentists: seedDentists,
      services: seedServices,
      appointments: createSeedAppointments(),
      patients: seedPatients,
      blockedSlots: seedBlockedSlots,
      clinicHolidays: seedClinicHolidays,
      reminderRules: seedReminderRules,
      sentReminders: seedSentReminders,
      clinicConfig: defaultClinicConfig,

      addAppointment: (appointmentData) => {
        const now = new Date().toISOString();
        const newAppt: Appointment = {
          ...appointmentData,
          id: `appt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => {
          // Check if patient exists or update their visit count
          let updatedPatients = [...state.patients];
          const existingPatientIndex = updatedPatients.findIndex(
            (p) => p.email.toLowerCase() === newAppt.patientEmail.toLowerCase()
          );

          if (existingPatientIndex >= 0) {
            updatedPatients[existingPatientIndex] = {
              ...updatedPatients[existingPatientIndex],
              pastVisitCount: updatedPatients[existingPatientIndex].pastVisitCount + 1,
            };
          } else {
            // Auto register new patient entry
            const newPatient: Patient = {
              id: newAppt.patientId || `patient-${Date.now()}`,
              name: newAppt.patientName,
              email: newAppt.patientEmail,
              phone: newAppt.patientPhone,
              createdAt: now.split('T')[0],
              pastVisitCount: 1,
            };
            updatedPatients.push(newPatient);
          }

          // Auto log confirmation reminder if enabled
          const confirmationLog: SentReminderLog = {
            id: `log-${Date.now()}`,
            appointmentId: newAppt.id,
            bookingCode: newAppt.bookingCode,
            patientName: newAppt.patientName,
            recipient: newAppt.patientEmail,
            channel: 'email',
            sentAt: new Date().toLocaleString(),
            status: 'delivered',
          };

          return {
            appointments: [newAppt, ...state.appointments],
            patients: updatedPatients,
            sentReminders: [confirmationLog, ...state.sentReminders],
          };
        });

        return newAppt;
      },

      updateAppointment: (id, updates) => {
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
          ),
        }));
      },

      cancelAppointment: (id, reason) => {
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: 'cancelled',
                  cancellationReason: reason || 'Cancelled by patient',
                  updatedAt: new Date().toISOString(),
                }
              : a
          ),
        }));
      },

      rescheduleAppointment: (id, newDate, newStartTime, newEndTime, newDentistId) => {
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id
              ? {
                  ...a,
                  date: newDate,
                  startTime: newStartTime,
                  endTime: newEndTime,
                  dentistId: newDentistId || a.dentistId,
                  status: 'confirmed',
                  cancellationReason: undefined,
                  updatedAt: new Date().toISOString(),
                }
              : a
          ),
        }));
      },

      deleteAppointment: (id) => {
        set((state) => ({
          appointments: state.appointments.filter((a) => a.id !== id),
        }));
      },

      addPatient: (patientData) => {
        const newPatient: Patient = {
          ...patientData,
          id: `patient-${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
          pastVisitCount: 0,
        };
        set((state) => ({
          patients: [newPatient, ...state.patients],
        }));
        return newPatient;
      },

      updatePatient: (id, updates) => {
        set((state) => ({
          patients: state.patients.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      addDentist: (dentistData) => {
        const newDentist: Dentist = {
          ...dentistData,
          id: `dentist-${Date.now()}`,
        };
        set((state) => ({
          dentists: [...state.dentists, newDentist],
        }));
        return newDentist;
      },

      updateDentist: (id, updates) => {
        set((state) => ({
          dentists: state.dentists.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        }));
      },

      addService: (serviceData) => {
        const newService: Service = {
          ...serviceData,
          id: `serv-${Date.now()}`,
        };
        set((state) => ({
          services: [...state.services, newService],
        }));
        return newService;
      },

      updateService: (id, updates) => {
        set((state) => ({
          services: state.services.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }));
      },

      deleteService: (id) => {
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        }));
      },

      addBlockedSlot: (slotData) => {
        const newSlot: BlockedSlot = {
          ...slotData,
          id: `block-${Date.now()}`,
        };
        set((state) => ({
          blockedSlots: [...state.blockedSlots, newSlot],
        }));
        return newSlot;
      },

      deleteBlockedSlot: (id) => {
        set((state) => ({
          blockedSlots: state.blockedSlots.filter((b) => b.id !== id),
        }));
      },

      addHoliday: (holidayData) => {
        const newHoliday: ClinicHoliday = {
          ...holidayData,
          id: `hol-${Date.now()}`,
        };
        set((state) => ({
          clinicHolidays: [...state.clinicHolidays, newHoliday],
        }));
        return newHoliday;
      },

      deleteHoliday: (id) => {
        set((state) => ({
          clinicHolidays: state.clinicHolidays.filter((h) => h.id !== id),
        }));
      },

      updateReminderRule: (id, updates) => {
        set((state) => ({
          reminderRules: state.reminderRules.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        }));
      },

      updateClinicConfig: (updates) => {
        set((state) => ({
          clinicConfig: { ...state.clinicConfig, ...updates },
        }));
      },

      resetDemoData: () => {
        set({
          dentists: seedDentists,
          services: seedServices,
          appointments: createSeedAppointments(),
          patients: seedPatients,
          blockedSlots: seedBlockedSlots,
          clinicHolidays: seedClinicHolidays,
          reminderRules: seedReminderRules,
          sentReminders: seedSentReminders,
          clinicConfig: defaultClinicConfig,
        });
      },
    }),
    {
      name: 'brightsmile_clinic_store_v3',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.services) {
            state.services = state.services.map((s) => {
              const seedMatch = seedServices.find((seed) => seed.id === s.id);
              const isInvalidPath = !s.imageUrl || s.imageUrl.startsWith('/src/assets/');
              return {
                ...s,
                imageUrl: isInvalidPath ? seedMatch?.imageUrl : s.imageUrl,
              };
            });
          }
          if (state.dentists) {
            state.dentists = state.dentists.map((d) => {
              const seedMatch = seedDentists.find((seed) => seed.id === d.id);
              const isInvalidPath = !d.avatarUrl || d.avatarUrl.startsWith('/src/assets/');
              return {
                ...d,
                avatarUrl: isInvalidPath ? seedMatch?.avatarUrl : d.avatarUrl,
              };
            });
          }
        }
      },
    }
  )
);
