const tf = require('@tensorflow/tfjs-node');

let model;

async function loadModel() {
    try {
        const modelPath = `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_BUCKET_NAME}/model/model.json`;
        model = await tf.loadGraphModel(modelPath);
        console.log('Model loaded successfully from Cloud Storage');
        return model;
    } catch (error) {
        console.error('Error loading model:', error);
        throw error;
    }
}

function getModel() {
    return model;
}

module.exports = { loadModel, getModel };
