"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expressPixBradesco = require('express');
const PixBradescoRouter = expressPixBradesco.Router();
const functionsPixBradesco = require('../services/PixBradescoFunctions');
const functions_pix = require('../services/functions');
PixBradescoRouter.get('/token', function (req, res) {
    functionsPixBradesco.GetTokenBradesco(req, res);
});
PixBradescoRouter.post('/RegistrarPix/estatico', function (req, res) {
    //console.log(req.body)
    const authorization = req.headers.authorization;
    let cpfcnpj = req.body.devedor.cpf || req.body.devedor.cnpj;
    let cliente = req.body.devedor.nome;
    let vlpix = req.body.valor.original;
    let solicitacaoPagador = req.body.solicitacaoPagador;
    //console.log(authorization)
    let dados = null;
    if (cpfcnpj.length == 11) {
        const dados = {
            "calendario": {
                "expiracao": "3600"
            },
            "devedor": {
                "cpf": cpfcnpj,
                "nome": cliente
            },
            "valor": {
                "original": vlpix,
                "modalidadeAlteracao": 0
            },
            "chave": "05300197000106",
            "solicitacaoPagador": solicitacaoPagador,
            "nomePersonalizacaoQr": "ROFE",
        };
    }
    else {
        const dados = {
            "calendario": {
                "expiracao": "3600"
            },
            "devedor": {
                "cnpj": cpfcnpj,
                "nome": cliente
            },
            "valor": {
                "original": vlpix,
                "modalidadeAlteracao": 0
            },
            "chave": "05300197000106",
            "solicitacaoPagador": solicitacaoPagador,
            "nomePersonalizacaoQr": "ROFE"
        };
    }
    functionsPixBradesco.RegistraPix(req, res, dados, authorization);
});
PixBradescoRouter.get('/pagamentos/:txid', function (req, res) {
    const txid = req.params.txid;
    const authorization = req.headers.authorization;
    console.log('TXID: ' + txid);
    functionsPixBradesco.getPagamentoPixId(req, res, authorization, txid);
});
PixBradescoRouter.get('/webhook/cadastrar/:key', function (req, res) {
    const key = req.params.key;
    const authorization = req.headers.authorization;
    console.log(key);
    functionsPixBradesco.InsertWebhookPix(req, res, key, authorization);
});
PixBradescoRouter.get('/webhook/notification', function (req, res) {
    const request = req.body;
    console.log(request);
    functions_pix.InsertPixNotification(req, res, request);
});
//module.exports=PixBradescoRoutes
exports.default = PixBradescoRouter;
