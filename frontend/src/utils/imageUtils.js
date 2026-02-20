const API_BASE = 'http://localhost:3000';
export function resolverImagemUrl(imagemUrl) {
  if (!imagemUrl) return null;
  if (imagemUrl.startsWith('http')) return imagemUrl;
  return `${API_BASE}${imagemUrl}`;
}