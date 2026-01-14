// Firebase Configuration for your portfolio
// This is the SIMPLE version that works with GitHub Pages

// Firebase configuration from your console
const firebaseConfig = {
    apiKey: "AIzaSyDzwkyc5DzZprkiYpuFhrabxrp4VZ1yWjQ",
    authDomain: "my-portfolio-9951.firebaseapp.com",
    projectId: "my-portfolio-9951",
    storageBucket: "my-portfolio-9951.firebasestorage.app",
    messagingSenderId: "152313884589",
    appId: "1:152313884589:web:29c41db9d6a02017c3fb24",
    measurementId: "G-943YW07NCW"
};

// Initialize Firebase when scripts are loaded
function initializeFirebase() {
    // Check if Firebase is already initialized
    if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
        
        // Initialize Firestore
        const db = firebase.firestore();
        const analytics = firebase.analytics();
        
        // Make available globally
        window.firebaseDB = db;
        window.firebaseAnalytics = analytics;
        
        console.log("✅ Firebase initialized successfully!");
        return db;
    }
    return firebase.firestore();
}

// Wait for Firebase to load, then initialize
if (typeof firebase !== 'undefined') {
    initializeFirebase();
} else {
    // Firebase not loaded yet, will initialize when loaded
    document.addEventListener('firebase-loaded', initializeFirebase);
}

// Export for use
window.initializeFirebase = initializeFirebase;