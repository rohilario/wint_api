const oracledb = require('oracledb');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const axios = require('axios');


  //LIBERA PEDIDO - RETORNO PAGAMENTO
  async function AtualizaPrecoVenda(parametro,req, res) {
    let dtexpiracao = new Date().toLocaleString('pt-BR')
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
        console.log('CONECTADO NO BANCO - ATUALIZA PRECO VENDA - PREDIFY ');        


        
            result_update_produto = await connection.execute(`UPDATE PCTABPR PR SET PR.PTABELA=:1,PR.PTABELA1=(:1-(:1*0.02)),PR.PTABELA2=:1 , PR.DTULTALTPTABELA=SYSDATE WHERE PR.CODPROD=:2 AND PR.NUMREGIAO=:3;`
            ,[parametro.numped],{autoCommit: true});
              if (result_update_produto.affectedRows == 0) {
              console.log('NENHUM PRODUTO ATUALIZADO! - ' + result_update_produto);
              } else {
              console.log('PRODUTO ATUALIZADO COM SUCESSO')
              console.log(result_update_produto)
              return res.send(result_update_produto)
              }
                   
    } catch (err) {
      //send error message
      console.error(err.message + ' - ATUALIZA PRECO VENDA - PREDIFY');
      return  res.send(err);
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO FECHADA COM SUCESSO! - ATUALIZA PRECO VENDA - PREDIFY ');
        } catch (err) {
          console.error(err.message + ' ATUALIZA PRECO VENDA - PREDIFY');
        }
      }
    }
  }

  module.exports={
      AtualizaPrecoVenda:AtualizaPrecoVenda
  }