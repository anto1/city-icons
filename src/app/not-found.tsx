'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowLeft } from 'lucide-react';
import iconData from '@/data';

export default function NotFound() {
  // Get a random icon
  const randomIcon = iconData[Math.floor(Math.random() * iconData.length)];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <article className="text-center max-w-md mx-auto">
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
                alt=""
                width={64}
                height={64}
                className="w-full h-full"
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

      {/* Footer */}
      <footer className="py-6 mt-16" role="contentinfo">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-foreground">
            © Studio Partdirector, 2025
          </p>
        </div>
      </footer>
    </div>
  );
} 