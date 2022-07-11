const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//require('dotenv/config');
require('dotenv').config({path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"})
const oracledb = require('oracledb');
const fileUpload = require('express-fileupload');
const port = process.env.PORT;
const swaggerUi = require('swagger-ui-express');
const connection = require('./config/connection.js');
import AppDataSource  from "./config/data-source"
import "reflect-metadata"
const swaggerFile = require('./swagger/swagger_output.json');

//IMPORTANDO ROTAS
const LogistcRoutes = require('./routes/LogisticRoutes')
const ResgistrationRoutes = require('./routes/RegistrationRoutes')
const PedidosRouter = require('./routes/PedidosRoutes')
const ImagesRouter = require('./routes/ImageRoutes')
const PixRouter = require('./routes/PixRoutes')
const DuplicatasRouter = require('./routes/DuplicataRoutes')
const AuthRouter = require('./routes/Auth')
const CreditoRouter = require('./routes/CreditoRoutes')
const ActionRouter = require('./routes/ActionsRoutes')
const MilvusRouter = require('./routes/MilvusRoutes')
const SmarketingRouter = require('./routes/SmarketingRoutes')
const PixBradescoRoutes = require('./routes/PixBradescoRoutes')
const PrecificacaoRoutes = require('./routes/PrecificacaoRoutes')
const ClienteRoutes = require('./routes/ClienteRoutes')

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
app.use('/auth',AuthRouter);
app.use('/actions',ActionRouter)
app.use('/logistica', LogistcRoutes);
app.use('/cadastro', ResgistrationRoutes);
app.use('/pedidos', PedidosRouter);
app.use('/pix', PixRouter);
app.use('/duplicatas', DuplicatasRouter);
app.use('/credito',CreditoRouter);
app.use('/images', ImagesRouter);
app.use('/milvus', MilvusRouter);
app.use('/smarketing',SmarketingRouter);
app.use('/pix/bradesco',PixBradescoRoutes);
app.use('/precificacao',PrecificacaoRoutes);
app.use('/clientes',ClienteRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// Resposta padrão para quaisquer outras requisições:
app.use((req, res) => {
    res.status(404)
})

//INICIA O SERVIDOR
app.listen(port);

//ESTABELE UMA CONEXAO COM O BANCO ORACLE - WINTHOR
connection.initOracleDbConection();

//CHECA A CONEXAO JA REUTILIZANDO DO SPOOL CRIADO
//connection.checkConnection();

//console.log(AppDataSource)

//CONSOLE LOG DO START
console.log("-------------------------------------------------------------------------------------------------------------------------------------");
console.log(process.env.NODE_ENV === "test" ? "''-------------------------------------------------------------- AMBIENTE DE: HOMOLOGACAO" : "-------------------------------------------------------------- AMBIENTE DE: #PRODUCAO#------------------------------------------------");
console.log("---------------------------------------------# WINTHOR API ROFE DISTRIBUIDORA # " + port + " ------------------------------------------------------");
console.log("-------------------------------------------------------------------------------------------------------------------------------------");
