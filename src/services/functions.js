const oracledb = require('oracledb');
//GET USER WINTHOR POR MATRICULA
async function getFunc(parameter,req, res){
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
  
      console.log('CONCETADO NO BANCO! -- GET MATRICULA');
      // run query to get all employees
      result = await connection.execute("SELECT R.MATRICULA,R.NOME,R.CODIGOPERFIL FROM PCEMPR R WHERE 1=1 AND R.MATRICULA=:1 AND R.CODFILIAL=:2 AND R.CODPERFIL IS NOT NULL",[parameter.matricula,parameter.codfilial]);
      if (result.rows.length == 0) {
        //query return zero employees
        return res.send('NENHUM REGISTRO ENCONTRADO -- GET MATRICULA');
      } else {
        //send all employees
        const doubles = result.rows.map(function(newsql) {
            return {
                    matricula:newsql[0],
                    nome:newsql[1],
                    perfilwms:newsql[2]
            }
        })
        console.log(doubles[0])
        return res.send(doubles);
      }
    } catch (err) {
      //send error message
      return res.send(err.message);
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET MATRICULA');
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  }
  
  //GET PEDIDO POR NUMCAR
  async function getNumpedFilial(parameter,req, res) {
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
  
      console.log('CONCETADO NO BANCO!');
      // run query to get all employees
      result = await connection.execute("SELECT P.NUMPED,P.CODFILIAL,P.CODFILIALNF FROM PCPEDC P WHERE P.NUMCAR=:1",[parameter.numcar]);
      if (result.rows.length == 0) {
        //query return zero employees
        return res.send('NENHUM REGISTRO ENCONTRADO');
      } else {
        //send all employees
        const doubles = result.rows.map(function(newsql) {
            return {
                    numped:newsql[0],
                    codfilial:newsql[1],
                    codfilialnf:newsql[2],
            }
        })
        console.log(doubles[0])
        return res.send(doubles);
      }
    } catch (err) {
      //send error message
      return res.send(err.message);
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO');
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  }
  
  //GET PROD POR CODPROD
  async function getProdut(parameter,req, res) {
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
  
      console.log('CONCETADO NO BANCO!-- GET PROD CODPROD');
      // run query to get all employees
      result = await connection.execute("SELECT P.CODPROD,P.DESCRICAO,P.QTUNITCX FROM PCPRODUT P WHERE P.CODPROD=:1",[parameter.codprod]);
      if (result.rows.length == 0) {
        //query return zero employees
        return res.send('NENHUM REGISTRO ENCONTRADO -- GET PROD CODPROD');
      } else {
        //send all employees
        const doubles = result.rows.map(function(newsql) {
            return {
                    codprod:newsql[0],
                    descricao:newsql[1],
                    unidademaster:newsql[2],
            }
        })
        console.log(doubles[0])
        return res.send(doubles);
      }
    } catch (err) {
      //send error message
      return res.send(err.message);
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET PROD CODPROD');
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  }
  
  //GET PEDIDO POR NUMPED - CODFILIAL != CODFILIALNF
  async function getPedido(parameter,req, res) {
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
      console.log('CONCETADO NO BANCO!-- GET PEDIDO FILIAL DIVERGENTE');
      // run query to get all employees
      result = await connection.execute("SELECT P.NUMPED,P.CODFILIAL,P.CODFILIALNF FROM PCPEDC P WHERE P.CODFILIAL<>CODFILIALNF AND P.POSICAO IN ('L','M') AND P.CODFILIAL IN (1,6,8) AND P.NUMPED=:1",[parameter.numped]);
      if (result.rows.length == 0) {
        //query return zero employees
        objreturn={
          qtdregistro:0,
          msg:"NENHUM REGISTRO ENCONTRADO -- GET PEDIDO FILIAL DIVERGENTE"
        }
        return res.send(objreturn);
      } else {
        //send all employees
        const doubles = result.rows.map(function(newsql) {
            return {
                    numped:newsql[0],
                    codfilial:newsql[1],
                    codfilialnf:newsql[2],
            }
        })
        console.log(doubles[0])
        return res.send(doubles);
      }
    } catch (err) {
      //send error message
      return res.send(err.message);
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET PEDIDO FILIAL DIVERGENTE');
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  }
  
  //UPDATE PROD POR CODPROD - QTD EMBALAGEM MASTER DE COMPRA - 203 WINTHOR
  async function updateProdutQtdMasterCompra(parametro,req, res) {
    
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
    
        console.log('CONECTADO NO BANCO - UPDATE PRODUT EMBALAGEM MASTER');
        if(parametro.novaembalagem  && parametro.codprod!=null){
          console.log('NOVA EMBALAGEM: ' + parametro.novaembalagem)
          console.log('COD PROD: ' + parametro.codprod)
          result = await connection.execute("UPDATE PCPRODUT P SET P.QTUNITCX=:1 WHERE P.CODPROD=:2",[parametro.novaembalagem,parametro.codprod],{autoCommit: true});
          //result = await connection.execute("SELECT P.CODPROD, P.DESCRICAO FROM PCPRODUT P WHERE P.CODPROD=:1",[parametro.codprod],{autoCommit: true});
          if (result.affectedRows == 0) {
            //query return zero employees
            console.log('NENHUM REGISTRO ATUALIZADO! - QTD: ' + result);
          } else {
            console.log(result)
            return res.send(result)
          }
        }else{
          console.log('DIGITE UMA EMBALAGEM OU CODIGO DE PRODUTO VALIDO')
        }
        
                   
    } catch (err) {
      //send error message
      return console.error(err.message + ' UPDATE PRODUT EMBALAGEM MASTER');
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO FECHADA COM SUCESSO! - UPDATE PRODUT EMBALAGEM MASTER');
        } catch (err) {
          console.error(err.message + ' UPDATE PRODUT EMBALAGEM MASTER');
        }
      }
    }
  }
  
  //UPDATE PEDIDO POR NUMPED - CODFILIALNF DIVERGENTE CODFILIAL
  async function updatePedidoFilial(parametro,req, res) {
    
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
    
        console.log('CONECTADO NO BANCO - UPDATE PEDIDO CODFILIAL');
        if(parametro.numped  && parametro.codfilial!=null){
          console.log('NOVA FILIAL: ' + parametro.codfilial)
          console.log('NUMPED: ' + parametro.numped)
          result = await connection.execute("UPDATE PCPEDC P SET P.CODFILIAL=:1 WHERE P.NUMPED=:2",[parametro.codfilial,parametro.numped],{autoCommit: true});
          //result = await connection.execute("SELECT P.CODFILIAL, P.CODFILIALNF FROM PCPEDC P WHERE P.CODFILIAL<>CODFILIALNF AND P.NUMPED=:1",[parametro.numped],{autoCommit: true});
          if (result.affectedRows == 0) {
            //query return zero employees
            console.log('NENHUM REGISTRO ATUALIZADO! UPDATE PEDIDO CODFILIAL - QTD: ' + result);
          } else {
            console.log(result)
            return res.send(result)
          }
        }else{
          console.log('DIGITE UMA EMBALAGEM OU CODIGO DE PRODUTO VALIDO')
        }
        
                   
    } catch (err) {
      //send error message
      return console.error(err.message + ' UPDATE PEDIDO CODFILIAL');
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO FECHADA COM SUCESSO! - UPDATE PEDIDO CODFILIAL');
        } catch (err) {
          console.error(err.message + ' UPDATE PRODUT EMBALAGEM MASTER');
        }
      }
    }
  }
  
  //GET OS POR CODIGO FILIAL - 1759
  async function getOs1759(parameter,req, res) {
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
      console.log('CONCETADO NO BANCO!-- GET OS POR FILIAL - 1759');
      // run query to get all employees
      result = await connection.execute(`SELECT PCMOVENDPEND.DTESTORNO, PCMOVENDPEND.DTINICIOOS,                                                 
      PCMOVENDPEND.POSICAO, PCMOVENDPEND.CODFUNCOS,                                                    
      PCMOVENDPEND.DATA, PCWMS.CODCLI,                                                                 
      PCCLIENT.CLIENTE, NVL(PCTIPOOS.UTILIZACHECKOUT,'N') UTILIZACHECKOUT, PCMOVENDPEND.SEQCONF,     
      PCMOVENDPEND.DTINICIOCONFERENCIA, PCMOVENDPEND.TIPOOS,                                           
      (SELECT NOME FROM PCEMPR WHERE MATRICULA =  PCMOVENDPEND.CODFUNCCOFERENTE) NOME,
      PCMOVENDPEND.NUMPED,PCMOVENDPEND.CODPROD,PCMOVENDPEND.QT                
      FROM PCMOVENDPEND, PCWMS, PCCLIENT, PCTIPOOS                                                          
      WHERE PCMOVENDPEND.NUMOS     = :1                                                                  
      AND PCMOVENDPEND.NUMPED = PCWMS.NUMPED                                                               
      AND PCMOVENDPEND.CODPROD = PCWMS.CODPROD                                                             
      AND PCMOVENDPEND.NUMTRANSWMS = PCWMS.NUMTRANSWMS                                                     
      AND PCMOVENDPEND.TIPOOS      = PCTIPOOS.CODIGO                                                       
      AND PCTIPOOS.UTILIZACHECKOUT = 'S'                                                                 
      AND PCWMS.CODCLI             = PCCLIENT.CODCLI
      AND PCMOVENDPEND.POSICAO <> 'C'
      AND PCMOVENDPEND.DTESTORNO IS NULL                                                       
      AND PCMOVENDPEND.CODFILIAL = :2`,[parameter.numos,parameter.codfilial]);
      if (result.rows.length == 0) {
        //query return zero employees
        objreturn={
          qtdregistro:0,
          msg:"NENHUM REGISTRO ENCONTRADO -- GET OS POR FILIAL 1759"
        }
        return res.send(objreturn);
      } else {
        //send all employees
        const doubles = result.rows.map(function(newsql) {
            return {
                    dtestorno:newsql[0],
                    dtinicioos:newsql[1],
                    posicao:newsql[2],
                    codfuncos:newsql[3],
                    data:newsql[4],
                    codcli:newsql[5],
                    cliente:newsql[6],
                    utilizacheckout:newsql[7],
                    seqconf:newsql[8],
                    dtinicioconferencia:newsql[9],
                    tipoos:newsql[10],
                    nomefunc:newsql[11],
                    numped:newsql[12],
                    codprod:newsql[13],
                    qt:newsql[14],
  
            }
        })
        console.log(doubles[0])
        return res.send(doubles);
      }
    } catch (err) {
      //send error message
      return res.send(err.message);
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET OS POR FILIAL 1759');
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  }
  
  //GET OS POR CODIGO FILIAL - 1759
  async function getOsNumcar1759(parameter,req, res) {
    console.log(parameter.numcar)
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
      console.log('CONCETADO NO BANCO!-- GET OS POR NUMCAR FILIAL - 1759');
      // run query to get all employees
      console.log(parameter)
      result = await connection.execute(`SELECT PCMOVENDPEND.DTESTORNO, PCMOVENDPEND.DTINICIOOS,                                                 
      PCMOVENDPEND.POSICAO, PCMOVENDPEND.CODFUNCOS,                                                    
      PCMOVENDPEND.DATA, PCWMS.CODCLI,                                                                 
      PCCLIENT.CLIENTE, NVL(PCTIPOOS.UTILIZACHECKOUT,'N') UTILIZACHECKOUT, PCMOVENDPEND.SEQCONF,     
      PCMOVENDPEND.DTINICIOCONFERENCIA, PCMOVENDPEND.TIPOOS,                                           
      (SELECT NOME FROM PCEMPR WHERE MATRICULA =  PCMOVENDPEND.CODFUNCCOFERENTE) NOME,
      PCMOVENDPEND.NUMPED,PCMOVENDPEND.CODPROD,PCMOVENDPEND.QT                
      FROM PCMOVENDPEND, PCWMS, PCCLIENT, PCTIPOOS                                                          
      WHERE PCMOVENDPEND.NUMCAR     = :1                                                                  
      AND PCMOVENDPEND.NUMPED = PCWMS.NUMPED                                                               
      AND PCMOVENDPEND.CODPROD = PCWMS.CODPROD                                                             
      AND PCMOVENDPEND.NUMTRANSWMS = PCWMS.NUMTRANSWMS                                                     
      AND PCMOVENDPEND.TIPOOS      = PCTIPOOS.CODIGO                                                       
      AND PCTIPOOS.UTILIZACHECKOUT = 'S'                                                                 
      AND PCWMS.CODCLI             = PCCLIENT.CODCLI
      AND PCMOVENDPEND.POSICAO <> 'C'
      AND PCMOVENDPEND.DTESTORNO IS NULL                                                       
      AND PCMOVENDPEND.CODFILIAL = :2`,[parameter.numcar,parameter.codfilial]);
      if (result.rows.length == 0) {
        //query return zero employees
        objreturn={
          
          qtdregistro:0,
          msg:"NENHUM REGISTRO ENCONTRADO -- GET OS POR NUMCAR FILIAL 1759"
        }
        return res.send(objreturn);
      } else {
        //send all employees
        const doubles = result.rows.map(function(newsql) {
            return {
                    dtestorno:newsql[0],
                    dtinicioos:newsql[1],
                    posicao:newsql[2],
                    codfuncos:newsql[3],
                    data:newsql[4],
                    codcli:newsql[5],
                    cliente:newsql[6],
                    utilizacheckout:newsql[7],
                    seqconf:newsql[8],
                    dtinicioconferencia:newsql[9],
                    tipoos:newsql[10],
                    nomefunc:newsql[11],
                    numped:newsql[12],
                    codprod:newsql[13],
                    qt:newsql[14],
  
            }
        })
        console.log(doubles[0])
        return res.send(doubles);
      }
    } catch (err) {
      //send error message
      return res.send(err.message);
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET OS POR NUMCAR FILIAL 1759');
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  }
  
  //GET AUTORIZACAO PERFIL TIPO OS
  async function getAutorizacaoOs(parameter,req, res) {
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
      console.log('CONCETADO NO BANCO!-- GET AUTORIZACAO PERFIL TIPO OS');
      // run query to get all employees
      result = await connection.execute(`SELECT * FROM PCAUTORIOS`);
      if (result.rows.length == 0) {
        //query return zero employees
        objreturn={
          qtdregistro:0,
          msg:"NENHUM REGISTRO ENCONTRADO -- GET AUTORIZACAO PERFIL TIPO OS"
        }
        return res.send(objreturn);
      } else {
        //send all employees
        const doubles = result.rows.map(function(newsql) {
            return {
                    codtipoos:newsql[0],
                    codperfil:newsql[1],
            }
        })
        console.log(doubles[0])
        return res.send(doubles);
      }
    } catch (err) {
      //send error message
      return res.send(err.message);
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET AUTORIZACAO PERFIL TIPO OS');
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  }

  module.exports={
    getFunc:getFunc,
    getNumpedFilial:getNumpedFilial,
    getProdut:getProdut,
    getPedido:getPedido,
    updateProdutQtdMasterCompra:updateProdutQtdMasterCompra,
    updatePedidoFilial:updatePedidoFilial,
    getOs1759:getOs1759,
    getOsNumcar1759:getOsNumcar1759,
    getAutorizacaoOs:getAutorizacaoOs
  }