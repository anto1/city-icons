'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { ChangelogEntry } from '@/data/changelog';
import { Icon } from '@/types';
import { getIconUrl, getIconSvgUrl } from '@/lib/utils';

interface WhatsNewContentProps {
  changelog: ChangelogEntry[];
  allIcons: Icon[];
}

export function WhatsNewContent({ changelog, allIcons }: WhatsNewContentProps) {
  // Helper to find icon by city name
  const findIconByCity = (cityName: string): Icon | undefined => {
    return allIcons.find(
      (icon) => icon.city.toLowerCase() === cityName.toLowerCase()
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-12">
        {changelog.map((entry, index) => (
          <article
            key={entry.week}
            className={`${index !== 0 ? 'border-t border-border pt-12' : ''}`}
          >
            <header className="flex items-center gap-3 mb-6">
              <Calendar className="w-5 h-5 text-orange-600" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {entry.date}
                </h2>
                {entry.description && (
                  <p className="text-sm text-muted-foreground">
                    {entry.description}
                  </p>
                )}
              </div>
              <span className="ml-auto px-3 py-1 bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-sm font-medium rounded-full">
                +{entry.cities.length} cities
              </span>
            </header>

            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 list-none">
              {entry.cities.map((cityName) => {
                const icon = findIconByCity(cityName);

                if (!icon) {
                  // City not found in data - show placeholder
                  return (
                    <li
                      key={cityName}
                      className="p-4 rounded-xl border border-border bg-card flex flex-col items-center justify-center text-center"
                      style={{ aspectRatio: '1 / 1' }}
                    >
                      <div className="w-12 h-12 bg-muted rounded-lg mb-3 flex items-center justify-center">
                        <span className="text-2xl text-muted-foreground">?</span>
                      </div>
                      <span className="text-sm font-medium text-foreground truncate w-full">
                        {cityName}
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={icon._id}>
                    <Link
                      href={getIconUrl(icon)}
                      className="group p-4 rounded-xl border border-border bg-card hover:border-orange-300 dark:hover:border-orange-700 transition-colors flex flex-col items-center justify-center text-center"
                      style={{ aspectRatio: '1 / 1' }}
                    >
                      <div className="w-12 h-12 mb-3 flex items-center justify-center">
                        <Image
                          src={getIconSvgUrl(icon)}
                          alt={`${icon.name} - ${icon.city}, ${icon.country}`}
                          width={48}
                          height={48}
                          className="w-12 h-12 opacity-70 group-hover:opacity-100 transition-opacity dark:invert"
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground truncate w-full">
                        {icon.city}
                      </span>
                      <span className="text-xs text-muted-foreground truncate w-full">
                        {icon.country}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
