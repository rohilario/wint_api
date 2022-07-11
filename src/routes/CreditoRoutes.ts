const expressCreditos = require('express')
const CreditoRouter = expressCreditos.Router();  
const functionsCreditos=require('../services/functions')

CreditoRouter.post('/listar/codcli/:codcli/', function (req,res) {
    const codcli=req.params.codcli
    const obj={
        "codcli":codcli,
    }
    //console.log(obj)
    if(obj){
      //res.status(200)
      //res.json(req.body.cpfcnpj)
      //functionsCreditos.InsertPix(obj,req, res); 
      //console.log(req.body.data.cpfcnpj)  
    }else{ 
      res.status(404)
    }
    
    })


        
module.exports=CreditoRouter