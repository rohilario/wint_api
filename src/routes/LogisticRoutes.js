const express = require('express')
const LogisticRouter = express.Router();
const funcao=require('../services/functions')

//GET PRODUTOS OS POR OS
LogisticRouter.get('/os/numos/:numos', function (req,res) {
    const numos=req.params.numos
    const codfilial=req.body.codfilial
    //console.log(numos)
    obj={
      "numos":numos,
      "codfilial":codfilial   
    }
    console.log(obj)
    if(codfilial){
      //res.json(obj)
      res.status(200)
      funcao.getOs1759(obj,req, res);   
    }else{ 
      res.json({"UPDATE OS":codfilial})
      res.status(404)
    }
    
    })
  
  //GET PRODUTOS OS POR CARGA
  LogisticRouter.get('/os/numcar/:numcar', function (req,res) {
    const numcar=req.params.numcar
    const codfilial=req.body.codfilial
    //console.log(numos)
    obj={
      "numcar":numcar,
      "codfilial":codfilial
    }
    console.log(obj)
    if(codfilial){
      //res.json(obj)
      res.status(200)
      funcao.getOsNumcar1759(obj,req, res);   
    }else{ 
      res.json({"UPDATE OS":codfilial})
      res.status(404)
    }
    
    })

module.exports = LogisticRouter