'use client';

import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { trackEvent } from 'fathom-client';

const ATTRIBUTION_TEXT =
  'City Icons by Studio Partdirector — https://svgcities.com — licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)';

const ATTRIBUTION_HTML =
  '<a href="https://svgcities.com">City Icons</a> by <a href="https://partdirector.ch">Studio Partdirector</a>, licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>';

interface AttributionSnippetProps {
  label: string;
  snippet: string;
}

function AttributionSnippet({ label, snippet }: AttributionSnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      trackEvent('ATTRIBUTION_COPIED');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the snippet is still selectable by hand
    }
  };

  return (
    <div className="bg-background/50 rounded-lg border border-muted-foreground/20 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-muted-foreground/20">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label={`Copy ${label} attribution snippet`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" aria-hidden="true" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" aria-hidden="true" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="px-4 py-3 text-sm text-muted-foreground whitespace-pre-wrap break-words overflow-x-auto">
        <code>{snippet}</code>
      </pre>
    </div>
  );
}

export function LicenseContent() {
  useEffect(() => {
    // Track license page visit
    trackEvent('LICENSE_PAGE_VISIT');
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-muted/30 rounded-lg p-8 md:p-12">
        <div className="space-y-8">
          {/* Free for any use */}
          <section aria-labelledby="free-use-heading">
            <h2 id="free-use-heading" className="text-2xl font-semibold text-foreground mb-4">
              Free for Any Use — Including Commercial
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              All icons are licensed under{' '}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-orange-600 transition-colors underline"
              >
                Creative Commons Attribution 4.0 (CC BY 4.0)
              </a>
              . Use them in personal, educational, and commercial projects — websites, apps, print,
              products, anything. No permission needed, no fees, and the license is irrevocable.
              The only condition is attribution.
            </p>
          </section>

          {/* What the license asks */}
          <section aria-labelledby="conditions-heading">
            <h2 id="conditions-heading" className="text-2xl font-semibold text-foreground mb-4">
              What CC BY 4.0 Asks of You
            </h2>
            <ul className="text-lg text-muted-foreground leading-relaxed list-disc pl-6 space-y-2">
              <li>Give credit to Studio Partdirector and link to the license.</li>
              <li>If you modify an icon, say that you changed it.</li>
              <li>Don&apos;t add legal or technical restrictions that stop others from doing what the license allows.</li>
            </ul>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              That&apos;s it. There&apos;s no share-alike requirement — your own project keeps
              whatever license you choose.
            </p>
          </section>

          {/* Attribution */}
          <section aria-labelledby="attribution-heading">
            <h2 id="attribution-heading" className="text-2xl font-semibold text-foreground mb-4">
              How to Attribute
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Copy one of these into your credits, footer, or about page:
            </p>
            <div className="space-y-4">
              <AttributionSnippet label="Plain text" snippet={ATTRIBUTION_TEXT} />
              <AttributionSnippet label="HTML" snippet={ATTRIBUTION_HTML} />
            </div>
          </section>

          {/* Code license */}
          <section aria-labelledby="code-license-heading">
            <h2 id="code-license-heading" className="text-2xl font-semibold text-foreground mb-4">
              Site Code
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The source code of this website is open source under the{' '}
              <a
                href="https://github.com/anto1/city-icons/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-orange-600 transition-colors underline"
              >
                MIT License
              </a>
              . The split is simple: everything in <code className="text-foreground">public/icons/</code>{' '}
              is CC BY 4.0 artwork, everything else is MIT code.
            </p>
          </section>

          {/* Questions */}
          <section aria-labelledby="questions-heading">
            <h2 id="questions-heading" className="text-2xl font-semibold text-foreground mb-4">
              Questions?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Not sure about a use case? Drop a line at{' '}
              <a
                href="mailto:icons@partdirector.ch?subject=License Question"
                className="text-foreground hover:text-orange-600 transition-colors underline"
              >
                icons@partdirector.ch
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
