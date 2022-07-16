"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expressPrecificacao = require('express');
const PrecificacaoRouter = expressPrecificacao.Router();
const helpers = require('../services/PrecificacaoFunctions');
PrecificacaoRouter.post('/regiao/:regiao/:codprod', function (req, res) {
    const regiao = req.params.regiao;
    const codprod = req.params.codprod;
    const pvenda = req.body.pvenda;
    const obj = { "numregiao": regiao, "codprod": codprod, "pvenda": pvenda };
    if (obj.pvenda) {
        //res.json(obj)
        //res.status(200)
        //helpers.AtualizaPrecoVenda(obj,req,res)
    }
    else {
        res.json({ "ERROR": obj.pvenda });
        res.status(404);
    }
});
//module.exports=PrecificacaoRouter
exports.default = PrecificacaoRouter;
