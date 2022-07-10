const express = require('express')
const ClienteRouter = express.Router();  
const clientefunctions=require('../services/ClientesFunctions')

      //ENDPOINT PARA BUSCAR DUPLICATAS POR RCA
      ClienteRouter.get('/codrca/:codrca/:codcli', function (req,res) {
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
          clientefunctions.getClienteRca(req, res, obj); 
          //console.log(req.body.data.cpfcnpj)  
        }else{ 
          
          res.json({"ERROR":codcli})
          res.status(404)
        }
        
        })
    

module.exports=ClienteRouter;