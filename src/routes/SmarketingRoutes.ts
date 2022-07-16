const express = require('express')
const SmarketingRouter = express.Router();  
const SmarketingService=require('../services/SmarketingService')

SmarketingRouter.get('/segmento', function (req,res) {

    SmarketingService.getSegmentos(req, res); 

})

SmarketingRouter.get('/loja', function (req,res) {

    SmarketingService.getLojas(req, res); 

})
SmarketingRouter.get('/fornecedor', function (req,res) {

    SmarketingService.getFornecedor(req, res); 

})
SmarketingRouter.get('/categoria', function (req,res){

    SmarketingService.getCategoria(req, res); 

})
SmarketingRouter.get('/produtos_descricao', function (req,res) {

    SmarketingService.getProdutos(req, res); 

})
SmarketingRouter.get('/produtos_preco', function (req,res) {

    SmarketingService.getProdutoPreco(req, res); 

})
SmarketingRouter.get('/produtos_estoque', function (req,res) {

    SmarketingService.getProdutoEstoque(req, res); 

})
SmarketingRouter.get('/produtos_ativo', function (req,res) {

    SmarketingService.getProdutoAtivo(req, res); 

})
SmarketingRouter.get('/produtos_ean', function (req,res) {

    SmarketingService.getProdutoEAN(req, res); 

})
SmarketingRouter.get('/cupom', function (req,res) {

    SmarketingService.getCupom(req, res); 

})

SmarketingRouter.get('/metas', function (req,res) {

    SmarketingService.getMetas(req, res); 

})


        
//module.exports=SmarketingRouter
export default SmarketingRouter