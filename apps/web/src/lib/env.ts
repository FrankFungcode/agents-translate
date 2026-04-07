export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!raw) {
    return '';
  }
  return raw.endsWith('/') ? raw.slice(0, -1) : raw;
}
