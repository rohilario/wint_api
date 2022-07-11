const expressClientes = require('express')
const ClienteRouter = expressClientes.Router();  
const clientefunctions=require('../services/ClientesFunctions')
const AppDataSource=require("../config/data-source");
//import AppDataSource  from "../config/data-source"

//import { DataSource } from "typeorm"

      //ENDPOINT PARA BUSCAR DUPLICATAS POR RCA
      ClienteRouter.get('/codrca/:codrca/:codcli', function (req,res) {
        const codrca=req.params.codrca
        const codcli=req.params.codcli
        //console.log(req)
    
        const obj={
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
    
      //ENDPOINT PARA BUSCAR DUPLICATAS POR RC
      ClienteRouter.get('/teste', async function (req:Request,res:Response) {
        let users= await AppDataSource.default.manager.query('SELECT * FROM PCCLIENT C WHERE C.CODCLI=51190')


        console.log(users)
      })


module.exports=ClienteRouter;