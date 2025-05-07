import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import axios from 'axios';
import { getApiUrl } from '../../../routes';

const schema = 'owner';
const API_URL = getApiUrl(schema);
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token || token.role !== 'owner') {
      return NextResponse.json(
        { error: 'Unauthorized: Only owners can access this resource' },
        { status: 403 }
      );
    }

    // This is a mock implementation since the actual endpoint might not exist
    // In a real application, you would call the backend API to get the list of tenants
    const response = await axios.get(`${API_URL}/owner/tenants`, {
      headers: {
        Authorization: `Bearer ${token?.accessToken}`,
      },
    });
    console.log('response', response.data);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return NextResponse.json({ error: 'something went wrong' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token || token.role !== 'owner') {
      return NextResponse.json(
        { error: 'Unauthorized: Only owners can access this resource' },
        { status: 403 }
      );
    }

    const body = await req.json();

    const response = await axios.post(`${API_URL}/owner/register`, body, {
      headers: {
        Authorization: `Bearer ${token?.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error('Error creating tenant:', error);
    return NextResponse.json({
      error: 'Failed to create tenant',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}
