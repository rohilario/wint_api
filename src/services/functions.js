const oracledb = require('oracledb');
const fs = require('fs');
const path = require('path');

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
    session = await connection.execute("select value from nls_session_parameters where parameter = 'NLS_NUMERIC_CHARACTERS'");
    alter_session = await connection.execute("ALTER SESSION SET NLS_NUMERIC_CHARACTERS = '.,'");
    after_session = await connection.execute("select value as value_after from nls_session_parameters where parameter = 'NLS_NUMERIC_CHARACTERS'");
    console.log('CONCETADO NO BANCO! -- GET PEDIDO FRENTE DE LOJA');
    // run query to get all employees
    result = await connection.execute(
    `SELECT P.CODFILIAL,P.NUMPED,P.VLATEND AS VALORTOTALPED,P.CODCLI,C.CLIENTE,P.DATA,P.POSICAO,P.ORIGEMPED,M.POSICAO AS POSICAOOS,REPLACE(REPLACE(REPLACE(C.CGCENT,'.',''),'/',''),'-','') AS CGCENT
    FROM PCPEDC P, PCCLIENT C, PCMOVENDPEND M
    WHERE C.CODCLI=P.CODCLI AND P.NUMPED=M.NUMPED
    AND P.POSICAO='M' AND P.ORIGEMPED='R' AND M.POSICAO = 'C'
    --AND P.DATA=:1 
    AND P.CODFILIAL=:1
    GROUP BY M.POSICAO,P.CODFILIAL,P.NUMPED,P.CODCLI,C.CLIENTE,P.DATA,P.POSICAO,P.ORIGEMPED,P.VLATEND,C.CGCENT`,[parameter.codfilial]);
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
    `SELECT P.CODFILIAL,P.NUMPED,P.VLATEND AS VALORTOTALPED,P.CODCLI,C.CLIENTE,P.DATA,P.POSICAO,P.ORIGEMPED,'C' AS POSICAOOS,REPLACE(REPLACE(REPLACE(C.CGCENT,'.',''),'/',''),'-','') AS CGCENT
    FROM PCPEDC P, PCCLIENT C
    WHERE C.CODCLI=P.CODCLI
    AND P.POSICAO IN ('B','L','M') AND P.ORIGEMPED='R'
    --AND P.DATA=:1 
    AND P.CODFILIAL=:1
    GROUP BY P.CODFILIAL,P.NUMPED,P.CODCLI,C.CLIENTE,P.DATA,P.POSICAO,P.ORIGEMPED,P.VLATEND,C.CGCENT`,[parameter.codfilial]);
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

