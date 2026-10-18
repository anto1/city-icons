'use client';

import { trackEvent } from 'fathom-client';

export function PressDownload() {
  return (
    <a href="/press/svgcities-press-kit.zip" download
      className="inline-flex items-center justify-center rounded-md bg-foreground text-background px-6 py-3 font-medium hover:opacity-80"
      onClick={() => trackEvent('PRESS_KIT_DOWNLOAD_CLICKED')}>
      Download press kit
    </a>
  );
}
