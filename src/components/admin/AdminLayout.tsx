import React, { useState } from 'react';
import { useRouter } from '../../lib/router';
import { useAuthStore } from '../../store/useAuthStore';
import { useClinicStore } from '../../store/useClinicStore';
import { useThemeStore } from '../../store/useThemeStore';
import { AdminOverview } from './AdminOverview';
import { AdminAppointments } from './AdminAppointments';
import { AdminCalendar } from './AdminCalendar';
import { AdminPatients } from './AdminPatients';
import { AdminDentists } from './AdminDentists';
import { AdminServices } from './AdminServices';
import { AdminAvailability } from './AdminAvailability';
import { AdminReminders } from './AdminReminders';
import { AdminSettings } from './AdminSettings';
import {
  LayoutDashboard,
  CalendarCheck,
  Calendar,
  Users,
  UserCheck,
  Sparkles,
  Clock,
  Bell,
  Settings,
  Menu,
  X,
  ArrowLeft,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'appointments'
  | 'calendar'
  | 'patients'
  | 'dentists'
  | 'services'
  | 'availability'
  | 'reminders'
  | 'settings';

export const AdminLayout: React.FC = () => {
  const { queryParams, navigate } = useRouter();
  const { currentUser, logout } = useAuthStore();
  const { clinicConfig } = useClinicStore();
  const { resolvedTheme, toggleTheme } = useThemeStore();

  const [activeTab, setActiveTab] = useState<AdminTab>(
    (queryParams.get('tab') as AdminTab) || 'overview'
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'appointments', label: 'Appointments', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'calendar', label: 'Schedule Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'patients', label: 'Patients', icon: <Users className="w-4 h-4" /> },
    { id: 'dentists', label: 'Dentists & Hours', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'services', label: 'Treatments & Fees', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'availability', label: 'Availability & Blocks', icon: <Clock className="w-4 h-4" /> },
    { id: 'reminders', label: 'Reminder Rules', icon: <Bell className="w-4 h-4" /> },
    { id: 'settings', label: 'Practice Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-neutral-100/60 dark:bg-neutral-950 flex flex-col md:flex-row">
      {/* Mobile Top bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Open admin sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
            {clinicConfig.name} Admin
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 cursor-pointer"
            title="Toggle Light / Dark mode"
          >
            {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
          </button>
          <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 capitalize font-mono">
            {activeTab}
          </span>
        </div>
      </div>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-5">
          {/* Brand & close button */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-left">
              <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                BS
              </div>
              <div>
                <h1 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate max-w-[140px]">
                  {clinicConfig.name}
                </h1>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Practice Console
                </p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-left">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white font-semibold shadow-xs dark:bg-teal-500 dark:text-teal-950'
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3 h-3" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Area */}
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-left">
          <div className="px-2 py-1 text-xs">
            <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              {currentUser?.name || 'Administrator'}
            </p>
            <p className="text-[11px] text-neutral-400 truncate">{currentUser?.email}</p>
          </div>

          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {resolvedTheme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-neutral-600" />}
              <span>{resolvedTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <span className="text-[10px] text-teal-600 font-bold">Toggle</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Site</span>
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-neutral-950/60 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Admin Content Canvas */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'overview' && <AdminOverview />}
        {activeTab === 'appointments' && <AdminAppointments />}
        {activeTab === 'calendar' && <AdminCalendar />}
        {activeTab === 'patients' && <AdminPatients />}
        {activeTab === 'dentists' && <AdminDentists />}
        {activeTab === 'services' && <AdminServices />}
        {activeTab === 'availability' && <AdminAvailability />}
        {activeTab === 'reminders' && <AdminReminders />}
        {activeTab === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
};
