import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { extractSubdomainFromHost, getApiUrl } from '../../../routes';
import axios from 'axios';

const schema = z.object({
  token: z.string(),
});

export async function POST(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const subdomain = extractSubdomainFromHost(host);

  const apiUrl = getApiUrl(subdomain);

  const body = await req.json();

  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { token } = result.data;

  try {
    await axios.post(
      `${apiUrl}/auth/validate-reset-token`,
      { token },
      { headers: { 'Content-Type': 'application/json' } }
    );

    return true;
  } catch (error: unknown) {
    console.log(error);

    const message = error instanceof Error ? error.message : 'token is not valid';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
