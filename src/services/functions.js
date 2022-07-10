const oracledb = require('oracledb');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const axios = require('axios');

  //GET USER WINTHOR POR NOME
  async function getUserAuth(req, res, auth){
    //console.log(auth)
    let connection;
    
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
      console.log('CONCETADO NO BANCO! -- GET USER AUTH');
      result = await connection.execute(`SELECT R.NOME,R.NOME_GUERRA,DECRYPT(R.SENHABD,:1),R.MATRICULA FROM PCEMPR R WHERE 
      R.USUARIOBD=:1 --AND LTRIM(RTRIM(UPPER(R.USUARIOBD))) = :1
      AND R.DT_EXCLUSAO IS NULL AND R.SITUACAO='A' AND R.CODSETOR=8 AND R.USUARIOBD=:1`,[auth.usr]);
  
      if (result.rows.length == 0) {
        //query return zero employees
        return [{nome:null,pass:null,msg:'NAO FOI LOCALIZADO NENHUM REGISTRO PARA OS PARAMETROS INFORMADOS'}]//res.json('NENHUM REGISTRO ENCONTRADO -- GET CLIENTE NOME');
      } else {
        //send all employees
        const user = result.rows.map(function(newsql) {
            return {
                    nome:newsql[0],
                    nomeguerra:newsql[1],
                    pass:newsql[2],
                    matricula:newsql[3],
            }
        })
        //console.log(user[0])
        console.log('AUTENTICADO COM SUCESSO! -- GET USER AUTH')
        return user;
      }
    
    } catch (err) {
      //send error message
      return res.send(err.message);
    } finally {
      if (connection) {
        try {
          // Always close connections
          //await connection.close();
          //console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET CLIENTE NOME');
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  }

  //GET RCA WINTHOR POR NOME
  async function getRCAAuth(req, res, auth){
    //console.log(auth)
    let connection;
    
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
      console.log('CONCETADO NO BANCO! -- GET RCA AUTH');
      result = await connection.execute(`SELECT U.CODUSUR,U.NOME,U.EMAIL FROM PCUSUARI U WHERE U.DTEXCLUSAO IS NULL AND U.BLOQUEIO='N' AND U.CODUSUR=:1`,[auth.pass]);
  
      if (result.rows.length == 0) {
        //query return zero employees
        return [{nome:null,pass:null,msg:'NAO FOI LOCALIZADO NENHUM REGISTRO PARA OS PARAMETROS INFORMADOS'}]//res.json('NENHUM REGISTRO ENCONTRADO -- GET CLIENTE NOME');
      } else {
        //send all employees
        const user = result.rows.map(function(newsql) {
            return {
                    codrca:newsql[0],
                    email:newsql[2],
                    nome:newsql[1],
                    pass:newsql[0],
            }
        })
        if(auth.usr===user[0].email){
          console.log('AUTENTICADO COM SUCESSO! -- GET RCA AUTH')
          return user;
        }else{
          console.log('USUARIO OU SENHAS INVALIDAS -- GET RCA AUTH')
          return user;
        }

      }
    
    } catch (err) {
      //send error message
      return res.send(err.message);
    } finally {
      if (connection) {
        try {
          // Always close connections
          //await connection.close();
          //console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET CLIENTE NOME');
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  }

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
      PCMOVENDPEND.NUMPED,PCMOVENDPEND.CODPROD,PCMOVENDPEND.QT,
      PCMOVENDPEND.NUMOS,PCMOVENDPEND.NUMCAR                
      ,(SELECT E.ESTACAO FROM PCENDERECO E WHERE E.CODENDERECO=PCMOVENDPEND.CODENDERECO) AS ESTACAO
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
      AND (SELECT END.ESTACAO FROM PCENDERECO END WHERE END.CODENDERECO=PCMOVENDPEND.CODENDERECO)=3                                                       
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
                    numos:newsql[15],
                    numcar:newsql[16],
                    estacao:newsql[17]
  
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

  
  function BuscaFoto(obj,req, res){
    if (!fs.existsSync(obj.product)){
       console.log("SEM DIRETORIO - ",obj.product );
        return;
    }

    var files=fs.readdirSync(obj.dirpath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(obj.dirpath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
          BuscaFoto(filename,obj.product); //recurse
        }
        else if (filename.indexOf(obj.product)>=0) {
            console.log('Arquivo Encontrado:',filename);
            return res.send(filename);
        };
    };
};

  //UPDATE PROD POR CODPROD - QTD EMBALAGEM MASTER DE COMPRA - 203 WINTHOR
  async function FinalizaOS1759(parametro,req, res) {
    
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
        console.log(parametro)
        console.log('CONECTADO NO BANCO - FINALIZA OS 1759');
        if(parametro.codfunc  && parametro.numcar!=null){
          console.log('CARREGAMENTO: ' + parametro.numcar + ' CODFUNC:' + parametro.codfunc)
          result_finalizaos = await connection.execute(`UPDATE PCMOVENDPEND M SET M.DTINICIOOS = SYSDATE, M.CODFUNCOS = :1, 
          M.CODFUNCCOFERENTE = :2, M.CODFUNCCONF = :3
          ,M.CODFUNCEMBALADOR = :4, M.DTINICIOCONFERENCIA = SYSDATE
          ,M.POSICAO = 'A',M.CODFUNCOSFIM = :5,M.DTFIMOSFILA = SYSDATE,M.GRUPOESTFIMOS = 03,M.DTFIMSEPARACAO = NVL(DTFIMSEPARACAO, SysDate)
          ,M.QTCONFERIDA = M.QT,M.DTFIMCONFERENCIA=SYSDATE,
          M.NUMVOL=(SELECT SUM(MM.QT) FROM PCMOVENDPEND MM,PCENDERECO ENDD WHERE ENDD.CODENDERECO=MM.CODENDERECO AND ENDD.ESTACAO=3 AND MM.NUMCAR=M.NUMCAR AND MM.NUMOS=M.NUMOS GROUP BY MM.NUMOS)
          WHERE M.NUMCAR=:6 AND M.POSICAO = 'P' AND M.DTESTORNO IS NULL 
          AND (SELECT END.ESTACAO FROM PCENDERECO END WHERE END.CODENDERECO=M.CODENDERECO)=3`,[parametro.codfunc,parametro.codfunc,parametro.codfunc,parametro.codfunc,parametro.codfunc,parametro.numcar],{autoCommit: true});  
          
          if (result_finalizaos.affectedRows == 0){

            console.log('NENHUM REGISTRO ATUALIZADO! - QTD: ' + result_finalizaos);
          } else {
            //console.log(result_finalizaos)
            result_pcpedi= await connection.execute('UPDATE PCPEDI SET CODFUNCSEP=:1,CODFUNCCONF=:2, DATACONF=SYSDATE WHERE NUMCAR=:3 AND CODPROD=(SELECT M.CODPROD FROM PCMOVENDPEND M, PCENDERECO E WHERE M.NUMCAR=448122 AND M.CODENDERECO=E.CODENDERECO AND E.ESTACAO=3)',[parametro.codfunc,parametro.codfunc,parametro.numcar],{autoCommit:true})
            result_pcpedc= await connection.execute('UPDATE PCPEDC SET CODFUNCCONF = :1 WHERE NUMCAR=:2 AND NUMPED=(SELECT M.NUMPED FROM PCMOVENDPEND M, PCENDERECO E WHERE M.NUMCAR=:3 AND M.CODENDERECO=E.CODENDERECO AND E.ESTACAO=3)            ',[parametro.codfunc,parametro.numcar,parametro.numcar],{autoCommit:true})      
            let retorno={"PCMOVENDPEND":result_finalizaos,"PCPEDC":result_pcpedc,"PCPEDI":result_pcpedi}
            console.log(retorno)
            return res.send(retorno)
            }
        }else{
          console.log('DIGITE UM CARREGAMENTO VALIDO')
        }
        
                   
    } catch (err) {
      //send error message
      return console.error(err.message + ' ERRO FINALIZA OS 1759');
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO FECHADA COM SUCESSO! - FINALIZA OS 1759');
        } catch (err) {
          console.error(err.message + ' FINALIZA OS 1759');
        }
      }
    }
  }

//GET PEDIDOS PARA FATURAMENTO POR PIX - FRENTE DE LOJA - 1432
async function PedidosFrenteLoja(parameter,req, res){
  try {
    connection = await oracledb.getConnection({
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
      connectString: process.env.CONNECTSTRING
    });
    //session = await connection.execute("select value from nls_session_parameters where parameter = 'NLS_NUMERIC_CHARACTERS'");
    //alter_session = await connection.execute("ALTER SESSION SET NLS_NUMERIC_CHARACTERS = '.,'");
    //after_session = await connection.execute("select value as value_after from nls_session_parameters where parameter = 'NLS_NUMERIC_CHARACTERS'");
    console.log('CONCETADO NO BANCO! -- GET PEDIDO FRENTE DE LOJA');
    // run query to get all employees
    result = await connection.execute(
    `SELECT P.CODFILIAL,P.NUMPED,P.VLATEND AS VALORTOTALPED,P.CODCLI,C.CLIENTE,P.DATA,P.POSICAO,P.ORIGEMPED,M.POSICAO AS POSICAOOS,REPLACE(REPLACE(REPLACE(C.CGCENT,'.',''),'/',''),'-','') AS CGCENT,C.EMAILNFE
    FROM PCPEDC P, PCCLIENT C, PCMOVENDPEND M
    WHERE C.CODCLI=P.CODCLI AND P.NUMPED=M.NUMPED
    AND P.POSICAO='M' AND P.ORIGEMPED='R' AND M.POSICAO = 'C'
    --AND P.DATA=:1 
    AND P.CODFILIAL=:1
    GROUP BY M.POSICAO,P.CODFILIAL,P.NUMPED,P.CODCLI,C.CLIENTE,P.DATA,P.POSICAO,P.ORIGEMPED,P.VLATEND,C.CGCENT,C.EMAILNFE`,[parameter.codfilial]);
    if (result.rows.length == 0) {
      //query return zero employees
      return res.send('NENHUM REGISTRO ENCONTRADO -- GET PEDIDO FRENTE DE LOJA');
    } else {
      console.log("PEDIDOS ENCONTRADOS: " + result.rows.length)
      //send all employees
      const doubles = result.rows.map(function(newsql) {
          return {
                  CODFILIAL:newsql[0],
                  NUMPED:newsql[1],
                  VALORTOTAL:newsql[2],
                  CODCLI:newsql[3],
                  CLIENTE:newsql[4],
                  DATAPED:newsql[5],
                  POSICAOPED:newsql[6],
                  ORIGEMPED:newsql[7],
                  POSICAOOS:newsql[8],
                  CPFCNPJ:newsql[9],
                  EMAILNFE:newsql[10],
                  
          }
      })
      //console.log(session)
      //console.log(alter_session)
      console.log(doubles)
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
        console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET PEDIDO FRENTE DE LOJA');
      } catch (err) {
        console.error(err.message);
      }
    }
  }
}

