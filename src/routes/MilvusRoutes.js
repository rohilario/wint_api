const express = require('express');
const MilvusRouter = express.Router();  
const functions=require('../services/functions');
const token='';
MilvusRouter.get('/chamados', function (req,res) {
    objmilvus={"token":token}

    if(objmilvus){
      //res.status(200)
      //res.json(req.body.cpfcnpj)
      functions.Milvus(objmilvus,req, res); 
      //console.log(req.body.data.cpfcnpj)  
    }else{ 
      res.json({"ERROR":codprod})
      res.status(404)
    }    
    })

module.exports=MilvusRouter
