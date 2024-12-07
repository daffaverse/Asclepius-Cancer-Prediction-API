const { predictImage } = require('../services/predictionService');

module.exports = {
    method: 'POST',
    path: '/predict',
    options: {
        payload: {
            output: 'file',
            parse: true,
            multipart: true,
            allow: 'multipart/form-data',
            maxBytes: 1000000,
            failAction: (request, h, err) => {
                if (err.output.statusCode === 413) {
                    return h.response({
                        status: 'fail',
                        message: 'Payload content length greater than maximum allowed: 1000000'
                    }).code(413).takeover();
                }
                return h.response({
                    status: 'fail',
                    message: 'Terjadi kesalahan dalam melakukan prediksi'
                }).code(400).takeover();
            }
        }
    },
    handler: async (request, h) => {
        try {
            const { image } = request.payload;
            
            if (!image) {
                return h.response({
                    status: 'fail',
                    message: 'Terjadi kesalahan dalam melakukan prediksi'
                }).code(400);
            }

            if (image.headers['content-type'] !== 'image/png') {
                return h.response({
                    status: 'fail',
                    message: 'Terjadi kesalahan dalam melakukan prediksi'
                }).code(400);
            }

            const result = await predictImage(image.path);
            
            const response = {
                status: 'success',
                message: 'Model is predicted successfully',
                data: {
                    id: result.data[0].id,
                    result: result.data[0].history.result,
                    createdAt: result.data[0].history.createdAt,
                    suggestion: result.data[0].history.result === 'Cancer' 
                        ? 'Segera periksa ke dokter!'
                        : 'Penyakit kanker tidak terdeteksi.'
                }
            };

            return h.response(response).code(201);
        } catch (error) {
            console.error('Error details:', error);
            return h.response({
                status: 'fail',
                message: 'Terjadi kesalahan dalam melakukan prediksi'
            }).code(400);
        }
    }
};
