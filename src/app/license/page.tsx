import { Metadata } from 'next';
import { LicenseContent } from './LicenseContent';
import { ContentPage } from '@/components/ContentPage';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbList } from '@/lib/breadcrumbs';
import { pageMetadata } from '@/lib/metadata';
import { absoluteUrl, LICENSE_URL, STUDIO_ORG } from '@/lib/site';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

const path = '/license';

// SEO metadata for license page
export const metadata: Metadata = pageMetadata({
  path,
  title: 'Icon Usage & Licensing',
  description: 'City Icons are free for any use, including commercial. Icons are licensed under CC BY 4.0 (attribution required); the site code is MIT.',
  keywords: 'city icons license, icon usage, free icons license, CC BY 4.0, MIT license, commercial use, SVG icons terms',
  og: {
    title: 'Icon Usage & Licensing | City Icons',
    description: 'City Icons are free for any use, including commercial. Licensed under CC BY 4.0 — attribution required.',
  },
  imageAlt: 'City Icons License and Usage Guidelines',
});

// Generate structured data for license page
function generateStructuredData() {
  return {
    '@type': 'WebPage',
    name: 'Icon Usage & Licensing',
    description: 'Clear guidelines for using City Icons in your projects.',
    url: absoluteUrl(path),
    author: STUDIO_ORG,
    mainEntity: {
      '@type': 'CreativeWork',
      name: 'City Icons License',
      description: 'Icons are licensed under Creative Commons Attribution 4.0 (CC BY 4.0): free for any use, including commercial, with attribution. The site source code is MIT-licensed.',
      license: LICENSE_URL,
      creator: STUDIO_ORG,
    },
    breadcrumb: breadcrumbList([{ name: 'License', path }]),
  };
}

export default function LicensePage() {
  return (
    <>
      <JsonLd data={generateStructuredData()} />
      <ContentPage
        crumb="License"
        path={path}
        title="Icon Usage & Licensing"
        intro="Free for any use, including commercial — just give credit"
        headerClassName="mb-8"
      >
        <LicenseContent />
      </ContentPage>
    </>
  );
}
