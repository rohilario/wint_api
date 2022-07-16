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
Object.defineProperty(exports, "__esModule", { value: true });
const expressClientes = require('express');
const ClienteRouter = expressClientes.Router();
const clientefunctions = require('../services/ClientesFunctions');
const AppDataSource = require("../config/data-source");
//ENDPOINT PARA BUSCAR DUPLICATAS POR RCA
ClienteRouter.get('/codrca/:codrca/:codcli', function (req, res) {
    const codrca = req.params.codrca;
    const codcli = req.params.codcli;
    //console.log(req)
    const obj = {
        "codrca": codrca,
        "codcli": codcli
    };
    //console.log(obj)
    if (obj.codrca) {
        //res.status(200)
        //res.json(obj)
        clientefunctions.getClienteRca(req, res, obj);
        //console.log(req.body.data.cpfcnpj)  
    }
    else {
        res.json({ "ERROR": codcli });
        res.status(404);
    }
});
//TESTE COM ORM TYPEORM
ClienteRouter.get('/teste', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let users = yield AppDataSource.default.manager.query('SELECT * FROM PCCLIENT C WHERE C.CODCLI=51190');
        console.log(users);
    });
});
//module.exports=ClienteRouter;
exports.default = ClienteRouter;
