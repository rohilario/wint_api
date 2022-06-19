const express = require('express')
const AuthRouter = express.Router();  
const functions=require('../services/auth')


AuthRouter.post('/token/create', function (req,res) {
  const usr=req.body.usr;
  const pass=req.body.pass
  const auth={usr:usr,pass:pass}

  //console.log(auth)

  functions.validUser(req,res,auth)

})

AuthRouter.get('/token/autenticate', functions.verifyJWT,function (req,res) {
  
    if(obj){
      //res.status(200)
      //res.json(req.body.cpfcnpj)
      //auth.verifyJWT(obj,req, res); 
      //console.log(req.body.data.cpfcnpj)  
        }else{res.json({"ERROR":codprod});res.status(404)}
    
})

module.exports=AuthRouter