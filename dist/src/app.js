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
const body_parser_1 = __importDefault(require("body-parser"));
require('dotenv').config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const connection_1 = __importDefault(require("./config/connection"));
require("reflect-metadata");
const swaggerFile = require('../swagger_output');
const auth_1 = __importDefault(require("./services/auth"));
//import redis from "redis";
const redis = require('redis');
const morgan_1 = __importDefault(require("morgan"));
const cache_1 = __importDefault(require("./services/cache"));
//CONFIGURANDO PORTA DA APLICACAO
const port = process.env.PORT;
//CONFIGURANDO EXPRESS
const app = (0, express_1.default)();
//CONFIGURANDO O ROUTER PARA ROTA PADRAO
const router = express_1.default.Router();
//IMPORTANDO ROTAS
const LogisticRoutes_1 = __importDefault(require("./routes/LogisticRoutes"));
const RegistrationRoutes_1 = __importDefault(require("./routes/RegistrationRoutes"));
const PedidosRoutes_1 = __importDefault(require("./routes/PedidosRoutes"));
const ImageRoutes_1 = __importDefault(require("./routes/ImageRoutes"));
const PixRoutes_1 = __importDefault(require("./routes/PixRoutes"));
const DuplicataRoutes_1 = __importDefault(require("./routes/DuplicataRoutes"));
const AuthRoutes_1 = __importDefault(require("./routes/AuthRoutes"));
const CreditoRoutes_1 = __importDefault(require("./routes/CreditoRoutes"));
const ActionsRoutes_1 = __importDefault(require("./routes/ActionsRoutes"));
const MilvusRoutes_1 = __importDefault(require("./routes/MilvusRoutes"));
const SmarketingRoutes_1 = __importDefault(require("./routes/SmarketingRoutes"));
const PixBradescoRoutes_1 = __importDefault(require("./routes/PixBradescoRoutes"));
const PrecificacaoRoutes_1 = __importDefault(require("./routes/PrecificacaoRoutes"));
const ClienteRoutes_1 = __importDefault(require("./routes/ClienteRoutes"));
//configurando o body parser para pegar POSTS mais tarde
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
// middleware para upload via FTP
app.use((0, express_fileupload_1.default)());
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
app.use((0, morgan_1.default)("tiny"));
//definindo as rotas
app.use('/', router);
app.use('/auth', AuthRoutes_1.default);
app.use('/actions', auth_1.default.verifyJWT, ActionsRoutes_1.default);
app.use('/logistica', auth_1.default.verifyJWT, LogisticRoutes_1.default);
app.use('/cadastro', auth_1.default.verifyJWT, cache_1.default.verifyCache, RegistrationRoutes_1.default);
app.use('/pedidos', auth_1.default.verifyJWT, PedidosRoutes_1.default);
app.use('/pix', auth_1.default.verifyJWT, PixRoutes_1.default);
app.use('/duplicatas', auth_1.default.verifyJWT, DuplicataRoutes_1.default);
app.use('/credito', auth_1.default.verifyJWT, CreditoRoutes_1.default);
app.use('/images', auth_1.default.verifyJWT, ImageRoutes_1.default);
app.use('/milvus', auth_1.default.verifyJWT, MilvusRoutes_1.default);
app.use('/smarketing', auth_1.default.verifyJWT, SmarketingRoutes_1.default);
app.use('/pix/bradesco', auth_1.default.verifyJWT, PixBradescoRoutes_1.default);
app.use('/precificacao', auth_1.default.verifyJWT, PrecificacaoRoutes_1.default);
app.use('/clientes', auth_1.default.verifyJWT, ClienteRoutes_1.default);
//SWAGGER DOCUMENTATTION ROUTER
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerFile));
//DEFAULT RESPONSE FOR OTHER ROUTES
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
connection_1.default.initOracleDbConection();
//CHECA A CONEXAO JA REUTILIZANDO DO SPOOL CRIADO
//connection.checkConnection();
//CONSOLE LOG DO START
console.log("-------------------------------------------------------------------------------------------------------------------------------------");
console.log(process.env.NODE_ENV === "test" ? "''-------------------------------------------------------------- AMBIENTE DE: HOMOLOGACAO" : "-------------------------------------------------------------- AMBIENTE DE: #PRODUCAO#------------------------------------------------");
console.log("---------------------------------------------# WINTHOR API ROFE DISTRIBUIDORA # " + port + " ------------------------------------------------------");
console.log("-------------------------------------------------------------------------------------------------------------------------------------");
