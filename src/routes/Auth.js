const express = require('express')
const AuthRouter = express.Router();  
const auth=require('../services/auth')

AuthRouter.post('/token/create', function (req,res) {

    obj={

    }
    //console.log(obj)
    if(obj){
      //res.status(200)
      //res.json(req.body.cpfcnpj)
      //auth.CreateJWT(obj,req, res); 
      //console.log(req.body.data.cpfcnpj)  
        }else{res.json({"ERROR":codprod});res.status(404)}
    
})

AuthRouter.post('/token/autenticate', function (req,res) {

    obj={

    }
    //console.log(obj)
    if(obj){
      //res.status(200)
      //res.json(req.body.cpfcnpj)
      //auth.verifyJWT(obj,req, res); 
      //console.log(req.body.data.cpfcnpj)  
        }else{res.json({"ERROR":codprod});res.status(404)}
    
})

module.exports=AuthRouter