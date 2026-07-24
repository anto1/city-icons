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

  // Build-time only: dynamicParams=false + generateStaticParams ensures this
  // only runs at build. Switch to async fs if ISR/on-demand OG is ever enabled.
  // Embed the whole SVG as a data URI so per-path fills (white knock-out
  // holes), strokes, and non-standard viewBoxes are preserved as-is.
  const svgPath = join(process.cwd(), 'public', 'icons', icon.svgFilename);
  const iconSize = 240;
  let iconSrc = '';
  let iconWidth = iconSize;
  let iconHeight = iconSize;
  try {
    const svgContent = readFileSync(svgPath, 'utf-8');
    // Size the image from the SVG's own viewBox to keep its aspect ratio
    const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
    if (viewBoxMatch) {
      const [, , vbWidth, vbHeight] = viewBoxMatch[1].trim().split(/\s+/).map(Number);
      if (vbWidth > 0 && vbHeight > 0) {
        const scale = iconSize / Math.max(vbWidth, vbHeight);
        iconWidth = Math.round(vbWidth * scale);
        iconHeight = Math.round(vbHeight * scale);
      }
    }
    iconSrc = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;
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
        {/* Icon (black-on-transparent SVG on the light card background) */}
        {iconSrc && (
          <img
            src={iconSrc}
            width={iconWidth}
            height={iconHeight}
            alt=""
            style={{ marginBottom: '40px' }}
          />
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
          svgcities.com
        </div>
      </div>
    ),
    { ...size }
  );
}
