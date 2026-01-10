'use client';

import { Github } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { trackEvent } from 'fathom-client';

export function PageHeader() {
  return (
    <div className="relative">
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <a
          href="https://github.com/anto1/city-icons"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          onClick={() => trackEvent('GITHUB_CLICKED')}
          aria-label="View on GitHub"
        >
          <Github className="w-5 h-5" />
        </a>
        <ThemeToggle />
      </div>
    </div>
  );
}
