const express = require('express')
const PixBradescoRoutes = express.Router();  
const functions=require('../services/PixBradescoFunctions')

PixBradescoRoutes.get('/token', function (req,res) {

    functions.GetTokenBradesco(req, res); 

})


        
module.exports=PixBradescoRoutes