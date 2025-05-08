import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { extractSubdomainFromHost, getApiUrl, getSchema } from '../../../routes';
import axios from 'axios';

const schema = z.object({
  token: z.string(),
  password: z.string().min(8),
  confirmPassword: z.string(),
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

  const { token, password, confirmPassword } = result.data;

  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
  }

  try {
    const response = await axios.post(
      `${apiUrl}/auth/set-password`,
      { token, password, confirmPassword },
      { headers: { 'Content-Type': 'application/json' } }
    );

    return NextResponse.json({ message: 'Password set successfully' });
  } catch (error: unknown) {
    console.log(error);

    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
