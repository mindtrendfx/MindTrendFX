// Google Apps Script Web App URL
// IMPORTANT: Replace this with your actual Web App URL after deploying the Google Apps Script
// Follow the instructions in GOOGLE_APPS_SCRIPT.md to set this up
window.APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwPvbeYPV0gHGyXa_AjWF5DThKlRb5B9lR_21e-87mWdgDqz7l7V_OBGE4t5YtB60DXjg/exec';

// Initialize Firebase (Optional - keeping for future use)
// TODO: Replace these values with your Firebase project credentials
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the Firestore database
const db = firebase.firestore();