//GET PEDIDOS PARA FATURAMENTO POR PIX - FRENTE DE LOJA - VENDEDOR BALCAO
async function PedidosFrenteLojaVendedorBalcao(parameter,req, res){
  try {
    connection = await oracledb.getConnection({
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
      connectString: process.env.CONNECTSTRING
    });
    session = await connection.execute("select value from nls_session_parameters where parameter = 'NLS_NUMERIC_CHARACTERS'");
    alter_session = await connection.execute("ALTER SESSION SET NLS_NUMERIC_CHARACTERS = '.,'");
    after_session = await connection.execute("select value as value_after from nls_session_parameters where parameter = 'NLS_NUMERIC_CHARACTERS'");
    console.log('CONCETADO NO BANCO! -- GET PEDIDO FRENTE DE LOJA');
    // run query to get all employees
    result = await connection.execute(
    `SELECT P.CODFILIAL,P.NUMPED,P.VLATEND AS VALORTOTALPED,P.CODCLI,C.CLIENTE,P.DATA,P.POSICAO,P.ORIGEMPED,'C' AS POSICAOOS,REPLACE(REPLACE(REPLACE(C.CGCENT,'.',''),'/',''),'-','') AS CGCENT,C.EMAILNFE
    FROM PCPEDC P, PCCLIENT C
    WHERE C.CODCLI=P.CODCLI
    AND P.POSICAO IN ('B','L','M') AND P.ORIGEMPED='R'
    --AND P.DATA=:1 
    AND P.CODFILIAL=:1
    GROUP BY P.CODFILIAL,P.NUMPED,P.CODCLI,C.CLIENTE,P.DATA,P.POSICAO,P.ORIGEMPED,P.VLATEND,C.CGCENT,C.EMAILNFE`,[parameter.codfilial]);
    if (result.rows.length == 0) {
      //query return zero employees
      return res.send('NENHUM REGISTRO ENCONTRADO -- GET PEDIDO FRENTE DE LOJA');
    } else {
      console.log("PEDIDOS ENCONTRADOS: " + result.rows.length)
      //send all employees
      const doubles = result.rows.map(function(newsql) {
          return {
                  CODFILIAL:newsql[0],
                  NUMPED:newsql[1],
                  VALORTOTAL:newsql[2],
                  CODCLI:newsql[3],
                  CLIENTE:newsql[4],
                  DATAPED:newsql[5],
                  POSICAOPED:newsql[6],
                  ORIGEMPED:newsql[7],
                  POSICAOOS:newsql[8],
                  CPFCNPJ:newsql[9],
                  EMAILNFE:newsql[10],
                  
          }
      })
      //console.log(session)
      //console.log(alter_session)
      //console.log(after_session)
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
        console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET PEDIDO FRENTE DE LOJA');
      } catch (err) {
        console.error(err.message);
      }
    }
  }
}

