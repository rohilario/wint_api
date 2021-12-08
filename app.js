const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//require('dotenv/config');
require('dotenv').config({path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"})
const fileUpload = require('express-fileupload');
const port = process.env.PORT;
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./src/swagger/swagger_output.json');

//IMPORTANDO ROTAS
const LogistcRoutes = require('./src/routes/LogisticRoutes')
const ResgistrationRoutes = require('./src/routes/RegistrationRoutes')
const PedidosRouter = require('./src/routes/PedidosRoutes')
const ImagesRouter = require('./src/routes/ImageRoutes')

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// middleware
app.use(fileUpload());

// ADICIONANDO E CONFIGURANDO OS HEADERS
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // Pass to next layer of middleware
    next();
});



//definindo as rotas
const router = express.Router();
app.use('/', router);
app.use('/logistica', LogistcRoutes);
app.use('/cadastro', ResgistrationRoutes);
app.use('/pedidos', PedidosRouter);
app.use('/images', ImagesRouter);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


  
//inicia o servidor
app.listen(port);
console.log('WINT_API FUNCIONANDO! - PORTA: ' + port);