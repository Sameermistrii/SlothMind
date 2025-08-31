import { google } from 'googleapis';

// Google Sheets configuration
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SHEET_ID = process.env.GOOGLE_SHEET_ID; // You'll add this to Vercel
const SHEET_NAME = 'Sheet1'; // Default sheet name

// Initialize Google Sheets API
function getGoogleSheets() {
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
    credentials: {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
    },
  });

  return google.sheets({ version: 'v4', auth });
}

// Add email to Google Sheet
export async function addEmailToSheet(email) {
  try {
    const sheets = getGoogleSheets();
    const now = new Date();
    
    const values = [
      [
        email,
        now.toLocaleDateString(),
        now.toLocaleTimeString()
      ]
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:C`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: values,
      },
    });

    console.log('Email added to sheet:', response.data);
    return true;
  } catch (error) {
    console.error('Error adding email to sheet:', error);
    return false;
  }
}

// Get all emails from sheet
export async function getEmailsFromSheet() {
  try {
    const sheets = getGoogleSheets();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:C`,
    });

    return response.data.values || [];
  } catch (error) {
    console.error('Error getting emails from sheet:', error);
    return [];
  }
}
