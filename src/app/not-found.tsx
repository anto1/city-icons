'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowLeft } from 'lucide-react';
import iconData from '@/data/icons.json';

export default function NotFound() {
  // Get a random icon
  const randomIcon = iconData[Math.floor(Math.random() * iconData.length)];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Icons
            </Link>
            
            {/* Random Icon */}
            <div className="flex justify-center mb-12">
              <div className="w-16 h-16 text-muted-foreground">
                <Image 
                  src={`/icons/${randomIcon.svgFilename}`}
                  alt={`${randomIcon.city} icon`}
                  width={64}
                  height={64}
                  className="w-full h-full"
                />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-foreground mb-4">
              404
            </h1>
            <h2 className="text-xl font-medium text-foreground mb-2">
              Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist. Maybe you&apos;re looking for one of our city icons?
            </p>
          </div>

          {/* Single Action Button */}
          <div className="flex justify-center mb-8">
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
            >
              <Search className="w-4 h-4 mr-2" />
              Browse Icons
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-6 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-foreground">
              © Studio Partdirector, 2025
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
} 