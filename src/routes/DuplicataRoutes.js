const express = require('express')
const DuplicatasRouter = express.Router();  
const functions=require('../services/functions')

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

module.exports=DuplicatasRouter;