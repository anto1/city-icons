import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { IconFooter } from '@/components/IconFooter';
import { PageHeader } from '@/components/PageHeader';
import { cn } from '@/lib/utils';
import iconData, { getCountryCounts } from '@/data';

interface ContentPageProps {
  /** Breadcrumb label for this page; the trail is Home / {crumb}. */
  crumb: string;
  path: string;
  title: ReactNode;
  intro: ReactNode;
  /** Header spacing; defaults to mb-12. */
  headerClassName?: string;
  titleClassName?: string;
  children: ReactNode;
}

/**
 * Shared shell of the text/data pages (FAQ, statistics, what's new, license,
 * map): header controls, breadcrumb, centered title + intro, <main>, footer.
 */
export function ContentPage({
  crumb,
  path,
  title,
  intro,
  headerClassName = 'mb-12',
  titleClassName,
  children,
}: ContentPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs trail={[{ name: crumb, path }]} className="pt-8" />

        <header className={cn('text-center', headerClassName)}>
          <h1 className={cn('text-4xl font-bold text-foreground mb-4', titleClassName)}>{title}</h1>
          <p className="text-lg text-muted-foreground">{intro}</p>
        </header>

        <main>{children}</main>
      </div>
      <IconFooter countries={getCountryCounts()} totalIcons={iconData.length} />
    </div>
  );
}
