'use client';

import { Toaster } from 'sonner';
import { useTheme } from '@/components/ThemeProvider';

/**
 * Sonner Toaster wired to the app's ThemeProvider. Sonner defaults to its
 * "light" theme and cannot detect our custom `.dark`-class system, so without
 * this wrapper every toast renders as a bright light card in dark mode.
 * Must be rendered inside <ThemeProvider>.
 */
export function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return <Toaster theme={resolvedTheme} />;
}
