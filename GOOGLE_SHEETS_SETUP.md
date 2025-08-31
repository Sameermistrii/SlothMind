# 🚀 Google Sheets Setup Guide for SlothMind

## 📋 Step 1: Create Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new sheet called "SlothMind Emails"
3. Add these headers in row 1:
   - **A1**: `Email`
   - **B1**: `Date` 
   - **C1**: `Time`

## 🔑 Step 2: Get Google Cloud Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable Google Sheets API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

4. Create Service Account:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Fill in details and click "Create"

5. Download JSON Key:
   - Click on your service account
   - Go to "Keys" tab
   - Click "Add Key" → "Create New Key"
   - Choose "JSON" and download

6. Share Google Sheet:
   - Open your "SlothMind Emails" sheet
   - Click "Share" button
   - Add your service account email (from JSON file)
   - Give "Editor" access

## ⚙️ Step 3: Add Environment Variables to Vercel

Go to your Vercel project → Settings → Environment Variables and add:

```
GOOGLE_SHEET_ID=your_sheet_id_from_url
GOOGLE_PROJECT_ID=from_json_file
GOOGLE_PRIVATE_KEY_ID=from_json_file
GOOGLE_PRIVATE_KEY=from_json_file
GOOGLE_CLIENT_EMAIL=from_json_file
GOOGLE_CLIENT_ID=from_json_file
GOOGLE_CLIENT_CERT_URL=from_json_file
```

## 📱 Step 4: Test

1. Deploy your changes
2. Submit an email on your website
3. Check your Google Sheet - new row should appear!

## 💡 Benefits

- ✅ **Free forever** - no monthly costs
- ✅ **Access anywhere** - phone, tablet, computer  
- ✅ **Real-time updates** - see new emails instantly
- ✅ **Easy to organize** - sort, filter, search
- ✅ **Export options** - CSV, PDF, Excel
- ✅ **Share with team** - if needed

## 🔧 Troubleshooting

If emails aren't appearing:
1. Check Vercel function logs
2. Verify environment variables are set
3. Ensure Google Sheet is shared with service account
4. Check Google Sheets API is enabled
