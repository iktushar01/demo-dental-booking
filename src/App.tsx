import React, { useEffect } from 'react';
import { RouterProvider, useRouter } from './lib/router';
import { useThemeStore } from './store/useThemeStore';
import { DemoBanner } from './components/layout/DemoBanner';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { ServicesPage } from './pages/ServicesPage';
import { DentistsPage } from './pages/DentistsPage';
import { BookPage } from './pages/BookPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';
import { Toaster } from 'sonner';

function AppContent() {
  const { path } = useRouter();
  const { theme, resolvedTheme } = useThemeStore();

  // Ensure dark class is synchronized on html
  useEffect(() => {
    const root = document.documentElement;
    let isDark = false;
    if (theme === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDark = theme === 'dark';
    }

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, resolvedTheme]);

  // Admin route has its own dedicated full-height dashboard layout
  if (path === '/admin' || path.startsWith('/admin/')) {
    return (
      <div className="min-h-screen bg-neutral-100/60 dark:bg-neutral-950 font-sans">
        <DemoBanner />
        <AdminPage />
        <Toaster position="top-right" richColors theme={resolvedTheme} />
      </div>
    );
  }

  // Render matching public or patient portal page
  const renderPage = () => {
    switch (path) {
      case '/':
        return <LandingPage />;
      case '/services':
        return <ServicesPage />;
      case '/dentists':
        return <DentistsPage />;
      case '/book':
        return <BookPage />;
      case '/login':
        return <LoginPage />;
      case '/register':
        return <RegisterPage />;
      case '/account':
        return <AccountPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans transition-colors">
      <DemoBanner />
      <Header />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
      <Toaster position="top-right" richColors theme={resolvedTheme} />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
