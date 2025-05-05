export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const NEXT_URL = process.env.NEXT_PUBLIC_NEXT_URL || 'http://localhost:3000';
export const TRANSLATIONS_API_URL = (entity: string) =>
  `https://api.i18nexus.com/project_resources/${entity}.json?api_key=${process.env.TRANSLATIONS_API_KEY}`;
export const ASSETS_API = process.env.NEXT_PUBLIC_ASSETS_API;
