# Google Apps Script Setup Guide

This guide will help you set up email notifications and Google Sheets integration for MindTrendFX registration form.

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "MindTrendFX Registrations"
3. In the first row, add these headers:
   ```
   Timestamp | Full Name | Email | Country Code | Phone Number | Complete Phone | Trading Experience | Areas of Interest
   ```

## Step 2: Set Up Google Apps Script

1. In your Google Sheet, click **Extensions** > **Apps Script**
2. Delete any existing code
3. Copy and paste the script from `google-apps-script.js` file
4. Click **Save** (name it "MindTrendFX Registration Handler")

## Step 3: Deploy as Web App

1. In the Apps Script editor, click **Deploy** > **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description**: MindTrendFX Registration API
   - **Execute as**: Me
   - **Who has access**: Anyone
5. Click **Deploy**
6. **Authorize** the script (you may see a warning - click "Advanced" then "Go to [project name]")
7. **Copy the Web App URL** - you'll need this

## Step 4: Update Your Website

1. Open `js/firebase-config.js`
2. Add this line with your Web App URL:
   ```javascript
   const APPS_SCRIPT_URL = 'YOUR_WEB_APP_URL_HERE';
   ```

## Step 5: Test

1. Submit a test registration on your website
2. Check your Google Sheet for the new entry
3. Check mindtrendfx@gmail.com for the notification email

## Troubleshooting

- **Script execution fails**: Make sure you authorized the script properly
- **No email received**: Check Gmail spam folder and verify script permissions
- **Sheet not updating**: Ensure sheet name matches exactly "MindTrendFX Registrations"
- **CORS errors**: Make sure deployment is set to "Anyone" for access

## Security Notes

- The Web App URL should be kept private
- Consider adding additional validation in the Apps Script
- You can add reCAPTCHA for additional security
