import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import iconData, { getCountryCounts } from '@/data';
import { PageHeader } from '@/components/PageHeader';
import { IconFooter } from '@/components/IconFooter';
import { PressDownload } from '@/components/PressDownload';

export const dynamic = 'force-static';
const title = 'SVG Cities — Press Kit';
const description = 'Facts, preview artwork and downloadable assets for covering SVG Cities, the city icon collection by Studio Partdirector.';
export const metadata: Metadata = {
  title, description,
  alternates: { canonical: 'https://svgcities.com/press' },
  openGraph: { title, description, url: 'https://svgcities.com/press', type: 'website',
    images: [{ url: 'https://svgcities.com/press/svgcities-cover.png', width: 1600, height: 1000, alt: 'Twelve city icons by Studio Partdirector' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['https://svgcities.com/press/svgcities-cover.png'] },
};

export default function PressPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
          <Link href="/" className="underline">Home</Link> / Press kit
        </nav>
        <header className="mb-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">A world of city icons.</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-6">
            SVG Cities is a collection of {iconData.length} line art city icons by Studio Partdirector.
            Explore the world, find a familiar landmark, and take it into your next design.
          </p>
          <PressDownload />
          <p className="text-sm text-muted-foreground mt-3">ZIP: preview artwork, 12 original SVGs, project facts and a vector sheet for Figma import.</p>
        </header>
        <Image src="/press/svgcities-cover.png?v=2" alt="A selection of city icons, including Paris, London, Lisbon, Porto, Rome and Athens" width={1600} height={1000} className="w-full h-auto rounded-lg mb-12" priority />
        <section className="grid md:grid-cols-2 gap-10 mb-12" aria-labelledby="facts-heading">
          <div>
            <h2 id="facts-heading" className="text-2xl font-semibold mb-4">At a glance</h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
              <dt>Collection</dt><dd>{iconData.length} icons</dd>
              <dt>Coverage</dt><dd>{getCountryCounts().length} countries and territories</dd>
              <dt>Formats</dt><dd>SVG and 512×512 PNG export</dd>
              <dt>Artwork</dt><dd><Link href="/license" className="underline">CC BY 4.0 · attribution required</Link></dd>
              <dt>Creator</dt><dd><a href="https://partdirector.ch" className="underline">Studio Partdirector</a></dd>
              <dt>Contact</dt><dd><a href="mailto:icons@partdirector.ch" className="underline">icons@partdirector.ch</a></dd>
            </dl>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">What you can do</h2>
            <p className="text-muted-foreground leading-relaxed">
              Search for a city, browse by region or country, explore the <Link href="/map" className="underline">world map</Link>,
              or try <Link href="/roulette" className="underline">City Roulette</Link>.
              Download SVG or PNG, copy SVG markup, or get the complete SVG collection.
            </p>
          </div>
        </section>
        <section className="mb-12 max-w-3xl" aria-labelledby="description-heading">
          <h2 id="description-heading" className="text-2xl font-semibold mb-4">About the project</h2>
          <p className="text-muted-foreground leading-relaxed">
            SVG Cities brings landmarks and local symbols into a consistent line art collection.
            Created by Studio Partdirector, it contains {iconData.length} icons from {getCountryCounts().length} countries and territories.
            The website combines a searchable catalogue with a world map and a playful city roulette.
            The icons are available under Creative Commons Attribution 4.0: credit the creator, link to the license and indicate changes.
          </p>
        </section>
        <section className="mb-12 max-w-3xl" aria-labelledby="community-heading">
          <h2 id="community-heading" className="text-2xl font-semibold mb-4">Shaped by local perspectives</h2>
          <p className="text-muted-foreground leading-relaxed">
            An earlier version of the collection was shared on r/Cities with an invitation:
            {' '}“Made 200+ minimalist city icons. Roast my choices.” Readers debated which symbols
            best represented their cities and suggested places to add. The creator’s update
            credits that feedback with new additions, including Albuquerque, New Orleans,
            San Francisco and both Córdobas, in Argentina and Spain.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            The post reached approximately 90,000 views, with 290 upvotes, 188 comments
            and a 98% upvote ratio, according to the creator’s Reddit Post Insights screenshot.
            These figures reflect the snapshot provided on 18 October 2026, not live counters.
          </p>
          <a href="https://www.reddit.com/r/Cities/comments/1p80aee/made_200_minimalist_city_icons_roast_my_choices/"
            target="_blank" rel="noopener noreferrer" className="inline-block mt-4 underline">
            Read the original discussion on Reddit
          </a>
        </section>
        <section className="border-t border-border pt-8" aria-labelledby="assets-heading">
          <h2 id="assets-heading" className="text-2xl font-semibold mb-4">Individual assets</h2>
          <ul className="space-y-3 underline">
            <li><a href="/press/svgcities-cover.png" download>Cover image · PNG, 1600×1000</a></li>
            <li><a href="/press/svgcities-cover.svg" download>Editable cover · SVG</a></li>
            <li><a href="/press/svgcities-figma-import.svg" download>All icons · labelled SVG sheet for Figma import</a></li>
            <li><a href="/press/facts.json" download>Project facts · JSON</a></li>
          </ul>
          <p className="text-sm text-muted-foreground mt-6">Credit: City icons by Studio Partdirector / svgcities.com / CC BY 4.0. Mention any edits you make. The import sheet is editable SVG, not a native Figma component library.</p>
        </section>
      </main>
      <IconFooter countries={getCountryCounts()} totalIcons={iconData.length} />
    </div>
  );
}
