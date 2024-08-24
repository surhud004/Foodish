const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    version: '1.0.0',
    title: 'Foodish API',
    description: 'A Node.js/Express.js REST API to GET a random picture of food dishes.'
  },
  servers: [
    {
      url: 'https://foodish-api.com',
      description: 'Foodish API server'
    }
  ]
};

const outputFile = './swagger-api.json';
const routes = ['../app.js'];

swaggerAutogen(outputFile, routes, doc);