//GET PEDIDOS PARA FATURAMENTO POR PIX - PEDIDOS RCA - VENDAS EXTERNAS
async function PedidosRca(parameter,req, res){
  try {
    connection = await oracledb.getConnection({
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
      connectString: process.env.CONNECTSTRING
    });
    //session = await connection.execute("select value from nls_session_parameters where parameter = 'NLS_NUMERIC_CHARACTERS'");
    //alter_session = await connection.execute("ALTER SESSION SET NLS_NUMERIC_CHARACTERS = '.,'");
    //after_session = await connection.execute("select value as value_after from nls_session_parameters where parameter = 'NLS_NUMERIC_CHARACTERS'");
    console.log('CONCETADO NO BANCO! -- GET PEDIDO FRENTE DE LOJA');
    // run query to get all employees
    result = await connection.execute(
    `SELECT P.CODFILIAL,P.NUMPED,P.VLATEND AS VALORTOTALPED,P.CODCLI,C.CLIENTE,P.DATA,P.POSICAO,P.ORIGEMPED,'C' AS POSICAOOS,REPLACE(REPLACE(REPLACE(C.CGCENT,'.',''),'/',''),'-','') AS CGCENT
    FROM PCPEDC P, PCCLIENT C
    WHERE C.CODCLI=P.CODCLI
    AND P.POSICAO IN ('B','L','P','M') AND P.ORIGEMPED IN ('F','T','W','R')
    --AND P.DATA=:1
    --AND C.MOTIVOBLOQ NOT LIKE '%Cliente bloqueado, pois existia pelo menos um título em atraso%' 
    AND P.CODFILIAL=:1
    AND P.CODUSUR=:2
    GROUP BY P.CODFILIAL,P.NUMPED,P.CODCLI,C.CLIENTE,P.DATA,P.POSICAO,P.ORIGEMPED,P.VLATEND,C.CGCENT`,[parameter.codfilial,parameter.codusur]);
    if (result.rows.length == 0) {
      //query return zero employees
      return res.send('NENHUM REGISTRO ENCONTRADO -- GET PEDIDO FRENTE DE LOJA');
    } else {
      console.log("PEDIDOS ENCONTRADOS: " + result.rows.length)
      //send all employees
      const doubles = result.rows.map(function(newsql) {
          return {
                  CODFILIAL:newsql[0],
                  NUMPED:newsql[1],
                  VALORTOTAL:newsql[2],
                  CODCLI:newsql[3],
                  CLIENTE:newsql[4],
                  DATAPED:newsql[5],
                  POSICAOPED:newsql[6],
                  ORIGEMPED:newsql[7],
                  POSICAOOS:newsql[8],
                  CPFCNPJ:newsql[9],
                  
          }
      })
      //console.log(session)
      //console.log(alter_session)
      //console.log(after_session)
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
        console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET PEDIDO FRENTE DE LOJA');
      } catch (err) {
        console.error(err.message);
      }
    }
  }
}

  //INSERT PIX GERADOS - FRENTE DE LOJA
  async function InsertPix(parametro,req, res) {
    //console.log(parametro)
    let dtexpiracao = new Date().toLocaleString('pt-BR')
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
    
        console.log('CONECTADO NO BANCO - InsertPix');
        if(parametro.txid!=null  && parametro.codfilial!=null){
          console.log(parametro)
          result = await connection.execute(`INSERT INTO PIX(
            pixid,txid ,numped,vlpix,cpfcnpj,txtimgqrcode,
            numrevisao,status,dtexpiracao,obspix,dtcriacaopix,codfilial,codfuncpix,expiration_time,banco,tipopix) 
            VALUES (
            (SELECT (MAX(P.PIXID)+1) FROM PIX P),:1,:2,:3,:4,
            :5,:6,:7,:8,:9,:10,:11,:12,:13,:14,:15)`,
            [parametro.txid,parametro.numped,parametro.vlpix,parametro.cpfcnpj,parametro.txtimgqrcode
            ,parametro.numrevisao,parametro.status,dtexpiracao,parametro.obspix,parametro.dtcriacaopix
            ,parametro.codfilial,parametro.codfuncpix,parametro.expiration_time,parametro.banco,parametro.tipopix]
            ,{autoCommit: true});
          if (result.affectedRows == 0) {
            
            console.log('NENHUM PIX INSERRIDO! - QTD: ' + result);
          } else {
            console.log(result)
            return res.send(result)
          }
        }else{
          console.log('DADOS INVALIDOS - REVEJA OS PARAMETROS PASSADOS')
          return res.status(400).send(result)
        }
                   
    } catch (err) {
      //send error message
      console.error(err.message + ' - InsertPix');
      return  res.send(err) 
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO FECHADA COM SUCESSO! - InsertPix');
        } catch (err) {
          console.error(err.message + ' InsertPix');
        }
      }
    }
  }

  //INSERT PIX GERADOS - FRENTE DE LOJA
  async function InsertPix(parametro,req, res) {
    //console.log(parametro)
    let dtexpiracao = new Date().toLocaleString('pt-BR')
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
    
        console.log('CONECTADO NO BANCO - InsertPix');
        if(parametro.txid!=null  && parametro.codfilial!=null){
          console.log(parametro)
          result = await connection.execute(`INSERT INTO PIX(
            pixid,txid ,numped,vlpix,cpfcnpj,txtimgqrcode,
            numrevisao,status,dtexpiracao,obspix,dtcriacaopix,codfilial,codfuncpix,expiration_time,banco,tipopix) 
            VALUES (
            (SELECT (MAX(P.PIXID)+1) FROM PIX P),:1,:2,:3,:4,
            :5,:6,:7,:8,:9,:10,:11,:12,:13,:14,:15)`,
            [parametro.txid,parametro.numped,parametro.vlpix,parametro.cpfcnpj,parametro.txtimgqrcode
            ,parametro.numrevisao,parametro.status,dtexpiracao,parametro.obspix,parametro.dtcriacaopix
            ,parametro.codfilial,parametro.codfuncpix,parametro.expiration_time,parametro.banco,parametro.tipopix]
            ,{autoCommit: true});
          if (result.affectedRows == 0) {
            
            console.log('NENHUM PIX INSERRIDO! - QTD: ' + result);
          } else {
            console.log(result)
            return res.send(result)
          }
        }else{
          console.log('DADOS INVALIDOS - REVEJA OS PARAMETROS PASSADOS')
          return res.status(400).send(result)
        }
                   
    } catch (err) {
      //send error message
      console.error(err.message + ' - InsertPix');
      return  res.send(err) 
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO FECHADA COM SUCESSO! - InsertPix');
        } catch (err) {
          console.error(err.message + ' InsertPix');
        }
      }
    }
  }


  //GET DUPLICATAS EM ABERTO RCA - GERACAO DE PIX
  async function GetDuplicRCA(parameter,req, res){
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
      console.log('CONCETADO NO BANCO! -- GET DUPLIC RCA');
      // run query to get all employees
      result = await connection.execute(
      `SELECT P.CODFILIAL,P.DUPLIC,P.PREST,P.NUMPED,P.VALOR,P.CODCLI,C.CLIENTE,P.DTVENC
      ,REPLACE(REPLACE(REPLACE(C.CGCENT,'.',''),'/',''),'-','') AS CGCENT
      ,CASE WHEN P.DTVENC<SYSDATE THEN ((2*p.valor)/100) ELSE 0 END AS VALOR_MULTA
      ,CASE WHEN P.DTVENC<SYSDATE THEN ROUND((SYSDATE-P.DTVENC)-1) ELSE 0 END AS QTDIAS_JUROS
      ,CASE WHEN P.DTVENC<SYSDATE THEN (CASE WHEN DU.DIAFINANCEIRO='N' THEN (SELECT COUNT(*) FROM PCDIASUTEIS D WHERE D.CODFILIAL=P.CODFILIAL AND D.DIAFINANCEIRO='S' AND D.DATA BETWEEN P.DTVENC AND SYSDATE) ELSE (SELECT COUNT(*) FROM PCDIASUTEIS D WHERE D.CODFILIAL=P.CODFILIAL AND D.DIAFINANCEIRO='S' AND D.DATA BETWEEN P.DTVENC AND SYSDATE) END) ELSE 0 END AS QTDIAS_JUROS_DIAS_UTEIS
      ,CASE WHEN P.DTVENC<SYSDATE THEN (((5*P.VALOR)/100)/30) ELSE 0 END AS VLMORA
      ,(P.VALOR + (CASE WHEN P.DTVENC<SYSDATE THEN ((2*p.valor)/100) ELSE 0 END) + ((CASE WHEN P.DTVENC<SYSDATE THEN ROUND((SYSDATE-P.DTVENC)-1) ELSE 0 END) * CASE WHEN P.DTVENC<SYSDATE THEN (((5*P.VALOR)/100)/30) ELSE 0 END ) ) AS VLJUROSMULTADIASCORRIDOS
      ,C.EMAILNFE AS EMAIL
      FROM PCPREST P,PCCLIENT C, PCDIASUTEIS DU 
      WHERE DU.DATA=P.DTVENC AND DU.CODFILIAL=P.CODFILIAL --AND DU.DIAFINANCEIRO='S'
      AND P.CODCLI=C.CODCLI AND P.DTPAG IS NULL 
      AND P.CODCLI=:1
      ORDER BY P.DUPLIC DESC`,[parameter.codcli]);
      if (result.rows.length == 0) {
        //query return zero employees
        return res.send('NENHUM REGISTRO ENCONTRADO -- GET DUPLIC RCA');
      } else {
        console.log("DUPLICATAS ENCONTRADAS: " + result.rows.length)
        //send all employees
        const doubles = result.rows.map(function(newsql) {
            return {
                    CODFILIAL:newsql[0],
                    DUPLIC:newsql[1],
                    PREST:newsql[2],
                    NUMPED:newsql[3],
                    VALOR:newsql[4],
                    CODCLI:newsql[5],
                    CLIENTE:newsql[6],
                    DTVENC:newsql[7],
                    CPFCNPJ:newsql[8],
                    VALORMULTA:newsql[9],
                    QTDIAS:newsql[10],
                    QTDIASUTEIS:newsql[11],
                    VLMORA:newsql[12],
                    VLTOTALJUROSMULTA:newsql[13],
                    EMAIL:newsql[14],
            }
        })
        //console.log(session)
        //console.log(alter_session)
        //console.log(after_session)
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
          console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET DUPLIC RCA');
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  }

  //INSERT PIX GERADOS - FRENTE DE LOJA
  async function InsertPix(parametro,req, res) {
    //console.log(parametro)
    let dtexpiracao = new Date().toLocaleString('pt-BR')
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
    
        console.log('CONECTADO NO BANCO - InsertPix');
        if(parametro.txid!=null  && parametro.codfilial!=null){
          console.log(parametro)
          result = await connection.execute(`INSERT INTO PIX(
            pixid,txid ,numped,vlpix,cpfcnpj,txtimgqrcode,
            numrevisao,status,dtexpiracao,obspix,dtcriacaopix,codfilial,codfuncpix,expiration_time,banco,tipopix) 
            VALUES (
            (SELECT (MAX(P.PIXID)+1) FROM PIX P),:1,:2,:3,:4,
            :5,:6,:7,:8,:9,:10,:11,:12,:13,:14,:15)`,
            [parametro.txid,parametro.numped,parametro.vlpix,parametro.cpfcnpj,parametro.txtimgqrcode
            ,parametro.numrevisao,parametro.status,dtexpiracao,parametro.obspix,parametro.dtcriacaopix
            ,parametro.codfilial,parametro.codfuncpix,parametro.expiration_time,parametro.banco,parametro.tipopix]
            ,{autoCommit: true});
          if (result.affectedRows == 0) {
            
            console.log('NENHUM PIX INSERRIDO! - QTD: ' + result);
          } else {
            console.log(result)
            return res.send(result)
          }
        }else{
          console.log('DADOS INVALIDOS - REVEJA OS PARAMETROS PASSADOS')
          return res.status(400).send(result)
        }
                   
    } catch (err) {
      //send error message
      console.error(err.message + ' - InsertPix');
      return  res.send(err) 
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO FECHADA COM SUCESSO! - InsertPix');
        } catch (err) {
          console.error(err.message + ' InsertPix');
        }
      }
    }
  }


  //GERA CREDITO PARA PEDIDOS FATURADOS POR PIX - 618
  async function geraCredito618(parametro,req, res) {
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
      //session = await connection.execute("select value from nls_session_parameters where parameter = 'NLS_NUMERIC_CHARACTERS'");
      //alter_session = await connection.execute("ALTER SESSION SET NLS_NUMERIC_CHARACTERS = '.,'");
      //after_session = await connection.execute("select value as value_after from nls_session_parameters where parameter = 'NLS_NUMERIC_CHARACTERS'");
      //result_alter_session=connection.commit();
      //console.log(result_alter_session);

      console.log('CONCETADO NO BANCO!-- geraCredito618');
      //1--PEGAR O VALOR CONCILIADO PARA SOMAR E REALIZAR UPDATE NA PCESTCR
      console.log('BANCO: ' + parametro.codbanco)
      result_last_value = await connection.execute("SELECT PCESTCR.VALOR FROM PCESTCR WHERE CODCOB   = 'D' AND CODBANCO = :1",[parametro.codbanco]);
      
      if (result_last_value.rows.length == 0) {
        console.log('NENHUM REGISTRO ENCONTRADO LAST VALUE PCESTCR - geraCredito618')
        
      } else {
        const doubles = result_last_value.rows.map(function(newsql) {return {value_estcr:newsql[0]} })
        console.log("VALOR DA PCESCR PEGO COM SUCESSO: " + doubles[0].value_estcr + ' - ' + parametro.valor)
        console.log('TIPO DE DADO - VLTOTAL ESCTCR: ' + typeof (doubles[0].value_estcr)) //retorna um number
        console.log('TIPO DE DADO - VALOR DA TRANSACAO: ' + typeof (parametro.valor)) //retorna uma string
        let value_estcr_ftm=doubles[0].value_estcr.toFixed(2).replace('.', ',')
        let parametro_valor_fmt=parametro.valor.replace('.', ',');
        console.log('VALOR ATUAL PCESCR FORMATADO: ' + value_estcr_ftm)
        console.log('VALOR PARA INCREMENTAR A PCESCR FORMATADO: ' + parametro_valor_fmt)
        console.log('VALOR PARA INCREMETAR A PCESCT SEM FORMATO: ' + parametro.valor)
        
        //2--ATUALIZA O VALOR DA PCESTCR SOMANDO COM O VALOR DO CREDITO GERADO
        //update_value_estcr = await connection.execute("UPDATE PCESTCR SET VALOR = ('3846498.05') WHERE CODCOB = 'D' AND CODBANCO = 1",[doubles[0].value_estcr,parametro.valor ]);
        //update_value_estcr = await connection.execute("UPDATE PCESTCR SET VALOR = (:1+:2) WHERE CODCOB = 'D' AND CODBANCO = :3",[value_estcr_ftm,parametro_valor_fmt,parametro.codbanco]);
        update_value_estcr = await connection.execute("UPDATE PCESTCR SET VALOR = (:1+:2) WHERE CODCOB = 'D' AND CODBANCO = :3",[doubles[0].value_estcr,parametro_valor_fmt,parametro.codbanco]);        
        let result_update_value_estcr=update_value_estcr;
        console.log(result_update_value_estcr);

        result_proxnumtrans = await connection.execute("SELECT NVL(PROXNUMTRANS,1)+1 AS PROXNUMTRANS FROM PCCONSUM P");
        if (result_last_value.rows.length == 0) {
          console.log('NENHUM REGISTRO ENCONTRADO PROXNUMTRANS - geraCredito618')
        } else {
          const proxnumtrans = result_proxnumtrans.rows.map(function(newsql) {return {proxnumtrans:newsql[0]} })
          console.log("VALOR PROXNUMTRANS PEGO COM SUCESSO: " + proxnumtrans[0].proxnumtrans)
          let proxnumtrans_atualizado=proxnumtrans[0].proxnumtrans;
        }

        if(update_value_estcr.rowsAffected == 0){
          console.log('NENHUM REGISTRO ATUALIZADO VALOR PCESTCR -- geraCredito618');
        }else{
          console.log('VALOR DE CONCILIACAO ATUALIZADO COM SUCESSO!')
            //4--ATUALIZA O PROXNUMTRANS DA PCCONSUM PARA OUTRO REGISTRO FUTURO
            update_proxnumtrans = await connection.execute("UPDATE PCCONSUM SET PROXNUMTRANS = PROXNUMTRANS + 1 WHERE PROXNUMTRANS IS NOT NULL",[]);
            let result_update_proxnumtrans=update_proxnumtrans;
            console.log(result_update_proxnumtrans)
            if(result_update_proxnumtrans.affectedRows == 0){
              console.log('NENHUM REGISTRO ATUALIZADO PROXNUMTRANS PCCONSUM -- geraCredito618')
            }else{
              console.log('PROXNUMTRANS ATUALIZADO COM SUCESSO!');
              let hora = new Date().toLocaleTimeString('pt-BR',{hour: '2-digit'})
              let minuto = new Date().toLocaleTimeString('pt-BR',{minute: '2-digit'})
              let valor=parseFloat(parametro.valor);
              let valoratualizado=parseFloat(doubles[0].value_estcr);
              let valoratualizadopcestcr=(valor+valoratualizado);
              console.log('SALDO DA PCMOVCR COM O LANCAMENTO DO CREDITO: ' + valoratualizadopcestcr)
              let hist2=`LIQ.CRECLI[${parametro.codcli}] NF [0]`
              console.log(hist2,parametro.valor,valoratualizadopcestcr,hora,minuto,parametro.matricula,parametro.codcli
                ,parametro.codfilial)
              //console.log(proxnumtrans[0].proxnumtrans+parametro.valor+valoratualizadopcestcr+hora+minuto+' - '+parametro.matricula+parametro.codcli+parametro.codfilial)
              //5--REALIZA O INSERT NA PCMOVCR COM O NUMTRANS RECEBIDO ANTERIORMENTE DA PCCONSUM

              result_insert_pcmovcr = await connection.execute(`INSERT INTO PCMOVCR 
              (NUMTRANS
                ,DATA
                ,CODBANCO
                ,CODCOB
                ,HISTORICO
                ,HISTORICO2
                ,VALOR
                ,TIPO              
                ,NUMCARR
                ,NUMDOC
                ,VLSALDO
                ,HORA
                ,MINUTO
                ,CODFUNC           
                ,INDICE
                ,CODROTINALANC
                ,CODCLI
                ,CODFILIAL)                         
                VALUES(
                  (SELECT NVL(PROXNUMTRANS,1)+1 AS PROXNUMTRANS FROM PCCONSUM P)
                  ,sysdate,:1,'D'
                  ,'INCLUSAO MANUAL DE CREDITO CLIENTE'
                  ,:2,:3,'D',0,null,:4,:5,:6,:7,'B','618',:8,:9)`,
              [parametro.codbanco,hist2,parametro_valor_fmt,valoratualizadopcestcr,hora,minuto,parametro.matricula,parametro.codcli
              ,parametro.codfilial]);
              // 18 CAMPOS NO INSERT
              // 9 BINDS
              // 9 SETADOS FIXOS NO INSERT
              let pcmovcr_sql=result_insert_pcmovcr;
              if(pcmovcr_sql.rowsAffected == 0){
                console.log('NENHUM REGISTRO INSERIDO NA PCMOVCR -- geraCredito618')
              }else{
                console.log('REGISTRO DE CONCILIACAO BANCARIA INSERIDO COM SUCESSO NA PCMOVCR - PIX')
                console.log(pcmovcr_sql)
                let historico='CRED. AUTO. BAIXA PIX - FRENTE DE LOJA'

                result_codigo = await connection.execute("SELECT DFSEQ_PCCRECLI.NEXTVAL AS PROXCODIGO FROM DUAL");
                const proxcodigo = result_codigo.rows.map(function(newsql) {return {proxcodigo:newsql[0]} })
                result_numcred = await connection.execute("SELECT DFSEQ_PCCRECLI_NUMCRED.NEXTVAL AS PROXNUMCRED FROM DUAL");
                const proxnumcred = result_numcred.rows.map(function(newsql) {return {proxnumcred:newsql[0]} })
                
                console.log(parametro.codcli,parametro.codfilial,parametro.valor,parametro.matricula,
                  hora,minuto,historico,parametro.matricula,parametro.numped,
                  proxcodigo[0].proxcodigo,proxnumcred[0].proxnumcred,parametro.situacao)
                result_insert_pccrecli = await connection.execute(`INSERT INTO PCCRECLI  
                (CODCLI       	      
                ,	DTLANC	            
                ,	CODFILIAL	           
                ,	VALOR        	      	          
                ,	CODFUNC	            
                ,	HORA	              
                ,	MINUTO           	  	  
                ,	HISTORICO	           
                ,	CODFUNCLANC	        
                ,	NUMPED	            
                ,	NUMERARIO           
                ,	CODMOVIMENTO	      	            
                ,	NUMTRANS	        	      
                ,	CODROTINA	                     
                ,	CODIGO                
                ,	NUMCRED
                , SITUACAO)    	             
                VALUES        	      
                (:1,TRUNC(SYSDATE),:2,:3,:4,:5,:6,'CRED. AUTO. BAIXA PIX',:7,:8,'S',1,(SELECT NVL(PROXNUMTRANS,1)+1 AS PROXNUMTRANS FROM PCCONSUM P),618,:9,:10,:11)`,
              [parametro.codcli,parametro.codfilial,parametro_valor_fmt,parametro.matricula,
              hora,minuto,parametro.matricula,parametro.numped,
              proxcodigo[0].proxcodigo,proxnumcred[0].proxnumcred,parametro.situacao]);
              console.log('REGISTRO DE CREDITO LANCADO COM SUCESSO')
              console.log(result_insert_pccrecli)
            }
            }
          
        }
        connection.commit();
        return res.send('ok');
      }
    } catch (err) {
      console.log(err)
      connection.rollback();
      return res.status(500).json({ error: err.message })
      //return res.send(err);
      
    } finally {
      
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- geraCredito618');
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  }

  //BAIXA PIX NO WINTHOR - RETORNO PAGAMENTO
  async function UpdatePixBaixa(parametro,req, res) {
    //console.log(parametro)
    let dtexpiracao = new Date().toLocaleString('pt-BR')
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
    
        console.log('CONECTADO NO BANCO - UpdatePixBaixa');
        if(parametro.txid!=null  && parametro.valor!=null){
          console.log(parametro)
          result_update_baixa_pix = await connection.execute(`
          UPDATE PIX P SET P.STATUS=:1, P.DTBAIXA=:2, P.CODFUNCBAIXA=:3, P.VLPIXBAIXA=:4,P.IDPAGPIX=:5 WHERE P.TXID=:6`,
            [parametro.status,parametro.dthrpagpix,parametro.matricula,parametro.valor,parametro.idpagpix,parametro.txid]
            ,{autoCommit: true});
          if (result.affectedRows == 0) {
            
            console.log('NENHUM PIX ATUALIZADO! - ' + result);
          } else {
            console.log('PIX ATUALIZADO COM SUCESSO')
            console.log(result_update_baixa_pix)
            return res.send(result_update_baixa_pix)
          }
        }else{
          console.log('DADOS INVALIDOS - REVEJA OS PARAMETROS PASSADOS')
          return res.send(result_update_baixa_pix)
        }
                   
    } catch (err) {
      //send error message
      console.error(err.message + ' - UpdatePixBaixa');
      return  res.send(err);
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO FECHADA COM SUCESSO! - UpdatePixBaixa');
        } catch (err) {
          console.error(err.message + ' UpdatePixBaixa');
        }
      }
    }
  }

  //UPDATE PCESTCR - TESTE
  async function UpdateEstcr(parametro,req, res) {
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
        console.log('CONECTADO NO BANCO - UPDATE ESTCR');
          update_value_estcr = await connection.execute("UPDATE PCESTCR SET VALOR = (3846498.04) WHERE CODCOB = 'D' AND CODBANCO = 1",[],{autoCommit: true});
          if (update_value_estcr.affectedRows == 0) {
            console.log('NENHUM REGISTRO ATUALIZADO' + update_value_estcr);
          } else {
            console.log(update_value_estcr)
            return res.send(update_value_estcr)
          }
                   
    } catch (err) {
      //send error message
      console.error(err.message + ' - UPDATE ESTCR ERROR');
      return  res.send(err.message) 
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO FECHADA COM SUCESSO! - UPDATE ESTCR');
        } catch (err) {
          console.error(err.message + ' UPDATE ESTCR');
        }
      }
    }
  }


  //GET DUPLICATAS EM ABERTO - GERACAO DE PIX
