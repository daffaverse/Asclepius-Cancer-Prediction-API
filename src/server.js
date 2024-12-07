'use strict';

const Hapi = require('@hapi/hapi');
const path = require('path');
require('dotenv').config();
const { loadModel } = require('./models/modelLoader');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 8080,
        host: '0.0.0.0',
        routes: {
            cors: true,
            files: {
                relativeTo: path.join(__dirname, 'uploads')
            }
        }
    });

    // Load ML model
    await loadModel();

    // Register routes
    await server.register([
        {
            plugin: require('@hapi/inert')
        }
    ]);

    // Routes
    server.route(require('./handlers/predictionHandler'));
    server.route(require('./handlers/healthHandler'));

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
