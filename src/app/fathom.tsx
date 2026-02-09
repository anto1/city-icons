'use client';

import { load, trackPageview } from 'fathom-client';
import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function TrackPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fathomId = process.env.NEXT_PUBLIC_FATHOM_SITE_ID;
    if (fathomId) {
      load(fathomId, {
        auto: false
      });
    }
  }, []);

  useEffect(() => {
    if (!pathname) return;

    const search = searchParams?.toString();
    trackPageview({
      url: pathname + (search ? `?${search}` : ''),
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
