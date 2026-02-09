'use client';

import { useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { trackEvent } from 'fathom-client';

export function LicenseContent() {
  useEffect(() => {
    // Track license page visit
    trackEvent('LICENSE_PAGE_VISIT');
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-muted/30 rounded-lg p-8 md:p-12">
        <div className="space-y-8">
          {/* Free Use */}
          <section aria-labelledby="free-use-heading">
            <h2 id="free-use-heading" className="text-2xl font-semibold text-foreground mb-4">
              Free for Personal & Educational Use
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              These icons are free to use for personal projects, educational purposes, presentations, and non-commercial work. Enjoy!
            </p>
          </section>

          {/* Commercial Restriction */}
          <section aria-labelledby="commercial-use-heading">
            <h2 id="commercial-use-heading" className="text-2xl font-semibold text-foreground mb-4">
              Commercial Use
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Commercial use is currently restricted while the project grows. If you&apos;d like to use these icons for commercial purposes, feel free to contact me and we can discuss your needs.
            </p>
            
            <div className="bg-background/50 rounded-lg p-6 border border-muted-foreground/20">
              <p className="text-sm text-muted-foreground mb-3">
                For commercial inquiries, reach out at:
              </p>
              <a 
                href="mailto:icons@partdirector.ch?subject=Commercial Use Inquiry"
                className="text-lg font-medium text-foreground hover:text-orange-600 transition-colors inline-flex items-center"
                onClick={() => trackEvent('COMMERCIAL_INQUIRY_CLICKED')}
              >
                icons@partdirector.ch
                <ExternalLink className="w-4 h-4 ml-2" aria-hidden="true" />
              </a>
            </div>
          </section>

          {/* Attribution */}
          <section aria-labelledby="attribution-heading">
            <h2 id="attribution-heading" className="text-2xl font-semibold text-foreground mb-4">
              Attribution
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              While not required, attribution is always appreciated. You can credit: &quot;City icons by Studio Partdirector&quot; with a link to{' '}
              <a
                href="https://svgcities.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-orange-600 transition-colors underline"
              >
                svgcities.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

