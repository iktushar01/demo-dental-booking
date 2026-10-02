import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useClinicStore } from '../../store/useClinicStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { User, Mail, Phone, Calendar, Lock, Check } from 'lucide-react';
import { toast } from 'sonner';

export const PatientProfile: React.FC = () => {
  const { currentUser, updateProfile } = useAuthStore();
  const { patients, updatePatient } = useClinicStore();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [dateOfBirth, setDateOfBirth] = useState(currentUser?.dateOfBirth || '1992-06-14');

  // Mock password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Full name is required');
      return;
    }

    updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      dateOfBirth,
    });

    // Also sync in clinicStore patients
    const patientMatch = patients.find(
      (p) => p.email.toLowerCase() === currentUser?.email.toLowerCase()
    );
    if (patientMatch) {
      updatePatient(patientMatch.id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        dateOfBirth,
      });
    }

    toast.success('Patient profile saved successfully');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    toast.success('Password updated successfully (mock simulation)');
    setOldPassword('');
    setNewPassword('');
    setIsChangingPass(false);
  };

  return (
    <div className="space-y-8 text-left max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Personal Information
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Keep your medical record contact info and emergency numbers accurate.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-4">
        <Input
          label="Full Legal Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<User className="w-4 h-4" />}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon={<Phone className="w-4 h-4" />}
          />
        </div>

        <Input
          label="Date of Birth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          leftIcon={<Calendar className="w-4 h-4" />}
        />

        <div className="pt-2">
          <Button type="submit" size="sm">
            Save Profile Changes
          </Button>
        </div>
      </form>

      {/* Password Management */}
      <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Security & Credentials
            </h3>
            <p className="text-xs text-neutral-500">
              Change your patient portal password or authentication passphrase.
            </p>
          </div>

          {!isChangingPass && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsChangingPass(true)}
              leftIcon={<Lock className="w-3.5 h-3.5" />}
            >
              Change Password
            </Button>
          )}
        </div>

        {isChangingPass && (
          <form onSubmit={handleChangePassword} className="space-y-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />

            <Input
              label="New Password"
              type="password"
              placeholder="Minimum 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <div className="flex gap-2 pt-2">
              <Button type="submit" size="sm">
                Update Password
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsChangingPass(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
