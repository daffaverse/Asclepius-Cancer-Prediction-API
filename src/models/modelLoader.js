const tf = require('@tensorflow/tfjs-node');

let model;

async function loadModel() {
    try {
        model = await tf.loadGraphModel('file://./src/model/model.json');
        console.log('Model loaded successfully');
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
