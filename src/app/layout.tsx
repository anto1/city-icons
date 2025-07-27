import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import '@fontsource/instrument-sans';

export const metadata: Metadata = {
  title: 'City Icons Collection',
  description: 'Discover beautiful line art icons representing cities around the world by Studio Partdirector. Browse 47 cities with search, download, and copy functionality.',
  keywords: ['city icons', 'svg icons', 'line art', 'cities', 'design', 'Studio Partdirector'],
  authors: [{ name: 'Studio Partdirector' }],
  creator: 'Studio Partdirector',
  publisher: 'Studio Partdirector',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://city-icons-j2unwlzqm-anto2s-projects.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'City Icons Collection',
    description: 'Discover beautiful line art icons representing cities around the world by Studio Partdirector. Browse 47 cities with search, download, and copy functionality.',
    url: 'https://city-icons-j2unwlzqm-anto2s-projects.vercel.app',
    siteName: 'City Icons Collection',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'City Icons Collection - Beautiful line art icons representing cities around the world',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'City Icons Collection',
    description: 'Discover beautiful line art icons representing cities around the world by Studio Partdirector.',
    images: ['/og-image.png'],
    creator: '@partdirector',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-instrument-sans">
      <body className="antialiased text-base">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
