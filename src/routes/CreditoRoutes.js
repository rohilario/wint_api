const express = require('express')
const CreditoRouter = express.Router();  
const functions=require('../services/functions')

CreditoRouter.post('/listar/codcli/:codcli/', function (req,res) {
    const codcli=req.params.codcli
    obj={
        "codcli":codcli,
    }
    //console.log(obj)
    if(obj){
      //res.status(200)
      //res.json(req.body.cpfcnpj)
      //functions.InsertPix(obj,req, res); 
      //console.log(req.body.data.cpfcnpj)  
    }else{ 
      res.json({"ERROR":codprod})
      res.status(404)
    }
    
    })


        
module.exports=CreditoRouter