import React, { useState } from 'react';
import { useRouter, Link } from '../lib/router';
import { useAuthStore } from '../store/useAuthStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, Lock, Sparkles, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const { login } = useAuthStore();
  const { queryParams, navigate } = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectPath = queryParams.get('redirect') || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = login(email, password);
    setIsLoading(false);

    if (res.success && res.user) {
      toast.success(`Welcome back, ${res.user.name}!`);
      if (redirectPath) {
        navigate(redirectPath);
      } else if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } else {
      setError(res.error || 'Invalid credentials');
      toast.error(res.error || 'Login failed');
    }
  };

  const handleFillDemo = (demoType: 'patient' | 'admin') => {
    if (demoType === 'patient') {
      setEmail('user@demo.com');
      setPassword('user123');
      const res = login('user@demo.com', 'user123');
      if (res.success) {
        toast.success('Logged in as Patient (Alex Morgan)');
        navigate(redirectPath || '/account');
      }
    } else {
      setEmail('admin@demo.com');
      setPassword('admin123');
      const res = login('admin@demo.com', 'admin123');
      if (res.success) {
        toast.success('Logged in as Clinic Administrator');
        navigate(redirectPath || '/admin');
      }
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
            Sign In to BrightSmile
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Access appointment schedules, reminders, or clinic admin operations.
          </p>
        </div>

        {/* Demo Accounts Panel */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50/80 via-white to-neutral-50 dark:from-teal-950/30 dark:via-neutral-900 dark:to-neutral-900 border border-teal-500/30 shadow-xs text-left">
          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 dark:text-teal-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Demo Accounts</span>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-3">
            Click either button below to auto-authenticate with mock demo credentials:
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('patient')}
              className="p-2.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-white dark:bg-neutral-800 hover:bg-teal-50 dark:hover:bg-neutral-700 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1">
                  <User className="w-3 h-3 text-teal-600" /> Patient Demo
                </span>
                <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:text-teal-600 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-[10px] text-neutral-400 mt-1 font-mono">user@demo.com</p>
              <p className="text-[10px] text-teal-700 dark:text-teal-400 font-medium">Redirects to /account</p>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-500" /> Admin Demo
                </span>
                <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:text-teal-600 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-[10px] text-neutral-400 mt-1 font-mono">admin@demo.com</p>
              <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">Redirects to /admin</p>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4 text-left">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
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
            Sign In
          </Button>

          <div className="text-center pt-2">
            <p className="text-xs text-neutral-500">
              New patient?{' '}
              <Link to="/register" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                Create a patient profile
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
