const { db } = require('../config/firebase');
const { bucket } = require('../config/storage');
const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();

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

async function getAllModelsFromStorage() {
    try {
        const [files] = await bucket.getFiles({ prefix: 'model/' }); // Mengambil semua file dengan prefix 'model/'
        
        const modelPaths = files.map(file => `gs://${process.env.GOOGLE_CLOUD_BUCKET_NAME}/${file.name}`);
        return modelPaths; // Mengembalikan array dari semua model paths
    } catch (error) {
        console.error('Error accessing models from storage:', error);
        throw error;
    }
}

async function getAllPredictions() {
    try {
        const predictionsRef = firestore.collection('prediction');
        const snapshot = await predictionsRef.get();
        
        const predictions = [];
        snapshot.forEach(doc => {
            predictions.push({
                id: doc.id,
                history: {
                    result: doc.data().result,
                    createdAt: doc.data().createdAt,
                    suggestion: doc.data().suggestion,
                    id: doc.id
                }
            });
        });
        
        return predictions;
    } catch (error) {
        console.error('Error getting predictions:', error);
        throw error;
    }
}

module.exports = { saveToFirestore, getModelFromStorage, getAllPredictions };
