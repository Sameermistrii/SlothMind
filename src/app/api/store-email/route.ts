import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // For now, we'll just log the email and return success
    // In a production environment, you'd want to store this in a database
    console.log('Email received:', email);
    
    // You can also send this to an external service like:
    // - Airtable
    // - Google Sheets
    // - Database (MongoDB, PostgreSQL, etc.)
    // - Email service (SendGrid, Mailchimp, etc.)

    return NextResponse.json(
      { 
        message: 'Email stored successfully',
        email: email 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error storing email:', error);
    return NextResponse.json(
      { error: 'Failed to store email' },
      { status: 500 }
    );
  }
}
