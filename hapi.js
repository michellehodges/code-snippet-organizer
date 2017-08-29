'use strict';

const Hapi = require('hapi');
const mongojs = require('mongojs')

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

//Connect to db
server.app.db = mongojs('hapi-rest-mongo', ['snippets']);

// Add the route
server.route({
    method: 'GET',
    path:'/snippets',
    handler: function (request, reply) {

        return reply('Snippets will be shown here soon enough....');
    }
});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
