import { Metadata } from 'next';
import { changelog, getRecentCityCount } from '@/data/changelog';
import { WhatsNewContent } from './WhatsNewContent';
import iconData from '@/data';
import { toGridIcon } from '@/types';
import { ContentPage } from '@/components/ContentPage';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbList } from '@/lib/breadcrumbs';
import { pageMetadata } from '@/lib/metadata';
import { absoluteUrl, STUDIO_ORG } from '@/lib/site';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

const path = '/whats-new';

export const metadata: Metadata = pageMetadata({
  path,
  title: "What's New — Latest City Icons",
  description: 'See the latest city icons added to our collection. Weekly updates with new cities and landmarks from around the world.',
  keywords: 'new city icons, latest icons, icon updates, new svg icons, city icons changelog',
  og: { description: 'See the latest city icons added to our collection.' },
  imageAlt: "What's New - City Icons",
});

function generateStructuredData() {
  return {
    '@type': 'WebPage',
    name: "What's New - City Icons",
    description: 'Latest city icons added to the collection',
    url: absoluteUrl(path),
    author: STUDIO_ORG,
    breadcrumb: breadcrumbList([{ name: "What's New", path }]),
  };
}

export default function WhatsNewPage() {
  const recentCount = getRecentCityCount(4);
  const latestCount = changelog.length > 0 ? changelog[0].cities.length : 0;

  return (
    <>
      <JsonLd data={generateStructuredData()} />
      <ContentPage
        crumb="What's New"
        path={path}
        title="What's New"
        intro={
          recentCount > 0
            ? `${recentCount} new cities added in the last 4 weeks`
            : `${latestCount} new cities in the latest update`
        }
      >
        <WhatsNewContent changelog={changelog} allIcons={iconData.map(toGridIcon)} />
      </ContentPage>
    </>
  );
}
