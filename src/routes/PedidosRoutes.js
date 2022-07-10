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
          functions.getNumpedFilial(obj,req, res);   
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
      functions.updatePedidoFilial(obj,req, res);   
    }else{ 
      res.json({"UPDATE EMBALAGEM MASTER ERROR":codfilial})
      res.status(404)
    }
    
    })

//PEDIDOS FRENTE DE LOJA - CAIXA - 1432
PedidosRouter.get('/balcaoreserva/codfilial/:codfilial', function (req,res) {
  //const date=req.params.numped
  const codfilial=req.params.codfilial
  //const date=req.body.date
  obj={"codfilial":codfilial}
  if(codfilial){
    //res.json(obj)
    res.status(200)
    functions.PedidosFrenteLoja(obj,req, res);   
  }else{ 
    res.json({"ERROR":codprod})
    res.status(404)
  }
  
  })

  //PEDIDOS POR RCA
PedidosRouter.get('/entrega/rca/codfilial/:codfilial/codrca/:codrca', function (req,res) {
  //const date=req.params.numped
  const codfilial=req.params.codfilial
  const codusur=req.params.codrca
  //const date=req.body.date
  obj={"codfilial":codfilial,"codusur":codusur}
  if(codfilial){
    //res.json(obj)
    res.status(200)
    functions.PedidosRca(obj,req, res);   
  }else{ 
    res.json({"ERROR":codprod})
    res.status(404)
  }
  
  })

   //PEDIDOS FRENTE DE LOJA VENDEDOR BALCAO
PedidosRouter.get('/entrega/rca/codfilial/:codfilial', function (req,res) {
  //const date=req.params.numped
  const codfilial=req.params.codfilial
  //const date=req.body.date
  obj={"codfilial":codfilial}
  if(codfilial){
    //res.json(obj)
    res.status(200)
    functions.PedidosRca(obj,req, res);   
  }else{ 
    res.json({"ERROR":codprod})
    res.status(404)
  }
  
  })

  // LIBERA PEDIDOS
PedidosRouter.post('/liberacao/codfilial/:codfilial/:numped', function (req,res) {
  const codfilial=req.params.codfilial
  const numped=req.params.numped
  const posicao = req.body.posicao
  obj={"codfilial":codfilial,"numped":numped,"posicao":posicao}
  if(codfilial){
    //res.json(obj)
    //res.status(200)
    functions.LiberaPedido(obj,req, res);   
  }else{ 
    res.json({"ERROR":codprod})
    res.status(404)
  }
  
  })

module.exports=PedidosRouter