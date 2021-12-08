const swaggerAutogen = require('swagger-autogen')();

const outputFile = './src/swagger/swagger_output.json'; 

const endpointsFiles = ['./app.js'];
//./src/routes/routes.js

//swaggerAutogen(outputFile, endpointsFiles);

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('./app.js');           // Your project's root file
})