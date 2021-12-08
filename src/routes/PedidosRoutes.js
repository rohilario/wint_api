const express = require('express')
const PedidosRouter = express.Router();  
const functions=require('../services/functions')
  
// PEDIDO POR NUMPED - PEDIDOS COM FILIAIS DIVERGENTES
PedidosRouter.post('/numped', function (req,res) {
    const numped=req.body.numped
    obj={"numped":numped}
    if(numped){
      //res.json(obj)
      res.status(200)
      functions.getPedido(obj,req, res);   
    }else{ 
      res.json({"ERROR":codprod})
      res.status(404)
    }
    
    })

    PedidosRouter.post('/numpedfilial', function (req,res) {
        const numcar=req.body.numcar
        obj={
          "numcar":numcar     
        }
        if(numcar){
          //res.json(obj)
          res.status(200)
          getNumpedFilial(obj,req, res);   
        }else{ 
          res.json({"ERROR":numcar})
          res.status(404)
        }
        
        })

        //UPDATE PEDIDO FILIAL DIVERGENTE - POR NUMPED
    PedidosRouter.put('/numped/:id', function (req,res) {
    const numped=req.params.id
    const codfilial=req.body.codfilial
    console.log(numped)
    obj={
      "numped":numped,
      "codfilial":codfilial   
    }
    console.log(obj)
    if(codfilial){
      //res.json(obj)
      res.status(200)
      updatePedidoFilial(obj,req, res);   
    }else{ 
      res.json({"UPDATE EMBALAGEM MASTER ERROR":codfilial})
      res.status(404)
    }
    
    })

module.exports=PedidosRouter