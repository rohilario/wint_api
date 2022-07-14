"use strict";
const swaggerAutogen = require('swagger-autogen')();
const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/app.ts'];
swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('./src/app.ts'); // Your project's root file
});
