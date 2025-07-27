import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: "City Icons Collection - SVG Line Art Icons",
  description: "Discover beautiful line art icons representing cities around the world. Search, preview, and download SVG icons for your projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased text-base">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
