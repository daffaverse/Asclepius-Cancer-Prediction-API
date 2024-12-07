const { getAllPredictions } = require('../services/storageService');

module.exports = {
    method: 'GET',
    path: '/predict/histories',
    handler: async (request, h) => {
        try {
            const predictions = await getAllPredictions();
            
            return h.response({
                status: 'success',
                data: predictions
            }).code(200);
        } catch (error) {
            console.error('Error fetching predictions:', error);
            return h.response({
                status: 'fail',
                message: 'Terjadi kesalahan dalam mengambil riwayat prediksi'
            }).code(500);
        }
    }
};