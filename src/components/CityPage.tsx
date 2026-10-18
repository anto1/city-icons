import Image from 'next/image';
import Link from 'next/link';
import { CountryCount, GridIcon, Icon, toGridIcon } from '@/types';
import { Button } from '@/components/ui/button';
import { getIconSvgUrl, slugify, getCitySlug, getLandmark } from '@/lib/utils';
import { ICON_GRID_CLASS, PNG_SIZE } from '@/lib/constants';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { IconActions } from '@/components/IconActions';
import { IconCard } from '@/components/IconCard';
import { IconFooter } from '@/components/IconFooter';
import { RandomIconHeader } from '@/components/RandomIconHeader';

interface CityPageProps {
  icon: Icon;
  /** First three icons of the sorted collection excluding the current one. */
  headerIcons: GridIcon[];
  /** All other icons from the same country. */
  relatedIcons: GridIcon[];
  /** Deterministic picks from other countries ("Explore More Cities"). */
  exploreIcons: GridIcon[];
  /** Precomputed {country, count} pairs for the footer. */
  footerCountries: CountryCount[];
  /** Total number of icons in the collection (footer credit line). */
  totalIcons: number;
  /** Month this icon was added, from the changelog. */
  addedOn?: { iso: string; label: string };
}

/**
 * City page layout. A server component: only the download/copy/share buttons
 * (IconActions) hydrate, so the description and symbol story are rendered once
 * as HTML instead of also travelling in the client payload.
 */
export default function CityPage({
  icon,
  headerIcons,
  relatedIcons,
  exploreIcons,
  footerCountries,
  totalIcons,
  addedOn,
}: CityPageProps) {
  const countrySlug = slugify(icon.country);
  const countryPath = `/${countrySlug}`;
  const citySlug = getCitySlug(icon);

  return (
    <div className="min-h-screen bg-background">
      <RandomIconHeader icons={headerIcons} />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs
          trail={[
            { name: icon.country, path: countryPath },
            { name: icon.city, path: `${countryPath}/${citySlug}` },
          ]}
        />

        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
            {icon.name}
          </h1>
        </header>

        <IconActions icon={toGridIcon(icon)}>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-16 mb-8 w-full max-w-md aspect-square flex items-center justify-center">
            <Image
              src={getIconSvgUrl(icon)}
              alt={`${icon.name} - ${icon.city}, ${icon.country}`}
              width={128}
              height={128}
              className="w-32 h-32 dark:invert"
              priority
            />
          </div>
        </IconActions>

        <section className="text-center max-w-2xl mx-auto mb-12" aria-labelledby="about-heading">
          <h2 id="about-heading" className="text-2xl font-bold mb-4">
            About the {getLandmark(icon)}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {icon.description}
          </p>
          {icon.symbolStory && (
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              {icon.symbolStory}
            </p>
          )}
          {icon.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {icon.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Icon details — everything about the file itself, in one block that
            also gives the page the words its title promises (SVG, download,
            licence) alongside the landmark prose above. */}
        <section className="max-w-2xl mx-auto mb-12" aria-labelledby="details-heading">
          <h2 id="details-heading" className="text-2xl font-bold text-center mb-6">
            Icon details
          </h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
            <dt className="text-muted-foreground">Symbol</dt>
            <dd>{icon.name}</dd>

            <dt className="text-muted-foreground">City</dt>
            <dd>
              <Link href={countryPath} className="underline underline-offset-4 hover:no-underline">
                {icon.city}, {icon.country}
              </Link>
            </dd>

            <dt className="text-muted-foreground">Region</dt>
            <dd>{icon.region}</dd>

            <dt className="text-muted-foreground">Category</dt>
            <dd>{icon.category}</dd>

            <dt className="text-muted-foreground">Format</dt>
            <dd>SVG (scalable vector), plus PNG export at {PNG_SIZE}px</dd>

            <dt className="text-muted-foreground">File</dt>
            <dd><code className="text-xs">{icon.svgFilename}</code></dd>

            <dt className="text-muted-foreground">Licence</dt>
            <dd>
              <Link href="/license" className="underline underline-offset-4 hover:no-underline">
                CC BY 4.0
              </Link>{' '}
              — free for commercial use with attribution
            </dd>

            {addedOn && (
              <>
                <dt className="text-muted-foreground">Added</dt>
                <dd><time dateTime={addedOn.iso}>{addedOn.label}</time></dd>
              </>
            )}
          </dl>

          <div className="mt-6 rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground mb-2">Attribution — copy this when you use the icon:</p>
            <p className="text-sm">
              {icon.name} icon by Studio Partdirector, svgcities.com/{countrySlug}/{citySlug}, CC BY 4.0
            </p>
          </div>
        </section>

        {relatedIcons.length > 0 && (
          <section className="mt-20" aria-labelledby="related-icons-heading">
            <h2 id="related-icons-heading" className="text-2xl font-bold text-center mb-8">{relatedIcons.length} more from {icon.country}</h2>
            <ul className={ICON_GRID_CLASS} aria-label={`More icons from ${icon.country}`}>
              {relatedIcons.map((relatedIcon) => (
                <li key={relatedIcon._id}>
                  <IconCard icon={relatedIcon} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {exploreIcons.length > 0 && (
          <section className="mt-20" aria-labelledby="explore-more-heading">
            <h2 id="explore-more-heading" className="text-2xl font-bold text-center mb-8">Explore More Cities</h2>
            <ul className={ICON_GRID_CLASS} aria-label="Explore more cities">
              {exploreIcons.map((exploreIcon) => (
                <li key={exploreIcon._id}>
                  <IconCard icon={exploreIcon} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav className="mt-20 text-center" aria-label="Navigation">
          <Button asChild variant="outline" size="lg">
            <Link href="/">View All City Icons</Link>
          </Button>
        </nav>
      </main>

      <IconFooter countries={footerCountries} totalIcons={totalIcons} />
    </div>
  );
}
