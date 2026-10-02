import React, { useState } from 'react';
import { useRouter, Link } from '../../lib/router';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useClinicStore } from '../../store/useClinicStore';
import { Button } from '../ui/Button';
import {
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  Calendar,
  User as UserIcon,
  ShieldCheck,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { path, navigate } = useRouter();
  const { currentUser, logout } = useAuthStore();
  const { theme, setTheme, resolvedTheme, toggleTheme } = useThemeStore();
  const { clinicConfig } = useClinicStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-neutral-200/90 dark:border-neutral-800 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-teal-500 transition-colors">
            BS
          </div>
          <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            {clinicConfig.name}
          </span>
        </Link>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          <Link
            to="/"
            className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            activeClassName="text-teal-600 dark:text-teal-400 font-semibold"
          >
            Home
          </Link>
          <Link
            to="/services"
            className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            activeClassName="text-teal-600 dark:text-teal-400 font-semibold"
          >
            Services
          </Link>
          <Link
            to="/dentists"
            className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            activeClassName="text-teal-600 dark:text-teal-400 font-semibold"
          >
            Dentists
          </Link>
          <Link
            to="/account"
            className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            activeClassName="text-teal-600 dark:text-teal-400 font-semibold"
          >
            Patient Portal
          </Link>
          {currentUser?.role === 'admin' && (
            <Link
              to="/admin"
              className="text-amber-700 dark:text-amber-400 hover:text-amber-800 transition-colors flex items-center gap-1"
              activeClassName="font-semibold underline decoration-amber-500 underline-offset-4"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Zone 3: 1-2 primary actions + theme toggle & user */}
        <div className="flex items-center gap-3">
          {/* Quick 1-Click Theme Toggle Button */}
          <button
            onClick={() => {
              toggleTheme();
            }}
            className="p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer border border-neutral-200 dark:border-neutral-800"
            title={`Current: ${resolvedTheme === 'dark' ? 'Dark' : 'Light'} (Click to switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode)`}
            aria-label="Toggle light and dark theme mode"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-700" />
            )}
          </button>

          {/* User Account / Login State */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs font-medium cursor-pointer"
              >
                <span className="hidden sm:inline-block max-w-[110px] truncate text-neutral-800 dark:text-neutral-200 font-medium">
                  {currentUser.name}
                </span>
                <div className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-[10px]">
                  {currentUser.avatarInitials || 'U'}
                </div>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg py-1.5 z-50 text-xs font-medium">
                    <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-neutral-500 truncate">
                        {currentUser.email}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        navigate('/account');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5" /> Patient Dashboard
                    </button>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          navigate('/admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-amber-700 dark:text-amber-400 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Admin Console
                      </button>
                    )}

                    <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full px-3 py-2 flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-rose-600 dark:text-rose-400 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
              className="text-xs font-semibold"
            >
              Sign In
            </Button>
          )}

          {/* Primary CTA: Book appointment */}
          <Button
            size="sm"
            onClick={() => navigate('/book')}
            className="hidden sm:inline-flex bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-xs"
            leftIcon={<Calendar className="w-3.5 h-3.5" />}
          >
            Book Appointment
          </Button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
            >
              Home
            </Link>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
            >
              Treatments & Services
            </Link>
            <Link
              to="/dentists"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
            >
              Meet Our Dentists
            </Link>
            <Link
              to="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
            >
              Patient Portal
            </Link>
            {currentUser?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold"
              >
                Admin Dashboard
              </Link>
            )}
          </nav>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-2">
            <button
              onClick={() => {
                toggleTheme();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
                <span>Theme: {resolvedTheme === 'dark' ? 'Dark' : 'Light'} Mode</span>
              </span>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold">Switch</span>
            </button>
            <Button
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/book');
              }}
              leftIcon={<Calendar className="w-4 h-4" />}
            >
              Book Appointment
            </Button>
            {!currentUser && (
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
              >
                Sign In / Demo Accounts
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
