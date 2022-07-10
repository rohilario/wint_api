const express = require('express')
const DuplicatasRouter = express.Router();  
const functions=require('../services/functions')
const duplicfunctions=require('../services/DuplicatasFunctions')

DuplicatasRouter.get('/duplic/codcli/:codcli', function (req,res) {
    const codcli=req.params.codcli
    //console.log(req)

    obj={
        "codcli":codcli
    }
    //console.log(obj)
    if(obj){
      //res.status(200)
      //res.json(obj)
      functions.DuplicatasAbertas(obj,req, res); 
      //console.log(req.body.data.cpfcnpj)  
    }else{ 
      
      res.json({"ERROR":codcli})
      res.status(404)
    }
    
    })

    DuplicatasRouter.get('/duplic/codfilial/:codfilial/codrca/:codrca', function (req,res) {
      const codfilial=req.params.codfilial
      const codrca=req.params.codrca
      //console.log(req)
  
      obj={
          "codrca":codrca
      }
      //console.log(obj)
      if(obj){
        //res.status(200)
        //res.json(obj)
        functions.GetDuplicRCA(obj,req, res); 
        //console.log(req.body.data.cpfcnpj)  
      }else{ 
        
        res.json({"ERROR":codcli})
        res.status(404)
      }
      
      })

      //ENDPOINT PARA BUSCAR DUPLICATAS POR RCA
      DuplicatasRouter.get('/codrca/:codrca/:codcli', function (req,res) {
        const codrca=req.params.codrca
        const codcli=req.params.codcli
        //console.log(req)
    
        obj={
            "codrca":codrca,
            "codcli":codcli
        }
        //console.log(obj)
        if(obj.codrca){
          //res.status(200)
          //res.json(obj)
          duplicfunctions.GetDuplicRCACliente(req, res, obj); 
          //console.log(req.body.data.cpfcnpj)  
        }else{ 
          
          res.json({"ERROR":codcli})
          res.status(404)
        }
        
        })

          //ENDPOINT PARA BUSCAR DUPLICATAS POR RCA
        DuplicatasRouter.get('/aberto/codrca/:codrca', function (req,res) {
        const codrca=req.params.codrca
    
        obj={
            "codrca":codrca,
        }
        //console.log(obj)
        if(obj.codrca){
          //res.status(200)
          //res.json(obj)
          duplicfunctions.getDuplicAbertoRca(req, res, obj); 
          //console.log(req.body.data.cpfcnpj)  
        }else{ 
          
          res.json({"ERROR":codcli})
          res.status(404)
        }
        
        })

      
    

module.exports=DuplicatasRouter;