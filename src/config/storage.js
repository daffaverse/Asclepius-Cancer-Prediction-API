const { Storage } = require('@google-cloud/storage');
require('dotenv').config();

// Pastikan semua environment variables ada
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS || 
    !process.env.GOOGLE_CLOUD_PROJECT_ID || 
    !process.env.GOOGLE_CLOUD_BUCKET_NAME) {
    throw new Error('Missing required GCP configuration in environment variables');
}

const storage = new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);

// Verifikasi koneksi
bucket.exists().then(([exists]) => {
    if (!exists) {
        throw new Error(`Bucket ${process.env.GOOGLE_CLOUD_BUCKET_NAME} does not exist`);
    }
    console.log('Successfully connected to Cloud Storage bucket');
}).catch(error => {
    console.error('Error connecting to Cloud Storage:', error);
    throw error;
});

module.exports = { bucket };
