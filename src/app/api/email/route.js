import { addEmailToSheet } from '../../../lib/google-sheets.js';

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return Response.json({ error: 'Email required' }, { status: 400 });
    }
    
    console.log('Email received:', email);
    
    // Store email in Google Sheets
    const success = await addEmailToSheet(email);
    
    if (success) {
      return Response.json({ 
        success: true, 
        message: 'Email stored successfully in Google Sheets',
        email: email 
      });
    } else {
      return Response.json({ 
        success: false, 
        message: 'Failed to store email in Google Sheets',
        email: email 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ message: 'Email API is working - emails will be stored in Google Sheets' });
}
