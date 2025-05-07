import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import axios from 'axios';
import { getApiUrl } from '../../../routes';

const schema = 'owner';
const API_URL = getApiUrl(schema);
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    // if (!token || token.role !== 'owner') {
    //   return NextResponse.json(
    //     { error: 'Unauthorized: Only owners can access this resource' },
    //     { status: 403 }
    //   );
    // }

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

    // For demo purposes, return mock data if the API doesn't exist
    // return NextResponse.json({
    //   tenants: [
    //     {
    //       id: 1,
    //       name: 'Acme Corporation',
    //       domain: 'acme.com',
    //       schema_name: 'acme',
    //       isActive: true,
    //       plan: 'premium',
    //       maxUsers: 200,
    //       contactEmail: 'admin@acme.com',
    //       contactPhone: '123-456-7890',
    //       createdAt: '2025-01-01T00:00:00.000Z',
    //       updatedAt: '2025-01-01T00:00:00.000Z',
    //     },
    //     {
    //       id: 2,
    //       name: 'Globex Corporation',
    //       domain: 'globex.com',
    //       schema_name: 'globex',
    //       isActive: true,
    //       plan: 'starter',
    //       maxUsers: 50,
    //       contactEmail: 'admin@globex.com',
    //       contactPhone: '123-456-7891',
    //       createdAt: '2025-01-02T00:00:00.000Z',
    //       updatedAt: '2025-01-02T00:00:00.000Z',
    //     },
    //     {
    //       id: 3,
    //       name: 'Initech',
    //       domain: 'initech.com',
    //       schema_name: 'initech',
    //       isActive: false,
    //       plan: 'enterprise',
    //       maxUsers: 500,
    //       contactEmail: 'admin@initech.com',
    //       contactPhone: '123-456-7892',
    //       createdAt: '2025-01-03T00:00:00.000Z',
    //       updatedAt: '2025-01-03T00:00:00.000Z',
    //     },
    //   ],
    // });
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
  } catch (error: any) {
    console.error('Error creating tenant:', error);
    return NextResponse.json(
      {
        error: 'Failed to create tenant',
        details: error.response?.data?.message || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
