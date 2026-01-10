'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { trackEvent } from 'fathom-client';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    trackEvent(`THEME_CHANGED_${newTheme.toUpperCase()}`);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
