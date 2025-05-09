import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import axios from 'axios';
import { getApiUrl } from '../../../../../routes';

const schema = 'owner';
const API_URL = getApiUrl(schema);

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const token = await getToken({ req });
    console.log('id:', id);

    if (!token || token.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const response = await axios.put(
      `${API_URL}/owner/tenants/${id}/deactivate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error deactivating tenant ${id}:`, error);
    return NextResponse.json({ error: 'Failed to deactivate tenant' }, { status: 500 });
  }
}
