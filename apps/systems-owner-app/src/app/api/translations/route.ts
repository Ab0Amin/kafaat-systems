import initTranslations from 'src/locales/i18n';

export async function GET(request: Request) {
  const data = await initTranslations();
  return new Response(JSON.stringify(data));
}
