import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/app/lib/backend-client';

export async function GET() {
    const result = await backend.get('/user-locations');
    return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const result = await backend.post('/user-locations', body);
    return NextResponse.json(result);
}

export async function PATCH(request: NextRequest) {
    const body = await request.json();
    // Assuming we might want to update or set default in the future
    const result = await backend.patch('/user-locations', body);
    return NextResponse.json(result);
}
