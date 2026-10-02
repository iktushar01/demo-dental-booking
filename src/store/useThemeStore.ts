import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export function applyThemeToDOM(theme: Theme): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';

  let effective: 'light' | 'dark' = 'light';
  if (theme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    effective = isDark ? 'dark' : 'light';
  } else {
    effective = theme;
  }

  const root = document.documentElement;
  if (effective === 'dark') {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  }

  return effective;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',
      setTheme: (newTheme: Theme) => {
        const resolved = applyThemeToDOM(newTheme);
        set({ theme: newTheme, resolvedTheme: resolved });
      },
      toggleTheme: () => {
        const currentResolved = get().resolvedTheme;
        const nextTheme: Theme = currentResolved === 'dark' ? 'light' : 'dark';
        const resolved = applyThemeToDOM(nextTheme);
        set({ theme: nextTheme, resolvedTheme: resolved });
      },
    }),
    {
      name: 'brightsmile_theme_v2',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.resolvedTheme = applyThemeToDOM(state.theme);
        }
      },
    }
  )
);

// Immediately apply on initial script execution in browser
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('brightsmile_theme_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.state?.theme) {
        applyThemeToDOM(parsed.state.theme);
      } else {
        applyThemeToDOM('system');
      }
    } else {
      applyThemeToDOM('system');
    }
  } catch {
    applyThemeToDOM('system');
  }

  // Listener for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const currentTheme = useThemeStore.getState().theme;
    if (currentTheme === 'system') {
      const resolved = applyThemeToDOM('system');
      useThemeStore.setState({ resolvedTheme: resolved });
    }
  });
}
