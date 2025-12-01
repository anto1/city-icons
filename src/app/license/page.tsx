'use client';

import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { trackEvent } from 'fathom-client';
import { useEffect } from 'react';

export default function LicensePage() {
  useEffect(() => {
    // Track license page visit
    trackEvent('LICENSE_PAGE_VISIT');
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Icons
          </Link>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Icon Usage & Licensing
          </h1>
          <p className="text-lg text-muted-foreground">
            Clear guidelines for using our city icons in your projects
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-muted/30 rounded-lg p-8 md:p-12">
            <div className="space-y-8">
              {/* Free Use */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Free for Personal & Educational Use
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  These icons are free to use for personal projects, educational purposes, presentations, and non-commercial work. Enjoy!
                </p>
              </section>

              {/* Commercial Restriction */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
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
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </section>

              {/* Attribution */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Attribution
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  While not required, attribution is always appreciated. You can credit: &quot;City icons by Studio Partdirector&quot; with a link to{' '}
                  <a 
                    href="https://cities.partdirector.ch" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-orange-600 transition-colors underline"
                  >
                    cities.partdirector.ch
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-6 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-foreground">
              © Studio Partdirector, 2025
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
} 