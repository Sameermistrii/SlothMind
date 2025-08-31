import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { 
      message: 'API is working!',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json(
      { 
        message: 'POST request received',
        data: body,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    );
  }
}
