"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//const app = express();
const bodyParser = require('body-parser');
//require('dotenv/config');
require('dotenv').config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });
//const oracledb = require('oracledb');
const fileUpload = require('express-fileupload');
const port = process.env.PORT;
const swaggerUi = require('swagger-ui-express');
const connection = require('./config/connection.js');
require("reflect-metadata");
const swaggerFile = require('../swagger_output.json');
const JWT = require('./services/auth');
const router = express_1.default.Router();
const redis = require("redis");
const morgan = require('morgan');
//IMPORTANDO ROTAS
const LogistcRoutes = require('./routes/LogisticRoutes');
const ResgistrationRoutes = require('./routes/RegistrationRoutes');
const PedidosRouter = require('./routes/PedidosRoutes');
const ImagesRouter = require('./routes/ImageRoutes');
const PixRouter = require('./routes/PixRoutes');
const DuplicatasRouter = require('./routes/DuplicataRoutes');
const AuthRouter = require('./routes/AuthRoutes');
const CreditoRouter = require('./routes/CreditoRoutes');
const ActionRouter = require('./routes/ActionsRoutes');
const MilvusRouter = require('./routes/MilvusRoutes');
const SmarketingRouter = require('./routes/SmarketingRoutes');
const PixBradescoRoutes = require('./routes/PixBradescoRoutes');
const PrecificacaoRoutes = require('./routes/PrecificacaoRoutes');
const ClienteRoutes = require('./routes/ClienteRoutes');
const app = (0, express_1.default)();
//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// middleware para upload via FTP
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
    res.setHeader('Access-Control-Allow-Credentials', 'false');
    // Pass to next layer of middleware
    next();
});
//MORGAN MIDDLEWARE FOR LOGS HTTP REQUESTS
app.use(morgan("tiny"));
//definindo as rotas
app.use('/', router);
app.use('/auth', AuthRouter);
app.use('/actions', JWT.verifyJWT, ActionRouter);
app.use('/logistica', JWT.verifyJWT, LogistcRoutes);
app.use('/cadastro', JWT.verifyJWT, ResgistrationRoutes);
app.use('/pedidos', JWT.verifyJWT, PedidosRouter);
app.use('/pix', JWT.verifyJWT, PixRouter);
app.use('/duplicatas', JWT.verifyJWT, DuplicatasRouter);
app.use('/credito', JWT.verifyJWT, CreditoRouter);
app.use('/images', JWT.verifyJWT, ImagesRouter);
app.use('/milvus', JWT.verifyJWT, MilvusRouter);
app.use('/smarketing', JWT.verifyJWT, SmarketingRouter);
app.use('/pix/bradesco', JWT.verifyJWT, PixBradescoRoutes);
app.use('/precificacao', JWT.verifyJWT, PrecificacaoRoutes);
app.use('/clientes', JWT.verifyJWT, ClienteRoutes);
//SWAGGER DOCUMENTATTION
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
// Resposta padrão para quaisquer outras requisições:
app.use((req, res) => {
    res.status(404);
});
//INICIA O SERVIDOR
app.listen(port);
(() => __awaiter(void 0, void 0, void 0, function* () {
    const redisClient = redis.createClient();
    redisClient.on("error", (error) => console.error(`Error : ${error}`));
    yield redisClient.connect();
    console.log('REDIS CONECTADO COM SUCESSO!');
}))();
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
