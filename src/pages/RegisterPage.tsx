import React, { useState } from 'react';
import { useRouter, Link } from '../lib/router';
import { useAuthStore } from '../store/useAuthStore';
import { useClinicStore } from '../store/useClinicStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, Lock, User, Phone, Calendar, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const RegisterPage: React.FC = () => {
  const { register } = useAuthStore();
  const { addPatient } = useClinicStore();
  const { navigate } = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('1995-05-12');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = register({
      name,
      email,
      password,
      phone,
      dateOfBirth: dob,
    });

    setIsLoading(false);

    if (res.success && res.user) {
      // Also register in clinic patients list
      addPatient({
        name: res.user.name,
        email: res.user.email,
        phone: phone || '(555) 000-0000',
        dateOfBirth: dob,
      });

      toast.success('Patient profile registered! Welcome to BrightSmile.');
      navigate('/account');
    } else {
      setError(res.error || 'Registration failed');
      toast.error(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-base mx-auto shadow-xs">
            BS
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Create Patient Profile
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Register for appointment management, reminders, and treatment histories.
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4 text-left">
          <Input
            label="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rachel Adams"
            leftIcon={<User className="w-4 h-4" />}
          />

          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="rachel@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 789-0123"
              leftIcon={<Phone className="w-4 h-4" />}
            />

            <Input
              label="Date of Birth"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              leftIcon={<Calendar className="w-4 h-4" />}
            />
          </div>

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            leftIcon={<Lock className="w-4 h-4" />}
          />

          {error && (
            <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full justify-center"
            isLoading={isLoading}
          >
            Complete Registration
          </Button>

          <div className="text-center pt-2">
            <p className="text-xs text-neutral-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
