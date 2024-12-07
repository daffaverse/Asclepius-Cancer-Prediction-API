const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { getModel } = require('../models/modelLoader');
const { preprocessImage } = require('../utils/imageProcessor');
const { saveToFirestore } = require('./storageService');

async function predictImage(imagePath) {
    try {
        const tensor = await preprocessImage(imagePath);
        const model = getModel();
        
        console.log('Model Input Shape:', tensor.shape);
        const predictions = await model.predict(tensor);
        console.log('Model Output Shape:', predictions.shape);
        
        const probability = (await predictions.data())[0];
        const threshold = 0.5803;
        const isCancer = probability > threshold;
        
        console.log(`Raw Probability: ${(probability * 100).toFixed(2)}%`);
        console.log(`Prediction: ${isCancer ? "Cancer" : "Non-cancer"}`);

        const uniqueId = uuidv4();
        const predictionData = {
            id: uniqueId,
            result: isCancer ? "Cancer" : "Non-cancer",
            createdAt: new Date().toISOString(),
            suggestion: isCancer ? "Segera periksa ke dokter!" : "Penyakit kanker tidak terdeteksi."
        };

        // Save to Firestore
        await saveToFirestore(predictionData);
        
        return {
            data: [{
                id: uniqueId,
                history: predictionData
            }]
        };
    } catch (error) {
        throw error;
    }
}

module.exports = { predictImage };