async function DuplicatasAbertas(parameter,req, res){
  try {
    connection = await oracledb.getConnection({
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
      connectString: process.env.CONNECTSTRING
    });
    console.log('CONCETADO NO BANCO! -- GET DUPLIC EM ABERTO');
    // run query to get all employees
    result = await connection.execute(
    `SELECT P.CODFILIAL,P.DUPLIC,P.PREST,P.NUMPED,P.VALOR,P.CODCLI,C.CLIENTE,P.DTVENC
    ,REPLACE(REPLACE(REPLACE(C.CGCENT,'.',''),'/',''),'-','') AS CGCENT
    ,CASE WHEN P.DTVENC<SYSDATE THEN ((2*p.valor)/100) ELSE 0 END AS VALOR_MULTA
    ,CASE WHEN P.DTVENC<SYSDATE THEN ROUND((SYSDATE-P.DTVENC)-1) ELSE 0 END AS QTDIAS_JUROS
    ,CASE WHEN P.DTVENC<SYSDATE THEN (CASE WHEN DU.DIAFINANCEIRO='N' THEN (SELECT COUNT(*) FROM PCDIASUTEIS D WHERE D.CODFILIAL=P.CODFILIAL AND D.DIAFINANCEIRO='S' AND D.DATA BETWEEN P.DTVENC AND SYSDATE) ELSE (SELECT COUNT(*) FROM PCDIASUTEIS D WHERE D.CODFILIAL=P.CODFILIAL AND D.DIAFINANCEIRO='S' AND D.DATA BETWEEN P.DTVENC AND SYSDATE) END) ELSE 0 END AS QTDIAS_JUROS_DIAS_UTEIS
    ,CASE WHEN P.DTVENC<SYSDATE THEN (((5*P.VALOR)/100)/30) ELSE 0 END AS VLMORA
    ,(P.VALOR + (CASE WHEN P.DTVENC<SYSDATE THEN ((2*p.valor)/100) ELSE 0 END) + ((CASE WHEN P.DTVENC<SYSDATE THEN ROUND((SYSDATE-P.DTVENC)-1) ELSE 0 END) * CASE WHEN P.DTVENC<SYSDATE THEN (((5*P.VALOR)/100)/30) ELSE 0 END ) ) AS VLJUROSMULTADIASCORRIDOS
    ,C.EMAILNFE AS EMAIL
    FROM PCPREST P,PCCLIENT C, PCDIASUTEIS DU 
    WHERE DU.DATA=P.DTVENC AND DU.CODFILIAL=P.CODFILIAL --AND DU.DIAFINANCEIRO='S'
    AND P.CODCLI=C.CODCLI AND P.DTPAG IS NULL 
    AND P.CODCLI=:1
    ORDER BY P.DUPLIC DESC`,[parameter.codcli]);
    if (result.rows.length == 0) {
      //query return zero employees
      return res.send('NENHUM REGISTRO ENCONTRADO -- GET DUPLIC EM ABERTO');
    } else {
      console.log("DUPLICATAS ENCONTRADAS: " + result.rows.length)
      //send all employees
      const doubles = result.rows.map(function(newsql) {
          return {
                  CODFILIAL:newsql[0],
                  DUPLIC:newsql[1],
                  PREST:newsql[2],
                  NUMPED:newsql[3],
                  VALOR:newsql[4],
                  CODCLI:newsql[5],
                  CLIENTE:newsql[6],
                  DTVENC:newsql[7],
                  CPFCNPJ:newsql[8],
                  VALORMULTA:newsql[9],
                  QTDIAS:newsql[10],
                  QTDIASUTEIS:newsql[11],
                  VLMORA:newsql[12],
                  VLTOTALJUROSMULTA:newsql[13],
                  EMAIL:newsql[14],
          }
      })
      //console.log(session)
      //console.log(alter_session)
      //console.log(after_session)
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
        console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET DUPLIC EM ABERTO');
      } catch (err) {
        console.error(err.message);
      }
    }
  }
}

