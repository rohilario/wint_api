const express = require('express')
const PixRouter = express.Router();  
const functions=require('../services/functions')

PixRouter.post('/numped/:numped/codfilial/:codfilial', function (req,res) {
    //const date=req.params.numped
    //console.log(req)
    const codfilial=req.params.codfilial
    const numped=req.params.numped
    const txid=req.body.data.txid
    const vlpix=req.body.data.vlpix
    const cpfcnpj=req.body.data.cpfcnpj
    const txtimgqrcode=req.body.data.txtimgqrcode
    const numrevisao=req.body.data.numrevisao
    const status=req.body.data.status
    const dtexpiracao=req.body.data.dtexpiracao
    const obspix=req.body.data.obspix
    const dtcriacaopix=req.body.data.dtcriacaopix
    const codfuncpix=req.body.data.codfuncpix
    const expiration_time=req.body.data.expiration_time

    obj={
        "codfilial":codfilial,
        "numped":numped,
        "txid":txid,
        "vlpix":vlpix,
        "cpfcnpj":cpfcnpj,
        "txtimgqrcode":txtimgqrcode,
        "numrevisao":numrevisao,
        "status":status,
        "dtexpiracao":dtexpiracao,
        "obspix":obspix,
        "dtcriacaopix":dtcriacaopix,
        "codfuncpix":codfuncpix,
        "expiration_time":expiration_time,
    }
    //console.log(obj)
    if(obj){
      //res.status(200)
      //res.json(req.body.cpfcnpj)
      functions.InsertPix(obj,req, res); 
      //console.log(req.body.data.cpfcnpj)  
    }else{ 
      res.json({"ERROR":codprod})
      res.status(404)
    }
    
    })

    PixRouter.post('/credito/numped/:numped/codfilial/:codfilial', function (req,res) {
      const numped=req.params.numped
      const codfilial=req.params.codfilial
      const codcli=req.body.codcli
      const codhistorico=req.body.codhistorico
      const codbanco=req.body.codbanco
      const valor=req.body.valor
      const matricula=req.body.matricula
      const situacao=req.body.situacao

      obj={
        "numped":numped,
        "codfilial":codfilial,
        "codcli":codcli,
        "codhistorico":codhistorico,
        "codbanco":codbanco,
        "valor":valor,
        "matricula":matricula,
        "situacao":situacao
      }
  
      if(obj){
        //res.status(200)
        //res.json(obj)
        functions.geraCredito618(obj,req, res); 
        //console.log(obj)  
      }else{ 
        res.json({"ERROR":codprod})
        res.status(404)
      }
      
      })

      PixRouter.post('/baixa/txid/:txid', function (req,res) {
        const txid=req.params.txid
        const status=req.body.data.status
        const matricula=req.body.data.matricula
        const valor=req.body.data.valor
        const idpagpix=req.body.data.idpagpix
        const dthrpagpix=req.body.data.dthrpagpix
  
        obj={
          "txid":txid,
          "status":status,
          "matricula":matricula,
          "valor":valor,
          "idpagpix":idpagpix,
          "dthrpagpix":dthrpagpix,
        }
    
        if(obj){
          //res.status(200)
          //res.json(obj)
          functions.UpdatePixBaixa(obj,req, res); 
          //console.log(obj)  
        }else{ 
          res.json({"ERROR":codprod})
          res.status(404)
        }
        
        })
        //Ver Pixes Feitos - Winthor
        PixRouter.post('/consulta/filial/:codfilial', function (req,res) {

          obj={

          }
      
          if(obj){
            //res.status(200)
            //res.json(obj)
            //functions.getPixWinthor(obj,req, res); 
            //console.log(obj)  
          }else{ 
            res.json({"ERROR":codprod})
            res.status(404)
          }
          
          })

          PixRouter.post('/baixa_teste', function (req,res) {
            const txid=req.params.txid
            const status=req.body.data.status
            const matricula=req.body.data.matricula
            const valor=req.body.data.valor
            const idpagpix=req.body.data.idpagpix
            const dthrpagpix=req.body.data.dthrpagpix
      
            obj={
              "txid":txid,
              "status":status,
              "matricula":matricula,
              "valor":valor,
              "idpagpix":idpagpix,
              "dthrpagpix":dthrpagpix,
            }
        
            if(obj){
              //res.status(200)
              //res.json(obj)
              functions.UpdateEstcr(obj,req, res); 
              //console.log(obj)  
            }else{ 
              res.json({"ERROR":codprod})
              res.status(404)
            }
            
            })
      

        
module.exports=PixRouter