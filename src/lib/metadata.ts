import type { Metadata } from 'next';
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/site';

/** Appended to every page <title> by the root layout's title template. */
export const TITLE_SUFFIX = ' | svgcities';

// Google renders about 60 characters of a title, and the suffix eats into it.
const TITLE_BUDGET = 60 - TITLE_SUFFIX.length;

/**
 * First candidate that fits the title budget, else the last (shortest) one.
 * Pass candidates longest-first so long landmark or country names fall back
 * to shorter forms instead of getting truncated mid-word in results.
 */
export function fitTitle(candidates: string[]): string {
  return candidates.find((c) => c.length <= TITLE_BUDGET) ?? candidates[candidates.length - 1];
}

/**
 * Explicit index/follow robots for content pages. The root layout deliberately
 * leaves index/follow implicit (an explicit "index" there would fight Next's
 * automatic noindex on the 404 page), so pages that want it state it.
 */
export function indexRobots(index = true): Metadata['robots'] {
  return {
    index,
    follow: true,
    googleBot: {
      index,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}

interface SocialImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

interface PageMetadataOptions {
  /** Site path for canonical and og:url, e.g. "/faq". */
  path: string;
  title: string;
  description: string;
  keywords?: string;
  /** Social copy when it should differ from the <title>/description. */
  og?: { title?: string; description?: string };
  /** Twitter copy; defaults to the Open Graph copy. */
  twitter?: { title?: string; description?: string };
  ogType?: 'website' | 'article';
  /**
   * Social preview. Defaults to the site og-image with this alt text; pass
   * null when a file-based opengraph-image route supplies it instead.
   */
  image?: SocialImage | null;
  imageAlt?: string;
  robots?: Metadata['robots'];
}

/**
 * Per-page metadata. authors/creator/publisher, formatDetection and
 * metadataBase are inherited from the root layout; openGraph and twitter are
 * not deep-merged by Next, so they are always restated in full here.
 */
export function pageMetadata({
  path,
  title,
  description,
  keywords,
  og,
  twitter,
  ogType = 'website',
  image,
  imageAlt,
  robots,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const socialImage =
    image === null ? null : (image ?? { ...DEFAULT_OG_IMAGE, alt: imageAlt ?? title });
  const ogTitle = og?.title ?? title;
  const ogDescription = og?.description ?? description;

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url,
      siteName: SITE_NAME,
      locale: 'en_US',
      type: ogType,
      ...(socialImage ? { images: [socialImage] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: twitter?.title ?? ogTitle,
      description: twitter?.description ?? ogDescription,
      ...(socialImage ? { images: [socialImage.url] } : {}),
    },
    ...(robots ? { robots } : {}),
  };
}
