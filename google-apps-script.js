/**
 * Google Apps Script for MindTrendFX Registration
 * This script handles form submissions, saves to Google Sheet, and sends email notifications
 */

// Configuration
const SHEET_NAME = 'MindTrendFX Registrations';
const NOTIFICATION_EMAIL = 'mindtrendfx@gmail.com';

/**
 * Handle POST requests from the registration form
 */
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Add headers
      sheet.appendRow([
        'Timestamp',
        'Full Name',
        'Email',
        'Country Code',
        'Phone Number',
        'Complete Phone',
        'Trading Experience',
        'Areas of Interest'
      ]);
      
      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');
    }
    
    // Check for duplicate email or phone
    const emailColumn = 3; // Column C (Email)
    const completePhoneColumn = 6; // Column F (Complete Phone)
    const lastRow = sheet.getLastRow();
    
    if (lastRow > 1) { // Skip header row
      const emailRange = sheet.getRange(2, emailColumn, lastRow - 1, 1);
      const phoneRange = sheet.getRange(2, completePhoneColumn, lastRow - 1, 1);
      
      const existingEmails = emailRange.getValues().flat().map(e => e.toString().toLowerCase().trim());
      const existingPhones = phoneRange.getValues().flat().map(p => p.toString().trim());
      
      const newEmail = (data.email || '').toLowerCase().trim();
      const newPhone = (data.completePhone || '').trim();
      
      // Check for duplicate email
      if (existingEmails.includes(newEmail)) {
        return ContentService.createTextOutput(JSON.stringify({
          status: 'error',
          field: 'email',
          message: 'This email is already registered with us. Please use a different email or contact us if you need assistance.'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      // Check for duplicate phone
      if (existingPhones.includes(newPhone)) {
        return ContentService.createTextOutput(JSON.stringify({
          status: 'error',
          field: 'phone',
          message: 'This phone number is already registered with us. Please use a different number or contact us if you need assistance.'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Prepare data row
    const timestamp = new Date();
    const rowData = [
      timestamp,
      data.fullName || '',
      data.email || '',
      data.countryCode || '',
      data.phone || '',
      data.completePhone || '',
      data.experience || '',
      data.interests || ''
    ];
    
    // Append data to sheet
    sheet.appendRow(rowData);
    
    // Auto-resize columns for better visibility
    sheet.autoResizeColumns(1, 8);
    
    // Send email notifications
    sendEmailNotification(data); // To admin
    sendConfirmationEmail(data); // To user
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Registration successful'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log error and return error response
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Send email notification to mindtrendfx@gmail.com
 */
function sendEmailNotification(data) {
  const subject = `🎯 New Registration - ${data.fullName}`;
  
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #9b59b6 0%, #00bcd4 50%, #00e676 100%); 
                  color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; padding: 10px; background: white; border-left: 4px solid #00bcd4; }
        .label { font-weight: bold; color: #555; }
        .value { color: #222; margin-top: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 New MindTrendFX Registration</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">📅 Registration Time:</div>
            <div class="value">${new Date().toLocaleString()}</div>
          </div>
          
          <div class="field">
            <div class="label">👤 Full Name:</div>
            <div class="value">${data.fullName}</div>
          </div>
          
          <div class="field">
            <div class="label">📧 Email:</div>
            <div class="value">${data.email}</div>
          </div>
          
          <div class="field">
            <div class="label">📱 Phone:</div>
            <div class="value">${data.completePhone || data.countryCode + ' ' + data.phone}</div>
          </div>
          
          <div class="field">
            <div class="label">📊 Trading Experience:</div>
            <div class="value">${data.experience}</div>
          </div>
          
          ${data.interests ? `
          <div class="field">
            <div class="label">⭐ Areas of Interest:</div>
            <div class="value">${data.interests}</div>
          </div>
          ` : ''}
          
          <div class="footer">
            <p>This is an automated notification from MindTrendFX Registration System</p>
            <p>View all registrations in your Google Sheet</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const textBody = `
    New MindTrendFX Registration
    
    Registration Time: ${new Date().toLocaleString()}
    Full Name: ${data.fullName}
    Email: ${data.email}
    Phone: ${data.completePhone || data.countryCode + ' ' + data.phone}
    Trading Experience: ${data.experience}
    ${data.interests ? 'Areas of Interest: ' + data.interests : ''}
    
    ---
    View all registrations in your Google Sheet
  `;
  
  try {
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: subject,
      body: textBody,
      htmlBody: htmlBody
    });
    Logger.log('Email sent successfully to ' + NOTIFICATION_EMAIL);
  } catch (error) {
    Logger.log('Email error: ' + error.toString());
  }
}

/**
 * Send confirmation email to the registered user
 */
function sendConfirmationEmail(data) {
  const subject = '✅ Welcome to MindTrendFX - Registration Confirmed';
  
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #9b59b6 0%, #00bcd4 50%, #00e676 100%); 
                  color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: #f9f9f9; padding: 30px 20px; border-radius: 0 0 8px 8px; }
        .welcome-box { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; 
                       border-left: 4px solid #00bcd4; }
        .info-box { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .details { background: white; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; color: #555; display: inline-block; width: 150px; }
        .value { color: #222; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; 
                  border-top: 1px solid #ddd; color: #888; font-size: 14px; }
        .cta { background: #00bcd4; color: white; padding: 12px 30px; text-decoration: none; 
               border-radius: 5px; display: inline-block; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 Welcome to MindTrendFX!</h1>
        </div>
        <div class="content">
          <div class="welcome-box">
            <h2 style="margin-top: 0; color: #00bcd4;">Hello ${data.fullName}! 👋</h2>
            <p style="font-size: 16px; margin-bottom: 0;">
              Thank you for registering with <strong>MindTrendFX</strong>. We have successfully received your application!
            </p>
          </div>
          
          <div class="info-box">
            <p style="margin: 0; font-size: 15px;">
              <strong>📋 What's Next?</strong><br>
              Our team will review your registration and get back to you within 24-48 hours via email or phone. 
              We're excited to help you on your trading journey!
            </p>
          </div>
          
          <div class="details">
            <h3 style="margin-top: 0; color: #333;">📝 Your Registration Details:</h3>
            <div class="field">
              <span class="label">📅 Submitted on:</span>
              <span class="value">${new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
            <div class="field">
              <span class="label">👤 Name:</span>
              <span class="value">${data.fullName}</span>
            </div>
            <div class="field">
              <span class="label">📧 Email:</span>
              <span class="value">${data.email}</span>
            </div>
            <div class="field">
              <span class="label">📱 Phone:</span>
              <span class="value">${data.completePhone || data.countryCode + ' ' + data.phone}</span>
            </div>
            <div class="field">
              <span class="label">📊 Experience Level:</span>
              <span class="value">${data.experience}</span>
            </div>
            ${data.interests ? `
            <div class="field">
              <span class="label">⭐ Interests:</span>
              <span class="value">${data.interests}</span>
            </div>
            ` : ''}
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 16px; color: #555;">
              In the meantime, follow us on social media for daily trading insights:
            </p>
            <p style="margin: 15px 0;">
              <a href="https://www.youtube.com/@ridhcharttalks" style="color: #00bcd4; text-decoration: none; margin: 0 10px;">
                📺 YouTube
              </a> | 
              <a href="https://t.me/+R4DCumglwzQwNTEx" style="color: #00bcd4; text-decoration: none; margin: 0 10px;">
                💬 Telegram
              </a> | 
              <a href="https://www.instagram.com/ridhcharttalks" style="color: #00bcd4; text-decoration: none; margin: 0 10px;">
                📸 Instagram
              </a>
            </p>
          </div>
          
          <div class="footer">
            <p><strong>MindTrendFX</strong> - Master the Markets with Confidence</p>
            <p style="font-size: 12px; margin-top: 10px;">
              If you have any questions, feel free to reply to this email.<br>
              We typically respond within 24 hours.
            </p>
            <p style="font-size: 11px; color: #aaa; margin-top: 15px;">
              This is an automated confirmation email. Please do not reply to this message.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const textBody = `
    Welcome to MindTrendFX!
    
    Hello ${data.fullName},
    
    Thank you for registering with MindTrendFX. We have successfully received your application!
    
    WHAT'S NEXT?
    Our team will review your registration and get back to you within 24-48 hours via email or phone.
    
    YOUR REGISTRATION DETAILS:
    - Submitted on: ${new Date().toLocaleString()}
    - Name: ${data.fullName}
    - Email: ${data.email}
    - Phone: ${data.completePhone || data.countryCode + ' ' + data.phone}
    - Experience Level: ${data.experience}
    ${data.interests ? '- Areas of Interest: ' + data.interests : ''}
    
    FOLLOW US:
    YouTube: https://www.youtube.com/@ridhcharttalks
    Telegram: https://t.me/+R4DCumglwzQwNTEx
    Instagram: https://www.instagram.com/ridhcharttalks
    
    ---
    MindTrendFX - Master the Markets with Confidence
    
    If you have any questions, feel free to reply to this email.
  `;
  
  try {
    MailApp.sendEmail({
      to: data.email,
      subject: subject,
      body: textBody,
      htmlBody: htmlBody,
      name: 'MindTrendFX'
    });
    Logger.log('Confirmation email sent successfully to ' + data.email);
  } catch (error) {
    Logger.log('Confirmation email error: ' + error.toString());
  }
}

/**
 * Test function to verify setup
 */
function testSubmission() {
  const testData = {
    fullName: 'Test User',
    email: 'test@example.com',
    countryCode: '+91',
    phone: '9876543210',
    completePhone: '+919876543210',
    experience: 'Beginner',
    interests: 'Stock Trading'
  };
  
  sendEmailNotification(testData);
  Logger.log('Test email sent');
}
