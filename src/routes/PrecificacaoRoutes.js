const express = require('express');
const { PedidosFrenteLojaVendedorBalcao } = require('../services/functions');
const PrecificacaoRoutes = express.Router();  
const helpers=require('../services/PrecificacaoFunctions')

PrecificacaoRoutes.post('/regiao/:regiao/:codprod', function (req,res) {
    const regiao=req.params.regiao
    const codprod=req.params.codprod
    const pvenda=req.body.pvenda
    obj={"numregiao":regiao,"codprod":codprod,"pvenda":pvenda}
    if(obj.pvenda){
      //res.json(obj)
      //res.status(200)
      //helpers.AtualizaPrecoVenda(obj,req,res)
    }else{ 
      res.json({"ERROR":obj.pvenda})
      res.status(404)
    }
    
    })

module.exports=PrecificacaoRoutes