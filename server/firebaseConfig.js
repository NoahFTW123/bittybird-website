const admin = require('firebase-admin');

// Load the service account key
const serviceAccount = require('./firebaseKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "bittybird-co.firebasestorage.app"
});

const bucket = admin.storage().bucket();
const db = admin.firestore();

module.exports = { admin, db, bucket };
