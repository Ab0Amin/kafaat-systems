import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req });

    if (!token || token.role !== 'owner') {
      return NextResponse.json(
        { error: 'Unauthorized: Only owners can access this resource' },
        { status: 403 }
      );
    }

    const id = params.id;

    const response = await axios.post(`${API_URL}/owner/${id}/deactivate`, {}, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error deactivating tenant ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to deactivate tenant' },
      { status: 500 }
    );
  }
}