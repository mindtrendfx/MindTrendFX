# MindTrendFX Deployment Guide

## 🌐 Live Website

**Firebase Hosting URLs:**
- Primary: https://mindtrendfx-edu.web.app
- Alternative: https://mindtrendfx-edu.firebaseapp.com

**Deployment Date:** November 17, 2025

## 🚀 Deployment Setup

### Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase account with mindtrendfx@gmail.com
- Firebase project: `mindtrendfx-edu`

### Initial Setup (Already Completed)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Set Firebase Project**
   ```bash
   firebase use mindtrendfx-edu
   ```

4. **Deploy to Firebase Hosting**
   ```bash
   firebase deploy --only hosting
   ```

## 📦 What's Deployed

The following files are hosted on Firebase:

### Core Files
- `index.html` - Homepage with hero section and modals
- `register.html` - Registration page with form
- `css/style.css` - Complete styling with VIBGYOR theme
- `js/app.js` - Form validation, phone validation, modal handlers
- `js/firebase-config.js` - Google Apps Script URL configuration
- `MindTrendFXLogo.JPG` - Logo and favicon

### Documentation Files (Not Deployed)
- `GOOGLE_APPS_SCRIPT.md` - Setup guide for backend
- `google-apps-script.js` - Backend script code
- `*.md` files - Documentation

## 🔄 How to Update the Website

Whenever you make changes to your website:

1. **Test Locally**
   ```bash
   python3 -m http.server 8000
   # Visit http://localhost:8000
   ```

2. **Commit Changes to GitHub**
   ```bash
   git add .
   git commit -m "describe your changes"
   git push origin main
   ```

3. **Deploy to Firebase**
   ```bash
   firebase deploy --only hosting
   ```

## 🌍 Custom Domain Setup (Future)

To add a custom domain like `www.mindtrendfx.com`:

1. Go to [Firebase Console](https://console.firebase.google.com/project/mindtrendfx-edu/hosting)
2. Click **"Add custom domain"**
3. Enter your domain name
4. Follow Firebase's DNS verification steps
5. Add the provided DNS records to your domain registrar:
   - A record pointing to Firebase IPs
   - TXT record for verification

### DNS Configuration Example
```
Type    Name    Value
A       @       151.101.1.195
A       @       151.101.65.195
TXT     @       firebase-verification-code
```

## 📊 Backend Integration

### Google Apps Script
- **Purpose**: Handle form submissions, send emails, store data in Google Sheets
- **Spreadsheet**: "MindTrendFX Registrations"
- **Admin Email**: mindtrendfx@gmail.com
- **Web App URL**: https://script.google.com/macros/s/AKfycbw.../exec

### Features
- Duplicate email/phone validation
- Admin notifications for new registrations
- User confirmation emails
- Google Sheets data storage

## 🔐 Security Notes

- Google Apps Script URL is configured in `js/firebase-config.js`
- Form data sent via POST to Google Apps Script
- Email validation prevents duplicates
- Phone validation with country-specific rules

## 📱 Social Media Links

- **YouTube**: https://www.youtube.com/@ridhcharttalks
- **Telegram**: https://t.me/+zWbjw2ioVsAwYTYx
- **Instagram**: https://www.instagram.com/ridhcharttalks

## 🛠️ Firebase Configuration

**firebase.json:**
- Public directory: `.` (root)
- Ignores: Documentation files, node_modules, scripts
- Rewrites: All routes to index.html (SPA behavior)

## 📞 Support

For any issues with deployment:
1. Check Firebase Console for error logs
2. Verify all files are committed to GitHub
3. Ensure firebase.json is properly configured
4. Run `firebase deploy --debug` for detailed logs

---

**Project Repository**: https://github.com/mindtrendfx/MindTrendFX
**Firebase Project**: mindtrendfx-edu
