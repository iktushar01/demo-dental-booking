import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Input } from '../ui/Input';
import { User, Mail, Phone, FileText, CheckCircle2 } from 'lucide-react';

export interface PatientFormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

interface StepPatientDetailsProps {
  formData: PatientFormData;
  onChange: (field: keyof PatientFormData, value: string) => void;
  errors: Partial<Record<keyof PatientFormData, string>>;
}

export const StepPatientDetails: React.FC<StepPatientDetailsProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const { currentUser } = useAuthStore();

  useEffect(() => {
    if (currentUser) {
      if (!formData.name && currentUser.name) onChange('name', currentUser.name);
      if (!formData.email && currentUser.email) onChange('email', currentUser.email);
      if (!formData.phone && currentUser.phone) onChange('phone', currentUser.phone);
    }
  }, [currentUser]);

  return (
    <div className="space-y-6 text-left max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Patient Information
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Provide your details for appointment registration and appointment reminders.
        </p>
      </div>

      {currentUser && (
        <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/80 flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <span className="text-xs text-teal-800 dark:text-teal-200">
            Prefilled with your registered patient profile (<strong>{currentUser.email}</strong>).
          </span>
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Full Name"
          required
          placeholder="e.g. Eleanor Vance"
          leftIcon={<User className="w-4 h-4" />}
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          error={errors.name}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            required
            placeholder="e.g. eleanor@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            error={errors.email}
            helperText="Confirmation & calendar invite will be delivered here."
          />

          <Input
            label="Mobile Phone"
            type="tel"
            required
            placeholder="e.g. (555) 234-5678"
            leftIcon={<Phone className="w-4 h-4" />}
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            error={errors.phone}
            helperText="For SMS arrival reminder alerts."
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Notes / Concerns (Optional)
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => onChange('notes', e.target.value)}
              placeholder="Tell us about tooth sensitivity, dental anxiety, current medications, or previous dental work..."
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
          <p className="text-[11px] text-neutral-400">
            Our clinicians review patient notes prior to every procedure.
          </p>
        </div>
      </div>
    </div>
  );
};
