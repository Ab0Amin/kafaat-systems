import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import axios from 'axios';
import { getApiUrl } from '../../../../../routes';

const schema = 'owner';
const API_URL = getApiUrl(schema);

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const token = await getToken({ req });
  const id = context.params.id;

  if (!token || token.role !== 'owner') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const response = await axios.delete(`${API_URL}/owner/tenants/${id}/delete`, {
      headers: { Authorization: `Bearer ${token.accessToken}` },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error(`Error deleting tenant ${id}:`, error);
    return NextResponse.json({ error: 'Failed to delete tenant' }, { status: 500 });
  }
}
