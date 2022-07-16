const expressLogistic = require('express')
const LogisticRouter = expressLogistic.Router();
const LogisticService=require('../services/Services')

//GET PRODUTOS OS POR OS
LogisticRouter.get('/os/numos/:numos', function (req,res) {
    const numos=req.params.numos
    const codfilial=req.body.codfilial
    //console.log(numos)
    const obj={
      "numos":numos,
      "codfilial":codfilial   
    }
    console.log(obj)
    if(codfilial){
      //res.json(obj)
      res.status(200)
      LogisticService.getOs1759(obj,req, res);   
    }else{ 
      res.json({"UPDATE OS":codfilial})
      res.status(404)
    }
    
    })
  
  //GET PRODUTOS OS POR CARGA
  LogisticRouter.get('/os/numcar/:codfilial/:numcar', function (req,res) {
    const numcar=req.params.numcar
    const codfilial=req.params.codfilial
    //console.log(numos)
    const obj={
      "numcar":numcar,
      "codfilial":codfilial
    }
    console.log(obj)
    if(codfilial){
      //res.json(obj)
      res.status(200)
      LogisticService.getOsNumcar1759(obj,req, res);   
    }else{ 
      res.json({"UPDATE OS":codfilial})
      res.status(404)
    }
    
    })

    LogisticRouter.put('/finalizaos1759/os/numcar/:numcar', function (req,res) {
      const numcar=req.params.numcar
      const codfunc=req.body.codfunc
      //console.log(numcar,codfunc)
      const obj={numcar:numcar,codfunc:codfunc}
      //res.json(obj)
      console.log(obj)
      LogisticService.FinalizaOS1759(obj,req,res);
      //res.json("DADOS ATUALIZADOS COM SUCESSO!")
      })
      

export default LogisticRouter