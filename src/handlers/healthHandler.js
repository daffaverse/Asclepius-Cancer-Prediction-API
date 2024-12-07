module.exports = {
    method: 'GET',
    path: '/health',
    handler: (request, h) => {
        return h.response({
            status: 'success',
            message: 'Server is healthy'
        }).code(200);
    }
};
