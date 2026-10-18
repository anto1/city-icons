// Browser-only helpers for the city page's download and copy actions.

/** Save a blob under `filename` via a temporary object-URL link. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Fetch an icon's SVG markup, rejecting error responses and non-SVG bodies. */
export async function fetchSvg(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`SVG request failed: ${response.status}`);
  const content = await response.text();
  if (!/<svg[\s>]/i.test(content)) throw new Error('Response is not an SVG');
  return content;
}

/** Rasterise SVG markup to a square, transparent PNG of `size` pixels. */
export async function svgToPng(svgMarkup: string, size: number): Promise<Blob> {
  // Force black artwork (icons use `currentColor` fills — an <img>-loaded
  // SVG resolves that to black, but be explicit) and an exact raster size
  // so the canvas renders crisply at the target resolution.
  const svg = svgMarkup
    .replace(/currentColor/g, '#000000')
    .replace(
      /<svg([^>]*)>/,
      (_match, attrs: string) =>
        `<svg${attrs.replace(/\s(?:width|height)="[^"]*"/g, '')} width="${size}" height="${size}">`
    );
  const svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));

  try {
    const image = new window.Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Failed to render SVG'));
      image.src = svgUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D context unavailable');
    context.drawImage(image, 0, 0, size, size);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('PNG encoding failed'))),
        'image/png'
      );
    });
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}
