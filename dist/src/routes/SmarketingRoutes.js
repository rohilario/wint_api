"use strict";
const express = require('express');
const SmarketingRouter = express.Router();
const functions = require('../services/SmarketingFunctions');
SmarketingRouter.get('/segmento', function (req, res) {
    functions.getSegmentos(req, res);
});
SmarketingRouter.get('/loja', function (req, res) {
    functions.getLojas(req, res);
});
SmarketingRouter.get('/fornecedor', function (req, res) {
    functions.getFornecedor(req, res);
});
SmarketingRouter.get('/categoria', function (req, res) {
    functions.getCategoria(req, res);
});
SmarketingRouter.get('/produtos_descricao', function (req, res) {
    functions.getProdutos(req, res);
});
SmarketingRouter.get('/produtos_preco', function (req, res) {
    functions.getProdutoPreco(req, res);
});
SmarketingRouter.get('/produtos_estoque', function (req, res) {
    functions.getProdutoEstoque(req, res);
});
SmarketingRouter.get('/produtos_ativo', function (req, res) {
    functions.getProdutoAtivo(req, res);
});
SmarketingRouter.get('/produtos_ean', function (req, res) {
    functions.getProdutoEAN(req, res);
});
SmarketingRouter.get('/cupom', function (req, res) {
    functions.getCupom(req, res);
});
SmarketingRouter.get('/metas', function (req, res) {
    functions.getMetas(req, res);
});
module.exports = SmarketingRouter;
