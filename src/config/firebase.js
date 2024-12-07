const { Firestore } = require('@google-cloud/firestore');

const db = new Firestore({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

module.exports = { db };