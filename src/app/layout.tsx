import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { GeistSans } from 'geist/font/sans';

export const metadata: Metadata = {
  title: 'City Icons Collection',
  description: 'Discover beautiful line art icons representing cities around the world.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="antialiased text-base">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
