import React, { useEffect } from 'react';
import { useRouter } from '../../lib/router';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';

export interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectPath?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  allowedRoles,
  redirectPath = '/login',
}) => {
  const { currentUser, isAuthenticated } = useAuthStore();
  const { path, navigate } = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { redirect: path });
    }
  }, [isAuthenticated, path, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 border border-amber-200 dark:border-amber-800">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Authentication Required
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mb-6">
          Please sign in to access your appointment records or administration console.
        </p>
        <Button onClick={() => navigate('/login', { redirect: path })}>
          Sign In Now
        </Button>
      </div>
    );
  }

  // Role check
  if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 border border-rose-200 dark:border-rose-800">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Admin Access Required
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mb-6">
          Your current account ({currentUser.email}) does not have administrative permissions. Please sign in as an administrator.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/account')}>
            Go to Patient Portal
          </Button>
          <Button onClick={() => navigate('/login', { redirect: '/admin' })}>
            Switch to Admin Demo
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