//GET CLIENTE WINTHOR POR ID
async function getClienteId(parameter,req, res){
  try {
    connection = await oracledb.getConnection({
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
      connectString: process.env.CONNECTSTRING
    });

    console.log('CONCETADO NO BANCO! -- GET CLIENTE ID');
    // run query to get all employees
    result = await connection.execute("SELECT * FROM PCCLIENT C WHERE C.CODCLI=:1",[parameter.id]);
    if (result.rows.length == 0) {
      //query return zero employees
      return res.send('NENHUM REGISTRO ENCONTRADO -- GET CLIENTE ID');
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
        console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET CLIENTE');
      } catch (err) {
        console.error(err.message);
      }
    }
  }
}

//GET CLIENTE WINTHOR POR NOME
async function getClienteNome(parameter,req, res){
  let connection;
  try {
    connection = await oracledb.getConnection('appspool');
    if(parameter.nome.length>'6'){
    console.log('CONCETADO NO BANCO! -- GET CLIENTE NOME ' + parameter.nome);
    // run query to get all employees
    result = await connection.execute(`SELECT C.CODCLI,C.CLIENTE,REPLACE(REPLACE(REPLACE(C.CGCENT,'.',''),'/',''),'-','') AS CGCENT,C.EMAILNFE AS EMAILNFE FROM PCCLIENT C WHERE C.CLIENTE LIKE UPPER(:1) `,[parameter.nome]);
    }else{
      console.log('DIGITE MAIS CARACTERES')
    }
    if (result.rows.length == 0) {
      //query return zero employees
      return res.send('NENHUM REGISTRO ENCONTRADO -- GET CLIENTE NOME');
    } else {
      //send all employees
      const doubles = result.rows.map(function(newsql) {
          return {
                  codcli:newsql[0],
                  cliente:newsql[1],
                  cpfcnpj:newsql[2],
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
        console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET CLIENTE NOME');
      } catch (err) {
        console.error(err.message);
      }
    }
  }
}

//GET CLIENTE WINTHOR POR CODCLI
async function getClientes(req, res){
  try {
    const connection = await oracledb.getConnection('appspool');

    console.log('CONCETADO NO BANCO! -- GET CLIENTE');
    // run query to get all employees
    result = await connection.execute("SELECT C.CODCLI,C.CLIENTE,C.CGCENT FROM PCCLIENT C WHERE C.DTEXCLUSAO IS NULL",[]);
    if (result.rows.length == 0) {
      //query return zero employees
      return res.send('NENHUM REGISTRO ENCONTRADO -- GET CLIENTE');
    } else {
      //send all employees
      const doubles = result.rows.map(function(newsql) {
          return {
                  codcli:newsql[0],
                  cliente:newsql[1],
                  cgcent:newsql[2]
          }
      })
      console.log(doubles)
      return res.send(doubles);
    }
  } catch (err) {
    //send error message
    return res.send(err);
  } finally {
    if (connection) {
      try {
        // Always close connections
        await connection.close();
        console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET CLIENTE');
      } catch (err) {
        console.error(err);
      }
    }
  }
}

//GET PIX WINTHOR - TABLEPIX
async function getPixWinthor(parameter,req, res){
  try {
    connection = await oracledb.getConnection({
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
      connectString: process.env.CONNECTSTRING
    });
    console.log('CONCETADO NO BANCO! -- GET PIX WINTHOR');
    // run query to get all employees
    result = await connection.execute(
    ``,[parameter.codfilial]);
    if (result.rows.length == 0) {
      //query return zero employees
      return res.send('NENHUM REGISTRO ENCONTRADO -- GET PIX WINTHOR');
    } else {
      console.log("PIX ENCONTRADOS: " + result.rows.length)
      //send all employees
      const doubles = result.rows.map(function(newsql) {
          return {
                  CODFILIAL:newsql[0],
                  NUMPED:newsql[1],
                  VALORTOTAL:newsql[2],
                  CODCLI:newsql[3],
                  CLIENTE:newsql[4],
                  DATAPED:newsql[5],
                  POSICAOPED:newsql[6],
                  ORIGEMPED:newsql[7],
                  POSICAOOS:newsql[8],
                  CPFCNPJ:newsql[9],
                  
          }
      })
      //console.log(session)
      //console.log(alter_session)
      //console.log(after_session)
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
        console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET PIX WINTHOR');
      } catch (err) {
        console.error(err.message);
      }
    }
  }
}

function DisparoEmail(config,parametro,req,res){
  //console.log(config)
  let renegociado=null;

  if(renegociado){
    renegociado=parametro.duplicatas.map(dup => `Duplicata: ${dup.duplicata} \r\nPrestacao: ${dup.prest}\r\nValor:${dup.valor}\r\nValor Total Juros/Multa:${dup.vltotaljurosmora}\r\n`).join()
  }else{
    renegociado='NADA RENEGOCIADO'
  }
  
  console.log(parametro.duplicatas)
  var transporter = nodemailer.createTransport({
  host: config.host,
  port: config.port,
  //secure: config.secure,
  auth: {
    user: config.user,
    pass: config.pass
  }
});
var mailOptions = {
  from: config.from,
  to: config.to,
  cc: [
    {address: config.cc1},
    {address: config.cc2},
    //{address: 'rodrigo.hilario@rofedistribuidora.com.br'}
],
  
  bco: config.bco,
  replyTo: config.user,
  subject: config.subject,
  text: config.subject,
  html:
  `
  <table align="center" border="1" cellpadding="1" cellspacing="1" style="width:500px">
	<tbody>
		<tr>
			<td style="height:100%; width:100%">
			<table border="0" cellpadding="0" cellspacing="0" style="-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%">
				<tbody>
					<tr>
						<td style="background-color:transparent"><!--[if (gte mso 9)|(IE)]><table border='0' cellpadding='0' cellspacing='0' width='600' style='width:600px' class='sectionContainerIE'> <tr> <td valign='top' align='center' width='600' style='width:600px;'><![endif]-->
						<table border="0" cellpadding="0" cellspacing="0" class="sectionContainer" style="-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; background-color:transparent; border-collapse:collapse; max-width:600px !important; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%">
							<tbody>
								<tr>
									<td>
									<table align="left" border="0" cellpadding="0" cellspacing="0" class="columnContainer" style="-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:600px">
										<tbody>
											<tr>
												<td>
												<table border="0" cellpadding="0" cellspacing="0" class="columnContainerSize" style="-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; background-color:transparent; border-collapse:collapse; max-width:600px !important; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%">
													<tbody>
														<tr>
															<td><!--[if (gte mso 9)|(IE)]><table align='center' border='0' cellspacing='0' cellpadding='0' width='600' style='width:600px;'> <tr> <td align='center' valign='top' width='390' style='width:390px;'><![endif]-->
															<table align="left" border="0" cellpadding="0" cellspacing="0" class="columnContainer" style="-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:390px">
																<tbody>
																	<tr>
																		<td style="text-align:left; vertical-align:top">&nbsp;</td>
																	</tr>
																</tbody>
															</table>
															<!--[if (gte mso 9)|(IE)]></td> <td align='center' valign='top' width='210' style='width:210px;'><![endif]-->

															<table align="left" border="0" cellpadding="0" cellspacing="0" class="columnContainer" style="-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:210px">
															</table>
															<!--[if (gte mso 9)|(IE)]></td> </tr> </table><![endif]--></td>
														</tr>
													</tbody>
												</table>
												</td>
											</tr>
										</tbody>
									</table>
									</td>
								</tr>
							</tbody>
						</table>
						<!--[if (gte mso 9)|(IE)]></td> </tr> </table><![endif]--></td>
					</tr>
					<tr>
						<td style="background-color:transparent"><!--[if (gte mso 9)|(IE)]><table border='0' cellpadding='0' cellspacing='0' width='600' style='width:600px' class='sectionContainerIE'> <tr> <td valign='top' align='center' width='600' style='width:600px;'><![endif]-->
						<table border="0" cellpadding="0" cellspacing="0" class="sectionContainer" style="-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; background-color:#ffffff; border-collapse:collapse; max-width:600px !important; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%">
							<tbody>
								<tr>
									<td>
									<table align="left" border="0" cellpadding="0" cellspacing="0" class="columnContainer" style="-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:600px">
										<tbody>
											<tr>
												<td>
												<table border="0" cellpadding="0" cellspacing="0" style="-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; border-collapse:collapse !important; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%">
													<tbody>
														<tr>
															<td><img alt="" src="https://cdn.rofedistribuidora.com/images/VENDA.png" width="600" /></td>
														</tr>
													</tbody>
												</table>

												<table border="0" cellpadding="0" cellspacing="0" style="-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; border-collapse:collapse !important; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%">
													<tbody>
														<tr>
															<td>
															<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:initial; border-top-color:#eaeaea; border-top-style:solid; border-top-width:2px; min-width:100%; width:100%">
																<tbody>
																	<tr>
																		<td>&nbsp;</td>
																	</tr>
																</tbody>
															</table>
															</td>
														</tr>
													</tbody>
												</table>

												<table border="0" cellpadding="0" cellspacing="0" style="-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; border-collapse:collapse !important; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%">
													<tbody>
														<tr>
															<td>
															<h1 style="text-align:center">${parametro.codcli} - ${parametro.cliente}</h1>

															<p style="text-align:center"><span style="color:#008000"><strong>SEU PAGAMENTO PIX FOI REALIZADO COM SUCESSO!</strong></span></p>

															<p style="text-align:center"><strong>DADOS DO PEDIDO -&nbsp;</strong></p>

															<p style="text-align:center"><strong>NUMERO DO PEDIDO:</strong> ${parametro.numped}</p>

															<p style="text-align:center"><strong>CLIENTE: </strong>${parametro.cliente}</p>

															<p style="text-align:center"><strong>EMAIL CLIENTE:</strong> ${config.to}</p>

															<p style="text-align:center"><strong>TOTAL PEDIDO:</strong> ${parametro.vlpedido}</p>

															<p style="text-align:center"><strong>VALOR PIX:</strong> ${parametro.vlpix}</p>

															<p style="text-align:center"><strong>PIX:</strong> ${parametro.txid}</p>

															<p style="text-align:center"><strong>ID PAGAMENTO:</strong> ${parametro.endtoend}</p>

															<p style="text-align:center"><strong>FILIAL: </strong>${parametro.codfilial}</p>

															<p style="text-align:center"><strong>DUPLICATAS NEGOCIADAS: </strong>${renegociado}</p>

															<p>&nbsp;</p>
															</td>
														</tr>
													</tbody>
												</table>
												&nbsp;

												<table border="0" cellpadding="0" cellspacing="0" class="componentContainerButton" style="-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; background-color:transparent; border-collapse:collapse; min-width:100%; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%">
													<tbody>
														<tr>
															<td>
															<table border="0" cellpadding="0" cellspacing="0" class="componentBlockButton" style="-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; background-color:#2dbe60; border-collapse:separate !important; border-radius:29px; border:0px none #000000; mso-table-lspace:0pt; mso-table-rspace:0pt">
																<tbody>
																</tbody>
															</table>
															</td>
														</tr>
													</tbody>
												</table>

												<table border="0" cellpadding="0" cellspacing="0" style="-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; border-collapse:collapse !important; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%">
													<tbody>
														<tr>
															<td>
															<p style="text-align:center"><strong>⚠️ Todas as informa&ccedil;&otilde;es s&oacute; poder&atilde;o ser acessadas e enviadas para o e-mail cadastrado na base da ROFE.</strong></p>
															</td>
														</tr>
													</tbody>
												</table>

												<table border="0" cellpadding="0" cellspacing="0" style="-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; border-collapse:collapse !important; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%">
													<tbody>
														<tr>
															<td>
															<p style="text-align:center"><img alt="" src="https://d335luupugsy2.cloudfront.net/cms/files/377795/1632229245/$ynkfhafd1y" width="100" /></p>
															</td>
														</tr>
													</tbody>
												</table>

												<table border="0" cellpadding="0" cellspacing="0" style="-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; border-collapse:collapse !important; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%">
													<tbody>
														<tr>
															<td>&nbsp;</td>
														</tr>
													</tbody>
												</table>
												</td>
											</tr>
										</tbody>
									</table>
									</td>
								</tr>
							</tbody>
						</table>
						<!--[if (gte mso 9)|(IE)]></td> </tr> </table><![endif]--></td>
					</tr>
					<tr>
						<td style="background-color:transparent"><!--[if (gte mso 9)|(IE)]><table border='0' cellpadding='0' cellspacing='0' width='600' style='width:600px' class='sectionContainerIE'> <tr> <td valign='top' align='center' width='600' style='width:600px;'><![endif]-->
						<table border="0" cellpadding="0" cellspacing="0" class="sectionContainer" style="-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; background-color:transparent; border-collapse:collapse; max-width:600px !important; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%">
							<tbody>
								<tr>
									<td>
									<table align="left" border="0" cellpadding="0" cellspacing="0" class="columnContainer" style="-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:600px">
										<tbody>
											<tr>
												<td>
												<table align="left" border="0" cellpadding="0" cellspacing="0" class="columnContainer" style="-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:600px">
													<tbody>
														<tr>
															<td style="text-align:center">
															<p>Enviado por<span style="color:#0000CD"> $<strong>${config.user}</strong></span></p>

															<p>Av. Engenheiro Emiliano Macieira, 05 - Pedrinhas. S&atilde;o Lu&iacute;s/MA. CEP 65.095-603 - CNPJ 05.300.197/0001-06</p>
															<span style="color:#ffffff; font-size:1px">&bull;</span></td>
														</tr>
													</tbody>
												</table>
												</td>
											</tr>
										</tbody>
									</table>
									</td>
								</tr>
							</tbody>
						</table>
						<!--[if (gte mso 9)|(IE)]></td> </tr> </table><![endif]--></td>
					</tr>
				</tbody>
			</table>
			</td>
		</tr>
	</tbody>
</table>

  `
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log('Erro ao disparar email! - ' + error);
    res.status(500)
    res.json({"status":500,"response":error,"text":"EMAIL NAO ENVIADO"})
  } else {
    console.log('NOTIFICANDO POR EMAIL.. ');
    console.log('EMAIL ENVIADO SOM SUCESSO! - ' + config.bco + ' - ' + info.response);
    res.status(200)
    res.json({"status":200,"response":info.response,"text":"EMAIL ENVIADO COM SUCESSO!"})

  }
});
}

  //LIBERA PEDIDO - RETORNO PAGAMENTO
  async function LiberaPedido(parametro,req, res) {
    let dtexpiracao = new Date().toLocaleString('pt-BR')
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
        console.log('CONECTADO NO BANCO - LIBERA PEDIDO ');
        result_posicao_pedido=await connection.execute(`SELECT P.POSICAO FROM PCPEDC P WHERE P.NUMPED=:1`,[parametro.numped]);
        
        console.log(result_posicao_pedido.rows.length)
        //send all employees
        const doubles = result_posicao_pedido.rows.map(function(newsql) {
            return {posicao:newsql[0]
            }
        })
        console.log('POSICAO DO PEDIDO: ' + doubles[0].posicao)
        if(result_posicao_pedido.rows.length>0){
          if(doubles[0].posicao=='B' || doubles[0].posicao=='P'){
            console.log(parametro)
            result_update_pedido = await connection.execute(`UPDATE PCPEDC P SET P.POSICAO='L',P.DTLIBERA=SYSDATE,P.CODFUNCLIBERA=5555, P.OBS='PAGAMENTO VIA PIX' WHERE P.NUMPED=:1`,
            [parametro.numped]
            ,{autoCommit: true});

            result_update_pedidoi = await connection.execute(`UPDATE PCPEDI I SET I.POSICAO='L' WHERE I.NUMPED=:1`,
            [parametro.numped]
            ,{autoCommit: true});
            
              if (result_update_pedido.affectedRows == 0) {
              console.log('NENHUM PEDIDO ATUALIZADO! - ' + result_update_pedido);
              } else {
              console.log('PEDIDO ATUALIZADO COM SUCESSO')
              console.log(result_update_pedido)
              return res.send(result_update_pedido)
              }
            }else{
              console.log("PEDIDO NA POSICAO DIFERENTE DA POSICAO B E P -- NADA A FAZER")
              return res.send("PEDIDO NA POSICAO DIFERENTE DA POSICAO B E P -- NADA A FAZER")
            }
        }else{
          console.log('NENHUM PEDIDO ENCONTRADO')
          //return res.send(result_update_pedido)
        }
                   
    } catch (err) {
      //send error message
      console.error(err.message + ' - LIBERA PEDIDO ');
      return  res.send(err);
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO FECHADA COM SUCESSO! - LIBERA PEDIDO ');
        } catch (err) {
          console.error(err.message + ' LIBERA PEDIDO ');
        }
      }
    }
  }

  async function Milvus(objmilvus,req,res){
    console.log("ABRINDO CONEXAO COM O MILVUS... -- GET MILVUS")
    axios({method: 'post',url:'https://apiintegracao.milvus.com.br/api/relatorio-personalizado/exportar',
    headers: {
      //"Content-Type":"application/json",
      "Authorization":objmilvus.token,
      'Access-Control-Allow-Origin' : '*',
    }, 
    data: {
      "nome":"POWERBI",
      "tipo": "csv"
    },
    }).then(response => {
      let milvusresponse=response.data;
      let csv=milvusresponse;
      var array = response.data.toString().split("\n");
      //let array2 = array.toString().split("\n");
      //console.log(array[1])

      // console.log(array[1])
      // const doubles = array.map(function(newsql) {
      //   return {ticket:newsql[0],teste:newsql[1],teste2:newsql[2]}
      // })
      //console.log(doubles)
 
// All the rows of the CSV will be
// converted to JSON objects which
// will be added to result in an array
let result = [];
 
// The array[0] contains all the
// header columns so we store them
// in headers array
let headers = array[0].split("\n");

let headers_split = headers.toString().split(";")

for (let i = 1; i < array.length - 1; i++) {
  let row_split = array[i].toString().split(";")
  let obj = {}

  //console.log(row_split)
  
  // obj[headers_split[0]] = row_split[0]
  // obj[headers_split[1]] = row_split[1]
  for(let j=0; j < headers_split.length; j++) {
    obj[headers_split[j].toString().replace(/\"| /g, "")] = row_split[j].toString().replace(/\"|\\n|\\r/g, "")
  }
  result.push(obj)
}
 
// Convert the resultant array to json and
// generate the JSON output file.

let json = JSON.stringify(result);
let json2 = JSON.stringify(array[2]);

      console.log("DADOS ENCONTRADOS")
      res.json(result)
      res.status(200)
      console.log("CONEXAO COM O MILVUS FECHADA COM SUCESSO -- GET MILVUS ")
      
      errorData=null;
          }).catch(error => {
            console.log("CONEXAO FECHADA -- GET MILVUS")
            errorData=error
            console.log('ERROR:' + error)
        });      
  }

  //INSERT PIXTOKEN GERADOS
  
  async function InsertPixToken(parametro,req,res) {
    //console.log(parametro)
    let dtexpiracao = new Date().toLocaleString('pt-BR')
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
    
        console.log('CONECTADO NO BANCO - INSERT PIX TOKEN');
        if(parametro.token!=null  && parametro.dthrexpiration!=null){
          //console.log(parametro)
          result = await connection.execute(`INSERT INTO PIXTOKEN(PIXTOKENID,BANCO,TOKEN,STATUS,DTHREXPIRATIONPIXTOKEN_APP,TOKEN_TYPE) 
            VALUES ( (SELECT (MAX(P.PIXTOKENID)+1) FROM PIXTOKEN P),'237',:1,'A',:2,:3)`,
            [parametro.token,parametro.dthrexpiration,parametro.token_type]
            ,{autoCommit: true});
          if (result.affectedRows == 0) {
            
            console.log('NENHUM PIXTOKEN INSERRIDO! - QTD: ' + result);
          } else {
            console.log(result)
            //return res.send(result)
          }
        }else{
          console.log('DADOS INVALIDOS - REVEJA OS PARAMETROS PASSADOS')
          //return res.status(400).send(result)
        }
                   
    } catch (err) {
      //send error message
      console.error(err.message + ' - INSERT PIX TOKEN');
      //return  res.send(err) 
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO FECHADA COM SUCESSO! - INSERT PIX TOKEN');
        } catch (err) {
          console.error(err.message + ' INSERT PIX TOKEN');
        }
      }
    }
  }

  //ATUALIZA PIX TOKEN STATUS - ATIVO OU INATIVO
  
  async function UpdatePixTokenStatus(parametro,req,res) {
    console.log('PARAMETRO: ' + parametro)
    let dtexpiracao = new Date().toLocaleString('pt-BR')
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
    
        console.log('CONECTADO NO BANCO - UpdatePixTokenStatus');
        if(parametro!=null){
          //console.log(parametro)
          result = await connection.execute(`UPDATE PIXTOKEN P SET P.STATUS='I' WHERE P.PIXTOKENID=:1`,
            [parametro]
            ,{autoCommit: true});
          if (result.affectedRows == 0) {
            
            console.log('NENHUM PIXTOKEN ATUALIZADO! - QTD: ' + result);
          } else {
            console.log(result)
            //return res.send(result)
          }
        }else{
          console.log('DADOS INVALIDOS - REVEJA OS PARAMETROS PASSADOS')
          //return res.status(400).send(result)
        }
                   
    } catch (err) {
      //send error message
      console.error(err.message + ' - UpdatePixTokenStatus');
      //return  res.send(err) 
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO FECHADA COM SUCESSO! - UpdatePixTokenStatus');
        } catch (err) {
          console.error(err.message + ' UpdatePixTokenStatus');
        }
      }
    }
  }

  //GET PIX TOKEN WINTHOR -- VALIDA TOKEN
