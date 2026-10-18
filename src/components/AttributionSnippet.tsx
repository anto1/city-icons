'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { trackEvent } from 'fathom-client';

interface AttributionSnippetProps {
  label: string;
  snippet: string;
}

export function AttributionSnippet({ label, snippet }: AttributionSnippetProps) {
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

