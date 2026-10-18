import { trackEvent } from 'fathom-client';

/** Event-name fragment for a free-text value: "New York" → "NEW_YORK". */
export function eventKey(value: string): string {
  return value.replace(/\s+/g, '_').toUpperCase();
}

/** Icon interactions that are tracked as an aggregate plus a per-city event. */
export type IconEvent = 'ICON_CLICK' | 'ICON_DOWNLOAD' | 'ICON_DOWNLOAD_PNG' | 'ICON_COPY' | 'ICON_SHARE';

/**
 * Fire the aggregate event (a queryable total) and its per-city breakdown,
 * e.g. ICON_DOWNLOAD + ICON_DOWNLOAD_NEW_YORK.
 */
export function trackIconEvent(event: IconEvent, city: string): void {
  trackEvent(event);
  trackEvent(`${event}_${eventKey(city)}`);
}
