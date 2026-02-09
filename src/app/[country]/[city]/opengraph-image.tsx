import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';
import iconData from '@/data';
import { findIconBySlugs, slugify } from '@/lib/utils';

export const alt = 'City Icon';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  return iconData.map((icon) => ({
    country: slugify(icon.country),
    city: slugify(icon.city),
  }));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ country: string; city: string }>;
}) {
  const { country, city } = await params;
  const icon = findIconBySlugs(country, city, iconData);

  if (!icon) {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            fontSize: 48,
            color: '#333',
          }}
        >
          City Icons Collection
        </div>
      ),
      { ...size }
    );
  }

  // Read the SVG file and extract path data
  const svgPath = join(process.cwd(), 'public', 'icons', icon.svgFilename);
  let pathData = '';
  try {
    const svgContent = readFileSync(svgPath, 'utf-8');
    // Extract all path d attributes
    const pathMatches = svgContent.match(/d="([^"]+)"/g);
    if (pathMatches) {
      pathData = pathMatches.map(m => m.slice(3, -1)).join(' ');
    }
  } catch {
    // If SVG can't be read, fall back to text-only
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          padding: '60px',
        }}
      >
        {/* Icon */}
        {pathData && (
          <svg
            width="240"
            height="240"
            viewBox="0 0 120 120"
            fill="none"
            style={{ marginBottom: '40px' }}
          >
            <path d={pathData} fill="#000000" />
          </svg>
        )}

        {/* City name */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: '#111111',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          {icon.city}
        </div>

        {/* Country name */}
        <div
          style={{
            fontSize: 32,
            color: '#666666',
            marginTop: '12px',
          }}
        >
          {icon.country}
        </div>

        {/* Branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            bottom: '40px',
            fontSize: 20,
            color: '#999999',
          }}
        >
          cities.partdirector.ch
        </div>
      </div>
    ),
    { ...size }
  );
}
