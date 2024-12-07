'use strict';

const Hapi = require('@hapi/hapi');
const path = require('path');
require('dotenv').config();
const { loadModel } = require('./src/models/modelLoader');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 8000,
        host: 'localhost',
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
    server.route(require('./src/handlers/predictionHandler'));
    server.route(require('./src/handlers/healthHandler'));

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
