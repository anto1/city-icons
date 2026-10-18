function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]!);
}

export function iconAttribution(name: string, sourceUrl: string) {
  const license = 'https://creativecommons.org/licenses/by/4.0/';
  return {
    text: `${name} by Studio Partdirector — ${sourceUrl} — CC BY 4.0 (${license})`,
    html: `<a href="${escapeHtml(sourceUrl)}">${escapeHtml(name)}</a> by <a href="https://partdirector.ch">Studio Partdirector</a>, licensed under <a href="${license}">CC BY 4.0</a>`,
  };
}
