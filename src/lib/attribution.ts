import { LICENSE_URL, STUDIO_NAME, STUDIO_URL } from '@/lib/site';

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]!);
}

export function iconAttribution(name: string, sourceUrl: string) {
  return {
    text: `${name} by ${STUDIO_NAME} — ${sourceUrl} — CC BY 4.0 (${LICENSE_URL})`,
    html: `<a href="${escapeHtml(sourceUrl)}">${escapeHtml(name)}</a> by <a href="${STUDIO_URL}">${STUDIO_NAME}</a>, licensed under <a href="${LICENSE_URL}">CC BY 4.0</a>`,
  };
}
