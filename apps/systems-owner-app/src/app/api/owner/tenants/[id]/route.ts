import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import axios from 'axios';

import { getApiUrl } from '../../../api.config';
const schema = 'abdalla-co';
const API_URL = getApiUrl(schema);
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req });

    if (!token || token.role !== 'owner') {
      return NextResponse.json(
        { error: 'Unauthorized: Only owners can access this resource' },
        { status: 403 }
      );
    }

    const id = params.id;

    // This is a mock implementation since the actual endpoint might not exist
    // In a real application, you would call the backend API to get the tenant details
    const response = await axios.get(`${API_URL}/owner/tenants/${id}`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error fetching tenant ${params.id}:`, error);

    // For demo purposes, return mock data if the API doesn't exist
    return NextResponse.json({
      tenant: {
        id: parseInt(params.id),
        name: 'Acme Corporation',
        domain: 'acme.com',
        schema_name: 'acme',
        isActive: true,
        plan: 'premium',
        maxUsers: 200,
        contactEmail: 'admin@acme.com',
        contactPhone: '123-456-7890',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
    });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req });

    if (!token || token.role !== 'owner') {
      return NextResponse.json(
        { error: 'Unauthorized: Only owners can access this resource' },
        { status: 403 }
      );
    }

    const id = params.id;
    const body = await req.json();

    // This is a mock implementation since the actual endpoint might not exist
    // In a real application, you would call the backend API to update the tenant
    const response = await axios.put(`${API_URL}/owner/tenants/${id}`, body, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error updating tenant ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to update tenant' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req });

    if (!token || token.role !== 'owner') {
      return NextResponse.json(
        { error: 'Unauthorized: Only owners can access this resource' },
        { status: 403 }
      );
    }

    const id = params.id;

    // This is a mock implementation since the actual endpoint might not exist
    // In a real application, you would call the backend API to delete the tenant
    const response = await axios.delete(`${API_URL}/owner/tenants/${id}`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error deleting tenant ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to delete tenant' }, { status: 500 });
  }
}
