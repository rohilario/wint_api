const express = require('express');
const MilvusRouter = express.Router();  
const functions=require('../services/functions');
const token='w9XsJAY5ns5cxbjM90QyZGirlpLeijrw0e9NlYKZWtOMNr8WnVc5xQIeLip6Jk2KlDv8b7xnq6N8XibB0Rwuo2g7R0TX4dKQcrhqg';
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