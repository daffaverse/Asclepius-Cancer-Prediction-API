const sharp = require('sharp');
const tf = require('@tensorflow/tfjs-node');

async function preprocessImage(imagePath) {
    const imageBuffer = await sharp(imagePath)
        .resize(224, 224)
        .toBuffer();
    
    const tensor = tf.node.decodeImage(imageBuffer, 3)
        .expandDims(0)
        .toFloat()
        .div(255.0);
    
    console.log('Image Tensor Shape:', tensor.shape);
    
    return tensor;
}

module.exports = { preprocessImage }; 