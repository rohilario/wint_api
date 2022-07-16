"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expressActions = require('express');
const ActionRouter = expressActions.Router();
const functionsActions = require('../services/functions');
ActionRouter.post('/email/:domain/disparaemail', function (req, res) {
    const domain = req.params.domain;
    const port = req.body.data.port;
    const host = req.body.data.host;
    const secure = req.body.data.secure;
    const user = req.body.data.user;
    const pass = req.body.data.pass;
    const from = req.body.data.from;
    const to = req.body.data.to;
    const cc1 = req.body.data.cc1;
    const cc2 = req.body.data.cc2;
    const bco = req.body.data.bco;
    const replyto = req.body.data.replyto;
    const subject = req.body.data.subject;
    const text = req.body.data.text;
    const codcli = req.body.data.codcli;
    const cliente = req.body.data.cliente;
    const numped = req.body.data.numped;
    const vlpedido = req.body.data.vlpedido;
    const txid = req.body.data.txid;
    const endtoend = req.body.data.endtoend;
    const codfilial = req.body.data.codfilial;
    //const emailcliente=req.body.data.emailcliente;
    const vlpix = req.body.data.vlpix;
    const duplics = req.body.data.duplicatas;
    const config = {
        "host": host,
        "port": port,
        "secure": secure,
        "user": user,
        "pass": pass,
        "from": from,
        "to": to,
        "cc1": cc1,
        "cc2": cc2,
        "bco": bco,
        "replyto": replyto,
        "subject": subject,
        "text": text
    };
    const parametro = {
        "codcli": codcli,
        "cliente": cliente,
        "numped": numped,
        "vlpedido": vlpedido,
        "txid": txid,
        "endtoend": endtoend,
        "codfilial": codfilial,
        "emailcliente": to,
        "vlpix": vlpix,
        "duplicatas": duplics
    };
    //console.log(obj)
    if (config) {
        res.status(200);
        res.json(config);
        //console.log(parametro)
        functionsActions.DisparoEmail(config, parametro, req, res);
    }
    else {
        res.json({ "ERROR": res });
        res.status(500);
    }
});
//module.exports=ActionRouter
exports.default = ActionRouter;
