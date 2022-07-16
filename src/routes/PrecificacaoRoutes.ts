const expressPrecificacao = require('express');
const PrecificacaoRouter = expressPrecificacao.Router();  
const PrecificacaoService=require('../services/PrecificacaoService')

PrecificacaoRouter.post('/regiao/:regiao/:codprod', function (req,res) {
    const regiao=req.params.regiao
    const codprod=req.params.codprod
    const pvenda=req.body.pvenda
    const obj={"numregiao":regiao,"codprod":codprod,"pvenda":pvenda}
    if(obj.pvenda){
      //res.json(obj)
      //res.status(200)
      //PrecificacaoService.AtualizaPrecoVenda(obj,req,res)
    }else{ 
      res.json({"ERROR":obj.pvenda})
      res.status(404)
    }
    
    })

//module.exports=PrecificacaoRouter
export default PrecificacaoRouter