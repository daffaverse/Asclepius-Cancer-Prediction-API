const { db } = require('../config/firebase');
const { bucket } = require('../config/storage');

async function saveToFirestore(predictionData) {
    try {
        const docRef = db.collection('prediction').doc(predictionData.id);
        await docRef.set({
            id: predictionData.id,
            result: predictionData.result,
            suggestion: predictionData.suggestion,
            createdAt: predictionData.createdAt
        });
        return true;
    } catch (error) {
        console.error('Error saving to Firestore:', error);
        throw error;
    }
}

async function getModelFromStorage() {
    try {
        const modelJsonFile = bucket.file('model/model.json');
        const [modelJsonExists] = await modelJsonFile.exists();
        
        if (!modelJsonExists) {
            throw new Error('Model file not found in storage');
        }

        const modelPath = `gs://${process.env.GOOGLE_CLOUD_BUCKET_NAME}/model`;
        return modelPath;
    } catch (error) {
        console.error('Error accessing model from storage:', error);
        throw error;
    }
}

module.exports = { saveToFirestore, getModelFromStorage };
