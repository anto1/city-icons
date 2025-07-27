'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto text-muted-foreground">
            <svg viewBox="0 0 120 120" fill="currentColor">
              <path d="M60 10C32.4 10 10 32.4 10 60s22.4 50 50 50 50-22.4 50-50S87.6 10 60 10zm0 80c-16.6 0-30-13.4-30-30s13.4-30 30-30 30 13.4 30 30-13.4 30-30 30z"/>
              <path d="M60 30c-16.6 0-30 13.4-30 30s13.4 30 30 30 30-13.4 30-30-13.4-30-30-30zm0 40c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z"/>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-foreground mb-4">
          404
        </h1>

        {/* Subtitle */}
        <h2 className="text-xl font-medium text-foreground mb-2">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist. Maybe you&apos;re looking for one of our city icons?
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Link>
          
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
          >
            <Search className="w-4 h-4 mr-2" />
            Browse Icons
          </Link>
        </div>

        {/* Back button */}
        <button 
          onClick={() => window.history.back()}
          className="inline-flex items-center mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Go Back
        </button>
      </div>
    </div>
  );
} 