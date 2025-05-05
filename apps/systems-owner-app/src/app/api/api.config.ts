export function getSchema(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    return parts.length > 1 ? parts[0] : 'default';
  }
  return '';
}

export function getApiUrl(schema: string = getSchema()): string {
  return `http://${schema}.${process.env.BE_HOST}:${process.env.BE_PORT}/api`;
}
