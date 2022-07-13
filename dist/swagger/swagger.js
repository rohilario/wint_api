"use strict";
const swaggerAutogen = require('swagger-autogen')();
const outputFile = './swagger_output.json';
const endpointsFiles = ['../app.ts'];
//./src/routes/routes.js
//swaggerAutogen(outputFile, endpointsFiles);
swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('../app.ts'); // Your project's root file
});