async function getPixToken(req, res){
  try {
    connection = await oracledb.getConnection({
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
      connectString: process.env.CONNECTSTRING
    });
    console.log('CONCETADO NO BANCO! -- GET PIX TOKEN');
    // run query to get all employees
    result = await connection.execute("SELECT P.PIXTOKENID,P.DTHREXPIRATIONPIXTOKEN,SYSDATE,((P.DTHREXPIRATIONPIXTOKEN-SYSDATE)*1440) AS TEMPO_RESTANTE_TOKEN,CASE WHEN ((P.DTHREXPIRATIONPIXTOKEN-SYSDATE)*1440)>0 THEN 'TOKEN VALIDO' ELSE 'TOKEN INVALIDO' END AS VALIDA_TOKEN,P.TOKEN,P.token_type FROM PIXTOKEN P WHERE P.PIXTOKENID=(SELECT MAX(PT.PIXTOKENID) FROM PIXTOKEN PT ) ORDER BY PIXTOKENID",[]);
    if (result.rows.length == 0) {
      //query return zero employees
      return res.send('NENHUM REGISTRO ENCONTRADO -- GET PIX TOKEN');
    } else {
      //send all employees
      const doubles = result.rows.map(function(newsql) {
          return {
              PIXTOKENID:newsql[0],
              TOKEN:newsql[5],
              TOKEN_TYPE:newsql[6],
              VALIDA_TOKEN:newsql[4],
              EXPIRES_IN:newsql[1],
              TEMPO_RESTANTE:newsql[3],

          }
      })
      //console.log(doubles[0].VALIDA_TOKEN)
      //return res.send(doubles);
      const token={"pixtokenid":doubles[0].PIXTOKENID,"access_token":doubles[0].TOKEN,"token_type":doubles[0].TOKEN_TYPE,"status":doubles[0].VALIDA_TOKEN,"dthrexpiration":doubles[0].EXPIRES_IN,"tempo_restante":doubles[0].TEMPO_RESTANTE}
      return token
    }
  } catch (err) {
    //send error message
    //return res.send(err);
  } finally {
    if (connection) {
      try {
        // Always close connections
        await connection.close();
        console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET PIX TOKEN');
      } catch (err) {
        console.error(err);
      }
    }
  }
}

  //INSERT PIX NOTIFICATIONS
  
  async function InsertPixNotification(req,res,pix) {
    //console.log(parametro)
    let dtexpiracao = new Date().toLocaleString('pt-BR')
    try {
      connection = await oracledb.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
    
        console.log('CONECTADO NO BANCO - INSERT PIX NOTIFICATION');
        if(pix.endToEndId!=null  && pix.txid!=null){
          //console.log(parametro)
          result = await connection.execute(`INSERT INTO PIXNOTIFICATIONS 
          (PIXNOTIFICATIONSID,BANCO,STATUS,ENDTOENDID,TXID,VALORPAGO,DTHRPAG,OBSPAGADOR) 
          VALUES 
          ((SELECT (MAX(PN.PIXNOTIFICATIONSID)+1) FROM PIXNOTIFICATIONS PN),:1,:2,:3,:4,:5,:6,:7)`,
            ['237','C',pix.endToEndId,pix.txid,pix.valor,pix.horario,pix.infoPagador]
            ,{autoCommit: true});
          if (result.affectedRows == 0) {
            
            console.log('NENHUMA PIX NOTIFICATION INSERRIDO! - QTD: ' + result);
          } else {
            console.log(result)
            //return result;
            return res.send(result)
          }
        }else{
          console.log('DADOS INVALIDOS - REVEJA OS PARAMETROS PASSADOS - PIX NOTIFICATION')
          //return 'DADOS INVALIDOS - REVEJA OS PARAMETROS PASSADOS - PIX NOTIFICATION'
          return res.status(400).send(result) 
        }
                   
    } catch (err) {
      //send error message
      console.error(err.message + ' - INSERT PIX NOTIFICATION');
      return  res.send(err) 
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO FECHADA COM SUCESSO! - INSERT PIX NOTIFICATION');
        } catch (err) {
          console.error(err.message + ' INSERT PIX NOTIFICATION');
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
    getAutorizacaoOs:getAutorizacaoOs,
    BuscaFoto:BuscaFoto,
    FinalizaOS1759:FinalizaOS1759,
    PedidosFrenteLoja:PedidosFrenteLoja,
    InsertPix:InsertPix,
    geraCredito618:geraCredito618,
    UpdatePixBaixa:UpdatePixBaixa,
    UpdateEstcr:UpdateEstcr,
    DuplicatasAbertas:DuplicatasAbertas,
    getClientes:getClientes,
    getClienteNome:getClienteNome,
    PedidosFrenteLojaVendedorBalcao:PedidosFrenteLojaVendedorBalcao,
    PedidosRca:PedidosRca,
    getPixWinthor:getPixWinthor,
    DisparoEmail:DisparoEmail,
    LiberaPedido:LiberaPedido,
    Milvus:Milvus,
    InsertPixToken:InsertPixToken,
    getPixToken:getPixToken,
    UpdatePixTokenStatus:UpdatePixTokenStatus,
    InsertPixNotification:InsertPixNotification,
    getUserAuth:getUserAuth,
    getRCAAuth:getRCAAuth,
    GetDuplicRCA:GetDuplicRCA
  }