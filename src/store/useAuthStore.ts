import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => { success: boolean; error?: string; user?: User };
  register: (userData: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    dateOfBirth?: string;
  }) => { success: boolean; error?: string; user?: User };
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,

      login: (email: string, password?: string) => {
        const cleanEmail = email.trim().toLowerCase();

        // Admin demo check
        if (cleanEmail === 'admin@demo.com') {
          if (password && password !== 'admin123') {
            return { success: false, error: 'Invalid password. Use "admin123" for demo.' };
          }
          const adminUser: User = {
            id: 'admin-1',
            name: 'Dr. Sarah Jenkins (Admin)',
            email: 'admin@demo.com',
            role: 'admin',
            phone: '(555) 234-5678',
            avatarInitials: 'SJ',
          };
          set({ currentUser: adminUser, isAuthenticated: true });
          return { success: true, user: adminUser };
        }

        // Demo patient check
        if (cleanEmail === 'user@demo.com') {
          if (password && password !== 'user123') {
            return { success: false, error: 'Invalid password. Use "user123" for demo.' };
          }
          const patientUser: User = {
            id: 'patient-demo',
            name: 'Alex Morgan',
            email: 'user@demo.com',
            role: 'patient',
            phone: '(555) 789-0123',
            dateOfBirth: '1992-06-14',
            avatarInitials: 'AM',
          };
          set({ currentUser: patientUser, isAuthenticated: true });
          return { success: true, user: patientUser };
        }

        // Custom patient or any valid email
        if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
          return { success: false, error: 'Please enter a valid email address.' };
        }

        const nameFromEmail = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
        const initials = nameFromEmail
          .split(' ')
          .map((n) => n[0]?.toUpperCase() || '')
          .slice(0, 2)
          .join('') || 'U';

        const customUser: User = {
          id: `user-${Date.now()}`,
          name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
          email: cleanEmail,
          role: 'patient',
          avatarInitials: initials,
        };

        set({ currentUser: customUser, isAuthenticated: true });
        return { success: true, user: customUser };
      },

      register: (userData) => {
        const cleanEmail = userData.email.trim().toLowerCase();
        if (!cleanEmail.includes('@')) {
          return { success: false, error: 'Invalid email address.' };
        }
        if (!userData.name.trim()) {
          return { success: false, error: 'Please enter your full name.' };
        }

        const initials = userData.name
          .split(' ')
          .map((n) => n[0]?.toUpperCase() || '')
          .slice(0, 2)
          .join('') || 'P';

        const newUser: User = {
          id: `patient-${Date.now()}`,
          name: userData.name.trim(),
          email: cleanEmail,
          role: 'patient',
          phone: userData.phone?.trim(),
          dateOfBirth: userData.dateOfBirth,
          avatarInitials: initials,
        };

        set({ currentUser: newUser, isAuthenticated: true });
        return { success: true, user: newUser };
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },

      updateProfile: (updates) => {
        const user = get().currentUser;
        if (!user) return;
        set({
          currentUser: { ...user, ...updates },
        });
      },
    }),
    {
      name: 'brightsmile_auth_store_v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
