'use client';

import { load, trackPageview } from 'fathom-client';
import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function TrackPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fathomId = process.env.NEXT_PUBLIC_FATHOM_ID;
    console.log('Fathom ID:', fathomId); // Debug log
    if (fathomId) {
      load(fathomId, {
        auto: false
      });
      console.log('Fathom loaded with ID:', fathomId); // Debug log
    } else {
      console.error('Fathom ID not found in environment variables');
    }
  }, []);

  useEffect(() => {
    if (!pathname) return;

    trackPageview({
      url: pathname + searchParams?.toString(),
      referrer: document.referrer
    });
  }, [pathname, searchParams]);

  return null;
}

export function FathomAnalytics() {
  return (
    <Suspense fallback={null}>
      <TrackPageView />
    </Suspense>
  );
} 