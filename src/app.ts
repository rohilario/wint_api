import express, { Express, Request, Response } from 'express';
//const app = express();
import bodyParser from 'body-parser';
//require('dotenv/config');
require('dotenv').config({path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"})
//const oracledb = require('oracledb');
import fileUpload from 'express-fileupload';
const port = process.env.PORT;
import swaggerUi from 'swagger-ui-express';

import connection from './config/connection';
import AppDataSource  from "./config/data-source"
import "reflect-metadata"
const swaggerFile = require('../swagger_output');
import JWT from './services/auth';
const router = express.Router();
import redis from "redis";
import morgan from 'morgan';

//IMPORTANDO ROTAS
import LogistcRoutes from './routes/LogisticRoutes';
import ResgistrationRoutes from './routes/RegistrationRoutes';
import PedidosRouter from './routes/PedidosRoutes';
import ImagesRouter from './routes/ImageRoutes';
import PixRouter from './routes/PixRoutes';
import DuplicatasRouter from './routes/DuplicataRoutes';
import AuthRouter from './routes/AuthRoutes';
import CreditoRouter from './routes/CreditoRoutes';
import ActionRouter from './routes/ActionsRoutes';
import MilvusRouter from './routes/MilvusRoutes';
import SmarketingRouter from './routes/SmarketingRoutes';
import PixBradescoRoutes from './routes/PixBradescoRoutes';
import PrecificacaoRoutes from './routes/PrecificacaoRoutes';
import ClienteRoutes from './routes/ClienteRoutes';

const app: Express = express();

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

app.use('/',router);
app.use('/auth',AuthRouter);
app.use('/actions',JWT.verifyJWT,ActionRouter)
app.use('/logistica',JWT.verifyJWT, LogistcRoutes);
app.use('/cadastro',JWT.verifyJWT, ResgistrationRoutes);
app.use('/pedidos',JWT.verifyJWT, PedidosRouter);
app.use('/pix',JWT.verifyJWT, PixRouter);
app.use('/duplicatas',JWT.verifyJWT, DuplicatasRouter);
app.use('/credito',JWT.verifyJWT,CreditoRouter);
app.use('/images',JWT.verifyJWT, ImagesRouter);
app.use('/milvus',JWT.verifyJWT, MilvusRouter);
app.use('/smarketing',JWT.verifyJWT,SmarketingRouter);
app.use('/pix/bradesco',JWT.verifyJWT,PixBradescoRoutes);
app.use('/precificacao',JWT.verifyJWT,PrecificacaoRoutes);
app.use('/clientes',JWT.verifyJWT,ClienteRoutes);

//SWAGGER DOCUMENTATTION
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// Resposta padrão para quaisquer outras requisições:
app.use((req: Request, res: Response) => {
    res.status(404)
})


//INICIA O SERVIDOR
app.listen(port);
(async () => {
    const redisClient = redis.createClient();  
    redisClient.on("error", (error) => console.error(`Error : ${error}`));
    await redisClient.connect();
    console.log('REDIS CONECTADO COM SUCESSO!')
  })();

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
