'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowLeft } from 'lucide-react';
import iconData from '@/data';
import { PageHeader } from '@/components/PageHeader';
import { IconFooter } from '@/components/IconFooter';

export default function NotFound() {
  // Use a fixed icon to avoid hydration mismatch (Math.random() differs server vs client)
  const randomIcon = iconData[0];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <main className="container mx-auto px-4 py-8">
        <article className="text-center max-w-md mx-auto pt-8">
          {/* Navigation */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Back to Icons
            </Link>
          </nav>

          {/* Random Icon */}
          <div className="flex justify-center mb-12">
            <div className="w-16 h-16 text-muted-foreground">
              <Image
                src={`/icons/${randomIcon.svgFilename}`}
                alt={`${randomIcon.name} - ${randomIcon.city}, ${randomIcon.country}`}
                width={64}
                height={64}
                className="w-full h-full dark:invert"
              />
            </div>
          </div>

          <header>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              404 - Page Not Found
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              The page you&apos;re looking for doesn&apos;t exist. Maybe you&apos;re looking for one of our city icons?
            </p>
          </header>

          {/* Navigation Action */}
          <nav aria-label="Page actions" className="flex justify-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
            >
              <Search className="w-4 h-4 mr-2" aria-hidden="true" />
              Browse Icons
            </Link>
          </nav>
        </article>
      </main>

      <IconFooter icons={iconData} />
    </div>
  );
} 