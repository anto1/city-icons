import { absoluteUrl, SITE_URL } from '@/lib/site';

/**
 * One step of a breadcrumb trail below Home. The same trail feeds the visible
 * <Breadcrumbs> nav and the BreadcrumbList JSON-LD, so the two cannot drift.
 */
export interface Crumb {
  name: string;
  /** Site path, e.g. "/spain". */
  path: string;
}

/** schema.org BreadcrumbList for Home followed by `trail`. */
export function breadcrumbList(trail: Crumb[]) {
  const entries = [
    { name: 'Home', item: SITE_URL },
    ...trail.map((crumb) => ({ name: crumb.name, item: absoluteUrl(crumb.path) })),
  ];
  return {
    '@type': 'BreadcrumbList',
    itemListElement: entries.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      ...entry,
    })),
  };
}
