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

    const response = await axios.get(`${API_URL}/owner/stats`, {
      headers: {
        Authorization: `Bearer ${token?.accessToken}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching tenant stats:', error);
    return NextResponse.json({ error: 'Failed to fetch tenant statistics' }, { status: 500 });
  }
}
