import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Crumb } from '@/lib/breadcrumbs';

interface BreadcrumbsProps {
  /** Steps after Home; the last one is the current page. */
  trail: Crumb[];
  className?: string;
}

/** Visible trail mirroring the page's BreadcrumbList JSON-LD (see breadcrumbList()). */
export function Breadcrumbs({ trail, className }: BreadcrumbsProps) {
  const parents = [{ name: 'Home', path: '/' }, ...trail.slice(0, -1)];
  const current = trail[trail.length - 1];

  return (
    <nav aria-label="Breadcrumb" className={cn('text-center mb-8', className)}>
      <ol className="inline-flex items-center text-sm text-muted-foreground list-none">
        {parents.map((crumb) => (
          <li key={crumb.path} className="flex items-center">
            <Link href={crumb.path} className="hover:text-foreground transition-colors">
              {crumb.name}
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
          </li>
        ))}
        <li aria-current="page">
          <span className="text-foreground font-medium">{current.name}</span>
        </li>
      </ol>
    </nav>
  );
}