//GET PEDIDOS PARA FATURAMENTO POR PIX - PEDIDOS RCA - VENDAS EXTERNAS
async function PedidosRca(parameter,req, res){
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
    `SELECT P.CODFILIAL,P.NUMPED,P.VLATEND AS VALORTOTALPED,P.CODCLI,C.CLIENTE,P.DATA,P.POSICAO,P.ORIGEMPED,'C' AS POSICAOOS,REPLACE(REPLACE(REPLACE(C.CGCENT,'.',''),'/',''),'-','') AS CGCENT
    FROM PCPEDC P, PCCLIENT C
    WHERE C.CODCLI=P.CODCLI
    AND P.POSICAO IN ('B','L','P') AND P.ORIGEMPED IN ('F','T','W')
    --AND P.DATA=:1 
    AND P.CODFILIAL=:1
    GROUP BY P.CODFILIAL,P.NUMPED,P.CODCLI,C.CLIENTE,P.DATA,P.POSICAO,P.ORIGEMPED,P.VLATEND,C.CGCENT`,[parameter.codfilial]);
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
          //console.log(parametro)
          result = await connection.execute(`INSERT INTO PIX(
            pixid,txid ,numped,vlpix,cpfcnpj,txtimgqrcode,
            numrevisao,status,dtexpiracao,obspix,dtcriacaopix,codfilial,codfuncpix,expiration_time) 
            VALUES (
            (SELECT (MAX(P.PIXID)+1) FROM PIX P),:1,:2,:3,:4,
            :5,:6,:7,:8,:9,:10,:11,:12,:13)`,
            [parametro.txid,parametro.numped,parametro.vlpix,parametro.cpfcnpj,parametro.txtimgqrcode
            ,parametro.numrevisao,parametro.status,dtexpiracao,parametro.obspix,parametro.dtcriacaopix
            ,parametro.codfilial,parametro.codfuncpix,parametro.expiration_time]
            ,{autoCommit: true});
          if (result.affectedRows == 0) {
            
            console.log('NENHUM PIX INSERRIDO! - QTD: ' + result);
          } else {
            console.log(result)
            return res.send(result)
          }
        }else{
          console.log('DADOS INVALIDOS - REVEJA OS PARAMETROS PASSADOS')
          return res.send(result)
        }
                   
    } catch (err) {
      //send error message
      console.error(err.message + ' - InsertPix');
      return  res.send(result) 
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
      result_last_value = await connection.execute("SELECT PCESTCR.VALOR FROM PCESTCR WHERE CODCOB   = 'D' AND CODBANCO = 1");
      
      if (result_last_value.rows.length == 0) {
        console.log('NENHUM REGISTRO ENCONTRADO LAST VALUE PCESTCR - geraCredito618')
        
      } else {
        const doubles = result_last_value.rows.map(function(newsql) {return {value_estcr:newsql[0]} })
        console.log("VALOR DA PCESCR PEGO COM SUCESSO: " + doubles[0].value_estcr + ' - ' + parametro.valor)
        console.log('TIPO DE DADO - VLTOTAL ESCTCR: ' + typeof (doubles[0].value_estcr)) //retorna um number
        console.log('TIPO DE DADO - VALOR DA TRANSACAO: ' + typeof (parametro.valor)) //retorna uma string
        let value_estcr_ftm=doubles[0].value_estcr.toFixed(2).replace('.', ',')
        let parametro_valor_fmt=parametro.valor.replace('.', ',');
        console.log('VALOR FORMATADO ' + value_estcr_ftm)
        console.log('VALOR FORMATADO ' + parametro_valor_fmt)
        
        //2--ATUALIZA O VALOR DA PCESTCR SOMANDO COM O VALOR DO CREDITO GERADO
        //update_value_estcr = await connection.execute("UPDATE PCESTCR SET VALOR = ('3846498.05') WHERE CODCOB = 'D' AND CODBANCO = 1",[doubles[0].value_estcr,parametro.valor ]);
        update_value_estcr = await connection.execute("UPDATE PCESTCR SET VALOR = (:1+:2) WHERE CODCOB = 'D' AND CODBANCO = 1",[value_estcr_ftm,parametro_valor_fmt]);        
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
              console.log(hist2,parametro_valor_fmt,valoratualizadopcestcr,hora,minuto,parametro.matricula,parametro.codcli
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
                  ,sysdate,1,'D'
                  ,'INCLUSAO MANUAL DE CREDITO CLIENTE'
                  ,:1,:2,'D',0,null,:3,:4,:5,:6,'B','618',:7,:8)`,
              [hist2,parametro_valor_fmt,valoratualizadopcestcr,hora,minuto,parametro.matricula,parametro.codcli
              ,parametro.codfilial]);
              // 18 CAMPOS NO INSERT
              // 8 BINDS
              // 10 SETADOS FIXOS NO INSERT
              let pcmovcr_sql=result_insert_pcmovcr;
              if(pcmovcr_sql.rowsAffected == 0){
                console.log('NENHUM REGISTRO INSERIDO NA PCMOVCR -- geraCredito618')
              }else{
                console.log('REGISTRO DE CONCILIACAO BANCARIA INSERIDO COM SUCESSO NA PCMOVCR - PIX BB')
                console.log(pcmovcr_sql)
                let historico='CRED. AUTO. BAIXA PIX - FRENTE DE LOJA'

                result_codigo = await connection.execute("SELECT DFSEQ_PCCRECLI.NEXTVAL AS PROXCODIGO FROM DUAL");
                const proxcodigo = result_codigo.rows.map(function(newsql) {return {proxcodigo:newsql[0]} })
                result_numcred = await connection.execute("SELECT DFSEQ_PCCRECLI_NUMCRED.NEXTVAL AS PROXNUMCRED FROM DUAL");
                const proxnumcred = result_numcred.rows.map(function(newsql) {return {proxnumcred:newsql[0]} })
                
                console.log(parametro.codcli,parametro.codfilial,parametro.valor,parametro.matricula,
                  hora,minuto,historico,parametro.matricula,parametro.numped,
                  proxcodigo[0].proxcodigo,proxnumcred[0].proxnumcred)
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
                ,	NUMCRED)    	             
                VALUES        	      
                (:1,TRUNC(SYSDATE),:2,:3,:4,:5,:6,'CRED. AUTO. BAIXA PIX - FRENTE DE LOJA',:7,:8,'S',1,(SELECT NVL(PROXNUMTRANS,1)+1 AS PROXNUMTRANS FROM PCCONSUM P),618,:9,:10)`,
              [parametro.codcli,parametro.codfilial,parametro_valor_fmt,parametro.matricula,
              hora,minuto,parametro.matricula,parametro.numped,
              proxcodigo[0].proxcodigo,proxnumcred[0].proxnumcred]);
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
    console.log(parametro)
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
    result = await connection.execute(`SELECT C.CODCLI,C.CLIENTE,REPLACE(REPLACE(REPLACE(C.CGCENT,'.',''),'/',''),'-','') AS CGCENT FROM PCCLIENT C WHERE C.CLIENTE LIKE UPPER(:1) `,[parameter.nome]);
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
  }