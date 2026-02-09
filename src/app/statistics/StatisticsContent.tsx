'use client';

import { Globe, MapPin, Layers, Target } from 'lucide-react';
import Link from 'next/link';
import { slugify } from '@/lib/utils';

interface Stats {
  totalIcons: number;
  totalCountries: number;
  totalRegions: number;
  coveragePercentage: number;
  remainingCountries: number;
  countries: { country: string; count: number }[];
  regions: { region: string; count: number }[];
  categories: { category: string; count: number }[];
  topCountry: { country: string; count: number };
  topRegion: { region: string; count: number };
}

interface StatisticsContentProps {
  stats: Stats;
}

export function StatisticsContent({ stats }: StatisticsContentProps) {
  const maxCountryCount = stats.countries[0]?.count || 1;
  const maxRegionCount = stats.regions[0]?.count || 1;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Key Stats Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <MapPin className="w-8 h-8 text-orange-600 mx-auto mb-3" aria-hidden="true" />
          <div className="text-3xl font-bold text-foreground mb-1">{stats.totalIcons}</div>
          <div className="text-sm text-muted-foreground">City Icons</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <Globe className="w-8 h-8 text-orange-600 mx-auto mb-3" aria-hidden="true" />
          <div className="text-3xl font-bold text-foreground mb-1">{stats.totalCountries}</div>
          <div className="text-sm text-muted-foreground">Countries</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <Layers className="w-8 h-8 text-orange-600 mx-auto mb-3" aria-hidden="true" />
          <div className="text-3xl font-bold text-foreground mb-1">{stats.totalRegions}</div>
          <div className="text-sm text-muted-foreground">Regions</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <Target className="w-8 h-8 text-orange-600 mx-auto mb-3" aria-hidden="true" />
          <div className="text-3xl font-bold text-foreground mb-1">{stats.coveragePercentage}%</div>
          <div className="text-sm text-muted-foreground">World Coverage</div>
        </div>
      </section>

      {/* Coverage Progress */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-foreground mb-4">World Coverage</h2>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{stats.totalCountries} countries covered</span>
            <span>{stats.remainingCountries} remaining</span>
          </div>
          <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
              style={{ width: `${stats.coveragePercentage}%` }}
              role="progressbar"
              aria-valuenow={stats.coveragePercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="World country coverage"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Goal: Cover all 193 UN member countries with at least one city icon
          </p>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Icons by Region */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Icons by Region</h2>
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            {stats.regions.map((item) => (
              <div key={item.region}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground font-medium">{item.region}</span>
                  <span className="text-muted-foreground">{item.count} icons</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${(item.count / maxRegionCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Icons by Category */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Icons by Category</h2>
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            {stats.categories.map((item) => (
              <div key={item.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground font-medium">{item.category}</span>
                  <span className="text-muted-foreground">{item.count} icons</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${(item.count / stats.totalIcons) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Countries Table */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Icons by Country
          <span className="text-sm font-normal text-muted-foreground ml-2">
            (Top 20)
          </span>
        </h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Rank</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Country</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Icons</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground hidden sm:table-cell">Coverage</th>
                </tr>
              </thead>
              <tbody>
                {stats.countries.slice(0, 20).map((item, index) => (
                  <tr key={item.country} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-muted-foreground">{index + 1}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/${slugify(item.country)}`}
                        className="text-sm font-medium text-foreground hover:text-orange-600 transition-colors"
                      >
                        {item.country}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{item.count}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${(item.count / maxCountryCount) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {Math.round((item.count / stats.totalIcons) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {stats.countries.length > 20 && (
            <div className="px-4 py-3 text-center border-t border-border">
              <span className="text-sm text-muted-foreground">
                +{stats.countries.length - 20} more countries
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
