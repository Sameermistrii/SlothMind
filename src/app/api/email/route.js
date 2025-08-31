import { addEmailToSheet } from '../../../lib/google-sheets.js';

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return Response.json({ error: 'Email required' }, { status: 400 });
    }
    
    console.log('Email received:', email);
    
    // Check if environment variables are set
    const requiredEnvVars = [
      'GOOGLE_SHEET_ID',
      'GOOGLE_PROJECT_ID',
      'GOOGLE_PRIVATE_KEY_ID',
      'GOOGLE_PRIVATE_KEY',
      'GOOGLE_CLIENT_EMAIL',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_CERT_URL'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('Missing environment variables:', missingVars);
      return Response.json({ 
        error: 'Missing environment variables',
        missing: missingVars
      }, { status: 500 });
    }
    
    console.log('All environment variables are set');
    console.log('Sheet ID:', process.env.GOOGLE_SHEET_ID);
    
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
    return Response.json({ 
      error: 'Server error', 
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

export async function GET() {
  // Check environment variables
  const requiredEnvVars = [
    'GOOGLE_SHEET_ID',
    'GOOGLE_PROJECT_ID',
    'GOOGLE_PRIVATE_KEY_ID',
    'GOOGLE_PRIVATE_KEY',
    'GOOGLE_CLIENT_EMAIL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_CERT_URL'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    return Response.json({ 
      message: 'Email API has missing environment variables',
      missing: missingVars
    }, { status: 500 });
  }
  
  return Response.json({ 
    message: 'Email API is working - all environment variables are set',
    sheetId: process.env.GOOGLE_SHEET_ID
  });
}
