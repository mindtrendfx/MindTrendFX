# MindTrendFX - Stock Market Trading Education Platform

A simple, responsive educational website about stock market trading built with HTML, CSS, JavaScript, and Firebase.

## Project Structure

```
MindTrendFX/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # Styling for the website
├── js/
│   ├── firebase-config.js # Firebase configuration
│   └── app.js             # Main application logic
├── public/                # Static files for Firebase hosting
├── firebase.json          # Firebase configuration
├── package.json           # Dependencies
└── README.md             # This file
```

## Features

✅ Responsive design (mobile, tablet, desktop)
✅ Hero section with call-to-action
✅ About section with features
✅ Inspirational quote highlight
✅ Course registration form
✅ Social media links (YouTube, Telegram, Instagram)
✅ Firebase Firestore integration for registrations
✅ Smooth animations and transitions

## Prerequisites

Before you begin, ensure you have:
- Node.js and npm installed
- A Google Firebase account
- Basic knowledge of HTML/CSS/JavaScript
- A code editor (VS Code recommended)

## Setup Instructions

### Step 1: Install Firebase Tools
```bash
npm install -g firebase-tools
```

### Step 2: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a new project"
3. Name it "MindTrendFX"
4. Enable Google Analytics (optional)
5. Create the project

### Step 3: Set Up Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create Database"
3. Start in "Test mode" (for development)
4. Choose a region (preferably nearest to your location)
5. Create the database

### Step 4: Update Firebase Configuration
1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click the web icon (</>)
4. Copy your Firebase config
5. Replace the values in `js/firebase-config.js`

### Step 5: Update Social Media Links
Edit `js/app.js` and update the social media URLs:
```javascript
const socialLinks = {
    youtube: 'https://www.youtube.com/YOUR_CHANNEL',
    telegram: 'https://t.me/YOUR_CHANNEL',
    instagram: 'https://www.instagram.com/YOUR_PROFILE'
};
```

### Step 6: Initialize Firebase Project
```bash
cd /path/to/MindTrendFX
firebase login
firebase init
```

When prompted:
- Select "Hosting"
- Use your existing project
- Set public directory to "public"
- Do NOT overwrite index.html
- Set up automatic builds: "No"

### Step 7: Prepare for Deployment
```bash
# Copy your index.html and other files to the public folder
cp index.html public/
cp -r css public/
cp -r js public/
```

### Step 8: Test Locally
```bash
firebase serve
```
Visit `http://localhost:5000` to test your website

### Step 9: Deploy to Firebase Hosting
```bash
firebase deploy
```

Your website is now live! Firebase will provide you with a hosting URL.

## Customization

### Change Colors
Edit the CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #1e40af;      /* Main blue color */
    --secondary-color: #f59e0b;    /* Accent orange color */
    --text-dark: #1f2937;          /* Dark text */
    --text-light: #6b7280;         /* Light text */
    --bg-light: #f9fafb;           /* Light background */
    --white: #ffffff;              /* White */
}
```

### Add Content
- Edit `index.html` to add more sections
- Update company info, descriptions, etc.

### Update Firestore Rules
For production, update your Firestore security rules:

1. Go to Firebase Console → Firestore Database → Rules
2. Replace with:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /registrations/{document=**} {
      allow create: if request.resource.data.keys().hasAll(['fullName', 'email', 'experience']);
      allow read, write: if false;
    }
  }
}
```

## Production Checklist

- [ ] Update social media URLs
- [ ] Add your YouTube channel link
- [ ] Add your Telegram group link
- [ ] Add your Instagram profile link
- [ ] Test registration form
- [ ] Set up Firestore security rules
- [ ] Add a custom domain (in Firebase Console → Hosting → Custom domain)
- [ ] Set up HTTPS (automatic with Firebase)
- [ ] Create email notification system (optional)
- [ ] Add analytics (optional)

## Hosting on Firebase

Firebase Hosting provides:
- ✅ Free SSL/TLS certificate (HTTPS)
- ✅ Global CDN for fast loading
- ✅ Automatic backups
- ✅ Custom domains support
- ✅ Unlimited bandwidth
- ✅ $0 cost for small projects

### Connect Custom Domain

1. Go to Firebase Console → Hosting
2. Click "Connect domain"
3. Enter your domain
4. Follow the DNS verification steps
5. Update nameservers or add DNS records

## Troubleshooting

### Registration form not saving?
- Check browser console for errors (F12)
- Verify Firebase config in `js/firebase-config.js`
- Ensure Firestore is initialized
- Check Firestore security rules

### Website not loading after deploy?
```bash
firebase deploy --only hosting
```

### Social media links not working?
- Verify URLs are correct in `js/app.js`
- Ensure URLs start with https://

## Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Hosting Guide](https://firebase.google.com/docs/hosting)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [MDN Web Docs](https://developer.mozilla.org/)

## License

MIT License - feel free to use this for your project!

---

**Created for MindTrendFX - Making stock market trading education accessible to everyone.**
