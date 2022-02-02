const express = require('express')
const RegistrationRouter = express.Router();  
const functions=require('../services/functions')
  
  //GET FUNC POR FILIAL
  RegistrationRouter.get('/func/:codfilial/:matricula', function (req,res) {
    const matricula=req.params.matricula
    const codfilial=req.params.codfilial
    //console.log(req.body)
    obj={"matricula":matricula,"codfilial":codfilial}
    console.log(obj)
    if(codfilial){
      //res.json(obj)
      res.status(200)
      functions.getFunc(obj,req, res);   
    }else{ 
      res.json({"GET FUNC ERROR":matricula})
      res.status(404)
    }
    
    })

    // PRODUTO POR ID - CODPROD WINTHOR
RegistrationRouter.post('/produt/codprod', function (req,res) {
    //console.log('teste')
    const codprod=req.body.codprod
    console.log(codprod)
    console.log(req.body)
    obj={
      "codprod":codprod     
    }
    if(codprod){
      //res.json(obj)
      res.status(200)
      functions.getProdut(obj,req, res);   
    }else{ 
      res.json({"ERROR":codprod})
      res.status(404)
    }
    
    })

    //UPDATE UNIDADE MASTER EMB. COMPRA - POR ID CODPROD
    RegistrationRouter.put('/produt/codprod/:id', function (req,res) {
    const codprod=req.params.id
    const novaembalagem=req.body.novaembalagem
    //console.log(codprod)
    obj={
      "codprod":codprod,
      "novaembalagem":novaembalagem   
    }
    //console.log(obj)
    if(codprod){
      //res.json(obj)
      res.status(200)
      functions.updateProdutQtdMasterCompra(obj,req, res);   
    }else{ 
      res.json({"UPDATE EMBALAGEM MASTER ERROR":codprod})
      res.status(404)
    }
    
    })

      //GET CLIENTE id
  RegistrationRouter.get('/cliente/id/:id', function (req,res) {
    const id=req.params.id
    //console.log(req.body)
    obj={"id":id}
    console.log(obj)
    if(id){
      //res.json(obj)
      //res.status(200)
      functions.getClienteId(obj,req, res);   
    }else{ 
      res.json({"GET FUNC ERROR":codcli})
      res.status(404)
    }
    
    })

          //GET CLIENTE BUSCA POR NOME
  RegistrationRouter.get('/cliente/nome/:nome', function (req,res) {
    const nome=req.params.nome
    if(nome!=null){
      //res.json(obj)
      //res.status(200)
      obj={"nome":'%'+nome+'%'}
      functions.getClienteNome(obj,req, res);
    }else{
      res.json({"nome":nome,"msg":"digite mais campos"})
      //res.status(404) 
    }    
    })

      //GET CLIENTE ATIVOS
      RegistrationRouter.get('/clientes', function (req,res) {     
          functions.getClientes(req, res);   
        })

module.exports=RegistrationRouter