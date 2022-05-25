const oracledb = require('oracledb');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const axios = require('axios');
const json2csv =   require('json2csv');
var EasyFtp = require('easy-ftp');

//GET SEGMENTOS FROM DUAL
async function getSegmentos(req, res){
    try {
      const connection = await oracledb.getConnection('appspool');
      console.log('CONCETADO NO BANCO! -- GET SEGMENTOS - SMARKETING INTEGRATION');
      // run query to get all employees
      result = await connection.execute(`SELECT '1' AS SEQSEGMENTO, 'DISTRIBUIDORA DE MATERIAL DE CONSTRUCAO' AS SEGMENTO FROM DUAL`);
      if (result.rows.length == 0) {
        //query return zero employees
        return res.send('NENHUM REGISTRO ENCONTRADO -- GET SEGMENTOS - SMARKETING INTEGRATION');
      } else {
        //send all employees
        const doubles = result.rows.map(function(newsql) {
            return {seqsegmento:newsql[0],segmento:newsql[1]}
        })
        now = new Date().getTime()
            nowdate = new Date(now)
            const csv = json2csv.parse(doubles,{ delimiter: '|', quote: '' });
            const filename='segmento-'+nowdate.toLocaleString("af")+'.csv';
            const filenamefmt=filename.replace(/\:|\/|\s/g, '-')

        try {
            if(csv){
                //console.log(filenamefmt)
                fs.writeFile('/var/www/html/wint_api/src/upload/'+filenamefmt, csv, 'utf8', function(err) {
                    if (err) {
                      console.log('ERRO AO SALVAR O ARQUIVO ' + filenamefmt);
                    } else {
                      console.log('ARQUIVO ' + filenamefmt + ' SALVO COM SUCESSO!');
                      //CONECTAR VIA FTP PARA SALVAR O ARQUIVO
                      let ftp = new EasyFtp();
                      let config = {
                          host: 'ftp.smarketsolutions.com.br',
                          port: 21,
                          username: 'rofedistribuidora',
                          password: 'NTdlNDEyNGM4OGFl',
                          type : 'ftp'
                        };
                        ftp.connect(config);	
                        console.log('JOGANDO ARQUIVO PARA DIRETORIO REMOTO...');
                        ftp.upload("/var/www/html/wint_api/src/upload/"+filenamefmt, "/"+filenamefmt, function(err){
                            if(err){
                                ftp.close();
                                return res.status(400).send(err)
                            }else{
                                res.status(200).send({"MSG":"ARQUIVO ENVIADO COM SUCESSO GET SEGMENTOS"})
                            }
                        }); 
                        //return res.status(200).send({"msg":"arquivo enviado com sucesso!"})
                        //ftp.close();
                    }
                  });
            }
          } catch (err) {
            console.error(err);
          }

        //console.log(doubles)
        //return res.send(doubles);
      }
    } catch (err) {
      //send error message
      console.log(err)
      return res.send(err);
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET SEGMENTOS - SMARKETING INTEGRATION');
        } catch (err) {
          console.error(err);
        }
      }
    }
  }


//GET LOJAS - REGIOES WINTHOR
async function getLojas(req, res){
    try {
      const connection = await oracledb.getConnection('appspool');
      console.log('CONCETADO NO BANCO! -- GET LOJAS - SMARKETING INTEGRATION');
      // run query to get all employees
      result = await connection.execute(`SELECT R.NUMREGIAO AS SEQLOJA,1 AS SEQSEGMENTO,
      CASE WHEN F.CODIGO=99 THEN '6' ELSE F.CODIGO END  || ' - ' || CASE WHEN F.CODIGO=99 THEN 'COMERCIAL ROFE LTDA (F-PI)' ELSE F.RAZAOSOCIAL END || ' - ' || R.REGIAO AS LOJA
      ,'0' AS CD,'' AS BANDEIRA,'1' AS STATUS, F.ENDERECO AS LOGRADOURO,F.NUMERO,F.COMPLEMENTOENDERECO
      ,F.BAIRRO,F.CIDADE,F.UF AS ESTADO,'BRASIL' AS PAIS,REPLACE(REPLACE(F.CEP,'-',''),'.','') AS CEP,F.RAZAOSOCIAL AS RAZAO_SOCIAL,F.CGC AS CNPJ
      FROM PCREGIAO R, PCFILIAL F WHERE R.CODFILIAL=F.CODIGO AND R.STATUS='A' AND F.CODIGO IN (1,6,8,99) AND R.NUMREGIAO NOT IN (6,7,20,21,23,31)
      ORDER BY R.NUMREGIAO`);
      if (result.rows.length == 0) {
        //query return zero employees
        return res.send('NENHUM REGISTRO ENCONTRADO -- GET LOJAS - SMARKETING INTEGRATION');
      } else {
        //send all employees
        const doubles = result.rows.map(function(newsql) {
            return {
                    seqloja:newsql[0],
                    seqsegmento:newsql[1],
                    loja:newsql[2],
                    cd:newsql[3],
                    bandeira:newsql[4],
                    status:newsql[5],
                    logradouro:newsql[6],
                    numero:newsql[7],
                    complemento:newsql[8],
                    bairro:newsql[9],
                    cidade:newsql[10],
                    estado:newsql[11],
                    pais:newsql[12],
                    cep:newsql[13],
                    razao_social:newsql[14],
                    cnpj:newsql[15]
            }
        })
        now = new Date().getTime()
            nowdate = new Date(now)
            const csv = json2csv.parse(doubles,{ delimiter: '|', quote: '' });
            const filename='loja-'+nowdate.toLocaleString("af")+'.csv';
            const filenamefmt=filename.replace(/\:|\/|\s/g, '-')

        try {
            if(csv){
                //console.log(filenamefmt)
                fs.writeFile('/var/www/html/wint_api/src/upload/'+filenamefmt, csv, 'utf8', function(err) {
                    if (err) {
                      console.log('ERRO AO SALVAR O ARQUIVO ' + filenamefmt);
                    } else {
                      console.log('ARQUIVO ' + filenamefmt + ' SALVO COM SUCESSO!');
                      //CONECTAR VIA FTP PARA SALVAR O ARQUIVO
                      let ftp = new EasyFtp();
                      let config = {
                          host: 'ftp.smarketsolutions.com.br',
                          port: 21,
                          username: 'rofedistribuidora',
                          password: 'NTdlNDEyNGM4OGFl',
                          type : 'ftp'
                        };
                        ftp.connect(config);	
                        console.log('JOGANDO ARQUIVO PARA DIRETORIO REMOTO...');
                        ftp.upload("/var/www/html/wint_api/src/upload/"+filenamefmt, "/"+filenamefmt, function(err){
                            if(err){
                                ftp.close();
                                return res.status(400).send(err)
                            }else{
                                res.status(200).send({"MSG":"ARQUIVO ENVIADO COM SUCESSO"})
                            }
                        }); 
                        //return res.status(200).send({"msg":"arquivo enviado com sucesso!"})
                        //ftp.close();
                    }
                  });
            }
          } catch (err) {
            console.error(err);
          }

        //console.log(doubles)
        //return res.send(doubles);
      }
    } catch (err) {
      //send error message
      console.log(err)
      return res.send(err);
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET LOJAS - SMARKETING INTEGRATION');
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  async function getCategoria(req, res){
    try {
      const connection = await oracledb.getConnection('appspool');
      console.log('CONCETADO NO BANCO! -- GET CATEGORIAS - SMARKETING INTEGRATION');
      // run query to get all employees
      result = await connection.execute(`SELECT D.CODEPTO AS SEQCATEGORIA,'' AS SEQCATEGORIA_PAI, D.DESCRICAO AS CATEGORIA FROM PCDEPTO D --WHERE D.CODEPTO=10011`);
      if (result.rows.length == 0) {
        //query return zero employees
        return res.send('NENHUM REGISTRO ENCONTRADO -- GET CATEGORIAS - SMARKETING INTEGRATION');
      } else {
        //send all employees
        const doubles = result.rows.map(function(newsql) {
            return {
                    seqcategoria:newsql[0],
                    seqcategoria_pai:newsql[1],
                    categoria:newsql[2],
            }
        })

        try {
            now = new Date().getTime()
            nowdate = new Date(now)
            const csv = json2csv.parse(doubles,{ delimiter: '|', quote: '' });
            const filename='categoria-'+nowdate.toLocaleString("af")+'.csv';
            const filenamefmt=filename.replace(/\:|\/|\s/g, '-')
            if(csv){
                console.log(filenamefmt)
                fs.writeFile('/var/www/html/wint_api/src/upload/'+filenamefmt, csv, 'utf8', function(err) {
                    if (err) {
                      console.log('ERRO AO SALVAR O ARQUIVO ' + filenamefmt);
                    } else {
                      console.log('ARQUIVO ' + filenamefmt + ' SALVO COM SUCESSO!');
                      //CONECTAR VIA FTP PARA SALVAR O ARQUIVO
                      let ftp = new EasyFtp();
                      let config = {
                          host: 'ftp.smarketsolutions.com.br',
                          port: 21,
                          username: 'rofedistribuidora',
                          password: 'NTdlNDEyNGM4OGFl',
                          type : 'ftp'
                        };
                        ftp.connect(config);	
                        console.log('JOGANDO ARQUIVO PARA DIRETORIO REMOTO...')
                        ftp.upload("/var/www/html/wint_api/src/upload/"+filenamefmt, "/"+filenamefmt, function(err){
                            if(err){
                                ftp.close();
                                return res.status(400).send(err)
                            }else{
                                console.log('ARQUIVO ENVIADO COM SUCESSO AO FTP!')
                                res.status(200).send({"MSG":"ARQUIVO ENVIADO COM SUCESSO"})
                            }
                        });
                    }
                  });
            }
            
          } catch (err) {
            console.error(err);
          }

        //console.log(doubles)
        //return res.send(doubles);
      }
    } catch (err) {
      //send error message
      console.log(err)
      return res.send(err);
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET CATEGORIAS - SMARKETING INTEGRATION');
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
  async function getFornecedor(req, res){
    try {
      const connection = await oracledb.getConnection('appspool');
      console.log('CONCETADO NO BANCO! -- GET FORNECEDOR - SMARKETING INTEGRATION');
      // run query to get all employees
      result = await connection.execute(`SELECT F.CODFORNEC AS SEQFORNECEDOR
      ,TRANSLATE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(F.FORNECEDOR,'.',''),'|',''),'/',''),'*',''),';',''),CHR(10)),CHR(13)),CHR(9)),'ŠŽšžŸÁÇÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕËÜÏÖÑÝåáçéíóúàèìòùâêîôûãõëüïöñýÿ','SZszYACEIOUAEIOUAEIOUAOEUIONYaaceiouaeiouaeiouaoeuionyy') AS FORNECEDOR
      ,TRANSLATE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(F.ENDER,'.',''),'|',''),'/',''),'*',''),';',''),CHR(10)),CHR(13)),CHR(9)),'ŠŽšžŸÁÇÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕËÜÏÖÑÝåáçéíóúàèìòùâêîôûãõëüïöñýÿ','SZszYACEIOUAEIOUAEIOUAOEUIONYaaceiouaeiouaeiouaoeuionyy') AS LOGRADOURO
      ,TRANSLATE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(F.NUMEROEND,'.',''),'|',''),'/',''),'*',''),';',''),CHR(10)),CHR(13)),CHR(9)),'ŠŽšžŸÁÇÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕËÜÏÖÑÝåáçéíóúàèìòùâêîôûãõëüïöñýÿ','SZszYACEIOUAEIOUAEIOUAOEUIONYaaceiouaeiouaeiouaoeuionyy') AS NUMERO
      ,TRANSLATE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(F.COMPLEMENTOEND,'.',''),'|',''),'/',''),'*',''),';',''),CHR(10)),CHR(13)),CHR(9)),'ŠŽšžŸÁÇÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕËÜÏÖÑÝåáçéíóúàèìòùâêîôûãõëüïöñýÿ','SZszYACEIOUAEIOUAEIOUAOEUIONYaaceiouaeiouaeiouaoeuionyy') AS COMPLEMENTO
      ,TRANSLATE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(F.BAIRRO,'.',''),'|',''),'/',''),'*',''),';',''),CHR(10)),CHR(13)),CHR(9)),'ŠŽšžŸÁÇÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕËÜÏÖÑÝåáçéíóúàèìòùâêîôûãõëüïöñýÿ','SZszYACEIOUAEIOUAEIOUAOEUIONYaaceiouaeiouaeiouaoeuionyy') AS BAIRRO
      ,TRANSLATE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(F.CIDADE,'.',''),'|',''),'/',''),'*',''),';',''),CHR(10)),CHR(13)),CHR(9)),'ŠŽšžŸÁÇÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕËÜÏÖÑÝåáçéíóúàèìòùâêîôûãõëüïöñýÿ','SZszYACEIOUAEIOUAEIOUAOEUIONYaaceiouaeiouaeiouaoeuionyy') AS CIDADE
      ,F.ESTADO,'BRASIL' AS PAIS
      ,F.CEP AS CEP
      ,TRANSLATE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(F.FORNECEDOR,'.',''),'|',''),'/',''),'*',''),';',''),CHR(10)),CHR(13)),CHR(9)),'ŠŽšžŸÁÇÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕËÜÏÖÑÝåáçéíóúàèìòùâêîôûãõëüïöñýÿ','SZszYACEIOUAEIOUAEIOUAOEUIONYaaceiouaeiouaeiouaoeuionyy') AS RAZAO_SOCIAL
      ,REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(F.CGC,'.',''),'/',''),'-',''),CHR(10)),CHR(13)),CHR(9)) AS CNPJ
      ,REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(F.IE,'.',''),'/',''),'-',''),CHR(10)),CHR(13)),CHR(9)) AS IE
      FROM PCFORNEC F 
      WHERE F.DTEXCLUSAO IS NULL AND F.REVENDA='S'`);
      if (result.rows.length == 0) {
        //query return zero employees
        return res.send('NENHUM REGISTRO ENCONTRADO -- GET FORNECEDOR - SMARKETING INTEGRATION');
      } else {
        //send all employees
        const doubles = result.rows.map(function(newsql) {
            return {
                SEQFORNECEDOR:newsql[0],
                FORNECEDOR:newsql[1],
                LOGRADOURO:newsql[2],
                NUMERO:newsql[3],
                COMPLEMENTO:newsql[4],
                BAIRRO:newsql[5],
                CIDADE:newsql[6],
                ESTADO:newsql[7],
                PAIS:newsql[8],
                CEP:newsql[9],
                RAZAO_SOCIAL:newsql[10],
                CNPJ:newsql[11],
                IE:newsql[12]
            }
        })

        try {
            now = new Date().getTime()
            nowdate = new Date(now)
            const csv = json2csv.parse(doubles,{ delimiter: '|', quote: '' });
            const filename='fornecedor-'+nowdate.toLocaleString("af")+'.csv';
            const filenamefmt=filename.replace(/\:|\/|\s/g, '-')
            if(csv){
                console.log(filenamefmt)
                fs.writeFile('/var/www/html/wint_api/src/upload/'+filenamefmt, csv, 'utf8', function(err) {
                    if (err) {
                      console.log('ERRO AO SALVAR O ARQUIVO ' + filenamefmt);
                    } else {
                      console.log('ARQUIVO ' + filenamefmt + ' SALVO COM SUCESSO!');
                      //CONECTAR VIA FTP PARA SALVAR O ARQUIVO
                      let ftp = new EasyFtp();
                      let config = {
                          host: 'ftp.smarketsolutions.com.br',
                          port: 21,
                          username: 'rofedistribuidora',
                          password: 'NTdlNDEyNGM4OGFl',
                          type : 'ftp'
                        };
                        ftp.connect(config);	
                        console.log('JOGANDO ARQUIVO PARA DIRETORIO REMOTO...')
                        ftp.upload("/var/www/html/wint_api/src/upload/"+filenamefmt, "/"+filenamefmt, function(err){
                            if(err){
                                ftp.close();
                                return res.status(400).send(err)
                            }else{
                                console.log('ARQUIVO ENVIADO COM SUCESSO PARA O FTP')
                                res.status(200).send({"MSG":"ARQUIVO ENVIADO COM SUCESSO"})
                            }
                        }); 
                    }
                  });
            }
            
          } catch (err) {
            console.error(err);
          }

        //console.log(doubles)
        //return res.send(doubles);
      }
    } catch (err) {
      //send error message
      console.log(err)
      return res.send(err);
    } finally {
      if (connection) {
          // Always close connections
          await connection.close();
          console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET FORNECEDOR - SMARKETING INTEGRATION');
      }
    }
  }

  async function getProdutos(req, res){
    try {
      const connection = await oracledb.getConnection('appspool');
      console.log('CONCETADO NO BANCO! -- GET FORNECEDOR - SMARKETING INTEGRATION');
      // run query to get all employees
      result = await connection.execute(
        `
        SELECT P.CODPROD AS SEQPRODUTO, P.CODEPTO AS SEQCATEGORIA,'' AS SEQFAMILIA
        ,'' AS SEQSIMILARIDADE, P.CODFORNEC AS SEQFORNECEDOR
        ,TRANSLATE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(P.DESCRICAO,'.',''),'|',''),'/',''),'*',''),';',''),CHR(10)),CHR(13)),CHR(9)),'ŠŽšžŸÁÇÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕËÜÏÖÑÝåáçéíóúàèìòùâêîôûãõëüïöñýÿ','SZszYACEIOUAEIOUAEIOUAOEUIONYaaceiouaeiouaeiouaoeuionyy') AS DESCRICAO
        ,TRANSLATE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(P.EMBALAGEM,'.',''),'|',''),'/',''),'*',''),';',''),CHR(10)),CHR(13)),CHR(9)),'ŠŽšžŸÁÇÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕËÜÏÖÑÝåáçéíóúàèìòùâêîôûãõëüïöñýÿ','SZszYACEIOUAEIOUAEIOUAOEUIONYaaceiouaeiouaeiouaoeuionyy') AS TIPO_EMBALAGEM
        ,P.QTUNIT AS QUANTIDADE_EMBALAGEM,'' AS QUANTIDADE_PROPORCIONAL,'' AS UNIDADE_EMBALAGEM
        ,'' AS UNIDADE_PROPORCIONAL
        ,'' AS PRECO_ATACADO,'' AS CUSTO_LIQUIDO,'' AS ALIQUOTA, '' QUANTIDADE_ATACADO, '' AS QUANTIDADE_CAIXA 
        FROM PCPRODUT P WHERE P.DTEXCLUSAO IS NULL

      `);
      if (result.rows.length == 0) {
        //query return zero employees
        return res.send('NENHUM REGISTRO ENCONTRADO -- GET PRODUTOS DESCRICAO - SMARKETING INTEGRATION');
      } else {
        //send all employees
        const doubles = result.rows.map(function(newsql) {
            return {
                SEQPRODUTO:newsql[0],
                SEQCATEGORIA:newsql[1],
                SEQFAMILIA:newsql[2],
                SEQSIMILARIDADE:newsql[3],
                SEQFORNECEDOR:newsql[4],
                DESCRICAO:newsql[5],
                TIPO_EMBALAGEM:newsql[6],
                QUANTIDADE_EMBALAGEM:newsql[7],
                QUANTIDADE_PROPORCIONAL:newsql[8],
                UNIDADE_EMBALAGEM:newsql[9],
                UNIDADE_PROPORCIONAL:newsql[10]
            }
        })

        try {
            now = new Date().getTime()
            nowdate = new Date(now)
            const csv = json2csv.parse(doubles,{ delimiter: '|', quote: '' });
            const filename='produto_descricao-'+nowdate.toLocaleString("af")+'.csv';
            const filenamefmt=filename.replace(/\:|\/|\s/g, '-')
            if(csv){
                console.log(filenamefmt)
                fs.writeFile('/var/www/html/wint_api/src/upload/'+filenamefmt, csv, 'utf8', function(err) {
                    if (err) {
                      console.log('ERRO AO SALVAR O ARQUIVO ' + filenamefmt);
                    } else {
                      console.log('ARQUIVO ' + filenamefmt + ' SALVO COM SUCESSO!');
                      //CONECTAR VIA FTP PARA SALVAR O ARQUIVO
                      let ftp = new EasyFtp();
                      let config = {
                          host: 'ftp.smarketsolutions.com.br',
                          port: 21,
                          username: 'rofedistribuidora',
                          password: 'NTdlNDEyNGM4OGFl',
                          type : 'ftp'
                        };
                        ftp.connect(config);	
                        console.log('JOGANDO ARQUIVO PARA DIRETORIO REMOTO...')
                        /* ftp.upload("/var/www/html/wint_api/src/upload/"+filenamefmt, "/"+filenamefmt, function(err){
                            if(err){
                                ftp.close();
                                return res.status(400).send(err)
                            }else{
                                console.log('ARQUIVO ENVIADO COM SUCESSO AO FTP')
                                res.status(200).send({"MSG":"ARQUIVO ENVIADO COM SUCESSO"})
                            }
                        }); */
                    }
                  });
            }
            
          } catch (err) {
            console.error(err);
          }

        //console.log(doubles)
        //return res.send(doubles);
      }
    } catch (err) {
      //send error message
      console.log(err)
      return res.send(err);
    } finally {
      if (connection) {
          // Always close connections
          await connection.close();
          console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET PRODUTOS DESCRICAO - SMARKETING INTEGRATION');
      }
    }
  }

  async function getProdutoPreco(req, res){
    try {
      const connection = await oracledb.getConnection('appspool');
      console.log('CONCETADO NO BANCO! -- GET PRODUTOS PRECOS - SMARKETING INTEGRATION');
      // run query to get all employees
      result = await connection.execute(`SELECT T.CODPROD AS SEQPRODUTO,R.NUMREGIAO AS SEQLOJA,ROUND(T.PVENDA2,2) AS PRECO_NORMAL
      , '' AS PRECO_PROMOCAO, '' AS PRECO_FIDELIDADE, '' AS PRECO_ATACADO
      ,(SELECT MAX(M.PUNIT) FROM PCMOV M WHERE M.CODPROD=P.CODPROD AND M.CODOPER='E') AS CUSTO_LIQUIDO
      ,(SELECT TB.CODICM FROM PCTABTRIB TT,PCTRIBUT TB WHERE TB.CODST=TT.CODST AND TT.CODPROD=P.CODPROD AND TT.CODFILIALNF=CASE WHEN R.CODFILIAL=99 THEN TO_CHAR(6) ELSE R.CODFILIAL END AND TT.UFDESTINO=R.UF) AS ALIQUOTA
      ,'' AS QUANTIDADE_ATACADO, '' AS QUANTIDADE_CAIXA
      FROM PCTABPR T, PCREGIAO R, PCFILIAL F, PCPRODUT P 
      WHERE P.CODPROD=T.CODPROD AND T.NUMREGIAO=R.NUMREGIAO AND R.CODFILIAL=F.CODIGO 
      AND R.STATUS='A' AND F.CODIGO IN (1,6,8,99) AND R.NUMREGIAO NOT IN (6,7,20,21,23,31) AND P.DTEXCLUSAO IS NULL AND T.PVENDA2 IS NOT NULL
      --AND P.CODPROD=169002
      ORDER BY R.NUMREGIAO`);
      if (result.rows.length == 0) {
        //query return zero employees
        return res.send('NENHUM REGISTRO ENCONTRADO -- GET FORNECEDOR - SMARKETING INTEGRATION');
      } else {
        //send all employees
        const doubles = result.rows.map(function(newsql) {
            return {
                SEQPRODUTO:newsql[0],
                SEQLOJA:newsql[1],
                PRECO_NORMAL:newsql[2],
                PRECO_PROMOCAO:newsql[3],
                PRECO_FIDELIDADE:newsql[4],
                PRECO_ATACADO:newsql[5],
                CUSTO_LIQUIDO:newsql[6],
                ALIQUOTA:newsql[7],
                QUANTIDADE_ATACADO:newsql[8],
                QUANTIDADE_CAIXA:newsql[9],
            }
        })

        try {
            now = new Date().getTime()
            nowdate = new Date(now)
            const csv = json2csv.parse(doubles,{ delimiter: '|', quote: '' });
            const filename='produto_preco-'+nowdate.toLocaleString("af")+'.csv';
            const filenamefmt=filename.replace(/\:|\/|\s/g, '-')
            if(csv){
                console.log(filenamefmt)
                fs.writeFile('/var/www/html/wint_api/src/upload/'+filenamefmt, csv, 'utf8', function(err) {
                    if (err) {
                      console.log('ERRO AO SALVAR O ARQUIVO ' + filenamefmt);
                    } else {
                      console.log('ARQUIVO ' + filenamefmt + ' SALVO COM SUCESSO!');
                      //CONECTAR VIA FTP PARA SALVAR O ARQUIVO
                      let ftp = new EasyFtp();
                      let config = {
                          host: 'ftp.smarketsolutions.com.br',
                          port: 21,
                          username: 'rofedistribuidora',
                          password: 'NTdlNDEyNGM4OGFl',
                          type : 'ftp'
                        };
                        ftp.connect(config);	
                        console.log('JOGANDO ARQUIVO PARA DIRETORIO REMOTO...')
                        ftp.upload("/var/www/html/wint_api/src/upload/"+filenamefmt, "/"+filenamefmt, function(err){
                            if(err){
                                ftp.close();
                                return res.status(400).send(err)
                            }else{
                                console.log('ARQUIVO ENVIADO COM SUCESSO AO FTP!')
                                res.status(200).send({"MSG":"ARQUIVO ENVIADO COM SUCESSO"})
                            }
                        }); 
                    }
                  });
            }
            
          } catch (err) {
            console.error(err);
          }

        //console.log(doubles)
        //return res.send(doubles);
      }
    } catch (err) {
      //send error message
      console.log(err)
      return res.send(err);
    } finally {
      if (connection) {
          // Always close connections
          await connection.close();
          console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET PRODUTOS PRECOS - SMARKETING INTEGRATION');
      }
    }
  }

  async function getProdutoEstoque(req, res){
    try {
      const connection = await oracledb.getConnection('appspool');
      console.log('CONCETADO NO BANCO! -- GET PRODUTOS ESTOQUE - SMARKETING INTEGRATION');
      // run query to get all employees
      result = await connection.execute(`SELECT T.CODPROD AS SEQPRODUTO,R.NUMREGIAO AS SEQLOJA
      ,(SELECT CASE WHEN EE.QTEST IS NULL THEN 0 ELSE EE.QTEST END FROM PCEST EE WHERE EE.CODPROD=P.CODPROD AND EE.CODFILIAL= CASE WHEN R.CODFILIAL=99 THEN '1' ELSE R.CODFILIAL END) AS ESTOQUE
      ,(SELECT EE.QTPENDENTE FROM PCEST EE WHERE EE.CODPROD=P.CODPROD AND EE.CODFILIAL= CASE WHEN R.CODFILIAL=99 THEN '1' ELSE R.CODFILIAL END) AS ESTOQUE_PENDENTE
      ,0 AS MEDIA_VENDA_DIARIA
      FROM PCTABPR T, PCREGIAO R, PCFILIAL F, PCPRODUT P WHERE P.CODPROD=T.CODPROD AND T.NUMREGIAO=R.NUMREGIAO AND R.CODFILIAL=F.CODIGO 
      AND R.STATUS='A' AND F.CODIGO IN (1,6,8,99) AND R.NUMREGIAO NOT IN (6,7,20,21,23,31) AND P.DTEXCLUSAO IS NULL --AND P.CODPROD=167800
      ORDER BY R.NUMREGIAO`);
      if (result.rows.length == 0) {
        //query return zero employees
        return res.send('NENHUM REGISTRO ENCONTRADO -- GET FORNECEDOR - SMARKETING INTEGRATION');
      } else {
        //send all employees
        const doubles = result.rows.map(function(newsql) {
            return {
                SEQPRODUTO:newsql[0],
                SEQLOJA:newsql[1],
                ESTOQUE:newsql[2],
                ESTOQUE_PENDENTE:newsql[3],
                MEDIA_VENDA_DIARIA:newsql[4],
            }
        })

        try {
            now = new Date().getTime()
            nowdate = new Date(now)
            const csv = json2csv.parse(doubles,{ delimiter: '|', quote: '' });
            const filename='produto_estoque-'+nowdate.toLocaleString("af")+'.csv';
            const filenamefmt=filename.replace(/\:|\/|\s/g, '-')
            if(csv){
                console.log(filenamefmt)
                fs.writeFile('/var/www/html/wint_api/src/upload/'+filenamefmt, csv, 'utf8', function(err) {
                    if (err) {
                      console.log('ERRO AO SALVAR O ARQUIVO ' + filenamefmt);
                    } else {
                      console.log('ARQUIVO ' + filenamefmt + ' SALVO COM SUCESSO!');
                      //CONECTAR VIA FTP PARA SALVAR O ARQUIVO
                      let ftp = new EasyFtp();
                      let config = {
                          host: 'ftp.smarketsolutions.com.br',
                          port: 21,
                          username: 'rofedistribuidora',
                          password: 'NTdlNDEyNGM4OGFl',
                          type : 'ftp'
                        };
                        ftp.connect(config);	
                        console.log('JOGANDO ARQUIVO PARA DIRETORIO REMOTO...')
                        ftp.upload("/var/www/html/wint_api/src/upload/"+filenamefmt, "/"+filenamefmt, function(err){
                            if(err){
                                ftp.close();
                                return res.status(400).send(err)
                            }else{
                                console.log('ARQUIVO ENVIADO COM SUCESSO AO FTP!')
                                res.status(200).send({"MSG":"ARQUIVO ENVIADO COM SUCESSO"})
                            }
                        }); 
                    }
                  });
            }
            
          } catch (err) {
            console.error(err);
          }

        //console.log(doubles)
        //return res.send(doubles);
      }
    } catch (err) {
      //send error message
      console.log(err)
      return res.send(err);
    } finally {
      if (connection) {
          // Always close connections
          await connection.close();
          console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET PRODUTOS ESTOQUE - SMARKETING INTEGRATION');
      }
    }
  }

  async function getProdutoAtivo(req, res){
    try {
      const connection = await oracledb.getConnection('appspool');
      console.log('CONCETADO NO BANCO! -- GET PRODUTOS ATIVOS - SMARKETING INTEGRATION');
      // run query to get all employees
      result = await connection.execute(`SELECT --R.NUMREGIAO,COUNT(*)
      T.CODPROD AS SEQPRODUTO,R.NUMREGIAO AS SEQLOJA,CASE WHEN P.REVENDA='S' THEN 1 ELSE 0 END AS ATIVO
      FROM PCTABPR T, PCREGIAO R, PCFILIAL F, PCPRODUT P, PCPRODFILIAL PF, PCEST E WHERE P.CODPROD=PF.CODPROD 
      AND E.CODFILIAL=CASE WHEN R.CODFILIAL=99 THEN '1' ELSE R.CODFILIAL END AND E.CODPROD=P.CODPROD 
      AND PF.CODFILIAL=CASE WHEN R.CODFILIAL=99 THEN '1' ELSE R.CODFILIAL END AND P.CODPROD=T.CODPROD AND T.NUMREGIAO=R.NUMREGIAO AND R.CODFILIAL=F.CODIGO 
      AND R.STATUS='A' AND F.CODIGO IN (1,6,8,99) AND R.NUMREGIAO NOT IN (6,7,20,21,23,31) AND P.DTEXCLUSAO IS NULL AND E.DTULTENT IS NOT NULL
      --GROUP BY R.NUMREGIAO
      ORDER BY R.NUMREGIAO`);
      if (result.rows.length == 0) {
        //query return zero employees
        return res.send('NENHUM REGISTRO ENCONTRADO -- GET PRODUTOS ATIVOS - SMARKETING INTEGRATION');
      } else {
        //send all employees
        const doubles = result.rows.map(function(newsql) {
            return {
                SEQPRODUTO:newsql[0],
                SEQLOJA:newsql[1],
                ATIVO:newsql[2],
            }
        })

        try {
            now = new Date().getTime()
            nowdate = new Date(now)
            const csv = json2csv.parse(doubles,{ delimiter: '|', quote: '' });
            const filename='produto_ativo-'+nowdate.toLocaleString("af")+'.csv';
            const filenamefmt=filename.replace(/\:|\/|\s/g, '-')
            if(csv){
                console.log(filenamefmt)
                fs.writeFile('/var/www/html/wint_api/src/upload/'+filenamefmt, csv, 'utf8', function(err) {
                    if (err) {
                      console.log('ERRO AO SALVAR O ARQUIVO ' + filenamefmt);
                    } else {
                      console.log('ARQUIVO ' + filenamefmt + ' SALVO COM SUCESSO!');
                      //CONECTAR VIA FTP PARA SALVAR O ARQUIVO
                      let ftp = new EasyFtp();
                      let config = {
                          host: 'ftp.smarketsolutions.com.br',
                          port: 21,
                          username: 'rofedistribuidora',
                          password: 'NTdlNDEyNGM4OGFl',
                          type : 'ftp'
                        };
                        ftp.connect(config);	
                        console.log('JOGANDO ARQUIVO PARA DIRETORIO REMOTO...')
                        ftp.upload("/var/www/html/wint_api/src/upload/"+filenamefmt, "/"+filenamefmt, function(err){
                            if(err){
                                ftp.close();
                                return res.status(400).send(err)
                            }else{
                                console.log('ARQUIVO ENVIADO COM SUCESSO AO FTP!')
                                res.status(200).send({"MSG":"ARQUIVO ENVIADO COM SUCESSO"})
                            }
                        }); 
                    }
                  });
            }
            
          } catch (err) {
            console.error(err);
          }

        //console.log(doubles)
        //return res.send(doubles);
      }
    } catch (err) {
      //send error message
      console.log(err)
      return res.send(err);
    } finally {
      if (connection) {
          // Always close connections
          await connection.close();
          console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET PRODUTOS ATIVOS - SMARKETING INTEGRATION');
      }
    }
  }

  async function getProdutoEAN(req, res){
    try {
      const connection = await oracledb.getConnection('appspool');
      console.log('CONCETADO NO BANCO! -- GET PRODUTOS EAN - SMARKETING INTEGRATION');
      // run query to get all employees
      result = await connection.execute(`SELECT P.CODPROD AS SEQPRODUTO,CASE WHEN P.CODAUXILIAR IS NULL THEN 0 ELSE P.CODAUXILIAR END AS EAN,'1' AS PRINCIPAL FROM PCPRODUT P WHERE P.DTEXCLUSAO IS NULL --AND P.OBS='N'`);
      if (result.rows.length == 0) {
        //query return zero employees
        return res.send('NENHUM REGISTRO ENCONTRADO -- GET PRODUTOS EAN - SMARKETING INTEGRATION');
      } else {
        //send all employees
        const doubles = result.rows.map(function(newsql) {
            return {
                SEQPRODUTO:newsql[0],
                EAN:newsql[1],
                PRINCIPAL:newsql[2],
            }
        })

        try {
            now = new Date().getTime()
            nowdate = new Date(now)
            const csv = json2csv.parse(doubles,{ delimiter: '|', quote: '' });
            const filename='produto_ean-'+nowdate.toLocaleString("af")+'.csv';
            const filenamefmt=filename.replace(/\:|\/|\s/g, '-')
            if(csv){
                console.log(filenamefmt)
                fs.writeFile('/var/www/html/wint_api/src/upload/'+filenamefmt, csv, 'utf8', function(err) {
                    if (err) {
                      console.log('ERRO AO SALVAR O ARQUIVO ' + filenamefmt);
                    } else {
                      console.log('ARQUIVO ' + filenamefmt + ' SALVO COM SUCESSO!');
                      //CONECTAR VIA FTP PARA SALVAR O ARQUIVO
                      let ftp = new EasyFtp();
                      let config = {
                          host: 'ftp.smarketsolutions.com.br',
                          port: 21,
                          username: 'rofedistribuidora',
                          password: 'NTdlNDEyNGM4OGFl',
                          type : 'ftp'
                        };
                        ftp.connect(config);	
                        console.log('JOGANDO ARQUIVO PARA DIRETORIO REMOTO...')
                        ftp.upload("/var/www/html/wint_api/src/upload/"+filenamefmt, "/"+filenamefmt, function(err){
                            if(err){
                                ftp.close();
                                return res.status(400).send(err)
                            }else{
                                console.log('ARQUIVO ENVIADO COM SUCESSO AO FTP!')
                                res.status(200).send({"MSG":"ARQUIVO ENVIADO COM SUCESSO"})
                            }
                        }); 
                    }
                  });
            }
            
          } catch (err) {
            console.error(err);
          }

        //console.log(doubles)
        //return res.send(doubles);
      }
    } catch (err) {
      //send error message
      console.log(err)
      return res.send(err);
    } finally {
      if (connection) {
          // Always close connections
          await connection.close();
          console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET PRODUTOS EAN - SMARKETING INTEGRATION');
      }
    }
  }

  async function getCupom(req, res){
    try {
      const connection = await oracledb.getConnection('appspool');
      console.log('CONCETADO NO BANCO! -- GET CUPOM - SMARKETING INTEGRATION');
      // run query to get all employees
      result = await connection.execute(
      `SELECT I.DATA AS DT_VENDA,I.CODPROD AS SEQPRODUTO,P.CODFILIAL AS SEQLOJA, I.NUMPED AS SEQCUPOM, I.CODCLI AS SEQCLI,SUM(I.QT) AS QUANTIDADE
      ,I.PVENDA AS PRECO_UNITARIO,I.PVENDA AS CUSTO_UNITARIO, I.PERDESC AS DESCONTO_UNITARIO, '0' AS FLAG_OFERTA
      FROM PCPEDI I, PCPEDC P 
      WHERE P.NUMPED=I.NUMPED AND P.DATA= TRUNC(SYSDATE) -- AND P.NUMPED=52032839 AND I.CODPROD=151533
      GROUP BY I.NUMPED,I.DATA,I.CODPROD,P.CODFILIAL, I.CODCLI, I.QT,I.PVENDA,I.PVENDA, I.PERDESC
      `);
      if (result.rows.length == 0) {
        //query return zero employees
        return res.send('NENHUM REGISTRO ENCONTRADO -- GET CUPOM - SMARKETING INTEGRATION');
      } else {
        //send all employees
        const doubles = result.rows.map(function(newsql) {
            return {
                DT_VENDA:newsql[0],
                SEQPRODUTO:newsql[1],
                SEQLOJA:newsql[2],
                SEQCUPOM:newsql[3],
                SEQCLIENTE:newsql[4],
                QUANTIDADE:newsql[5],
                PRECO_UNITARIO:newsql[6],
                CUSTO_UNITARIO:newsql[7],
                DESCONTO_UNITARIO:newsql[8],
                FLAG_OFERTA:newsql[9],
            }
        })

        try {
            now = new Date().getTime()
            nowdate = new Date(now)
            const csv = json2csv.parse(doubles,{ delimiter: '|', quote: '' });
            const filename='cupom-'+nowdate.toLocaleString("af")+'.csv';
            const filenamefmt=filename.replace(/\:|\/|\s/g, '-')
            if(csv){
                console.log(filenamefmt)
                fs.writeFile('/var/www/html/wint_api/src/upload/'+filenamefmt, csv, 'utf8', function(err) {
                    if (err) {
                      console.log('ERRO AO SALVAR O ARQUIVO ' + filenamefmt);
                    } else {
                      console.log('ARQUIVO ' + filenamefmt + ' SALVO COM SUCESSO!');
                      //CONECTAR VIA FTP PARA SALVAR O ARQUIVO
                      let ftp = new EasyFtp();
                      let config = {
                          host: 'ftp.smarketsolutions.com.br',
                          port: 21,
                          username: 'rofedistribuidora',
                          password: 'NTdlNDEyNGM4OGFl',
                          type : 'ftp'
                        };
                        ftp.connect(config);	
                        console.log('JOGANDO ARQUIVO PARA DIRETORIO REMOTO...')
                        ftp.upload("/var/www/html/wint_api/src/upload/"+filenamefmt, "/"+filenamefmt, function(err){
                            if(err){
                                ftp.close();
                                return res.status(400).send(err)
                            }else{
                                console.log('ARQUIVO ENVIADO COM SUCESSO AO FTP!')
                                res.status(200).send({"MSG":"ARQUIVO ENVIADO COM SUCESSO"})
                            }
                        }); 
                    }
                  });
            }
            
          } catch (err) {
            console.error(err);
          }

        //console.log(doubles)
        //return res.send(doubles);
      }
    } catch (err) {
      //send error message
      console.log(err)
      return res.send(err);
    } finally {
      if (connection) {
          // Always close connections
          await connection.close();
          console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET CUPOM - SMARKETING INTEGRATION');
      }
    }
  }

  async function getMetas(req, res){
    try {
      const connection = await oracledb.getConnection('appspool');
      console.log('CONCETADO NO BANCO! -- GET METAS - SMARKETING INTEGRATION');
      // run query to get all employees
      result = await connection.execute(
        `
        SELECT D.CODEPTO AS SEQCATEGORIA, 20 AS META, 0 AS COMPETITIVIDADE, 'ENCARTE' AS MIDIA FROM  PCDEPTO D

      `);
      if (result.rows.length == 0) {
        //query return zero employees
        return res.send('NENHUM REGISTRO ENCONTRADO -- GET METAS - SMARKETING INTEGRATION');
      } else {
        //send all employees
        const doubles = result.rows.map(function(newsql) {
            return {
              SEQCATEGORIA:newsql[0],
              META:newsql[1],
              COMPETITIVIDADE:newsql[2],
              MIDIA:newsql[3]
            }
        })

        try {
            now = new Date().getTime()
            nowdate = new Date(now)
            const csv = json2csv.parse(doubles,{ delimiter: '|', quote: '' });
            const filename='meta_categoria-'+nowdate.toLocaleString("af")+'.csv';
            const filenamefmt=filename.replace(/\:|\/|\s/g, '-')
            if(csv){
                console.log(filenamefmt)
                fs.writeFile('/var/www/html/wint_api/src/upload/'+filenamefmt, csv, 'utf8', function(err) {
                    if (err) {
                      console.log('ERRO AO SALVAR O ARQUIVO ' + filenamefmt);
                    } else {
                      console.log('ARQUIVO ' + filenamefmt + ' SALVO COM SUCESSO!');
                      //CONECTAR VIA FTP PARA SALVAR O ARQUIVO
                      let ftp = new EasyFtp();
                      let config = {
                          host: 'ftp.smarketsolutions.com.br',
                          port: 21,
                          username: 'rofedistribuidora',
                          password: 'NTdlNDEyNGM4OGFl',
                          type : 'ftp'
                        };
                        ftp.connect(config);	
                        console.log('JOGANDO ARQUIVO PARA DIRETORIO REMOTO...')
                        /* ftp.upload("/var/www/html/wint_api/src/upload/"+filenamefmt, "/"+filenamefmt, function(err){
                            if(err){
                                ftp.close();
                                return res.status(400).send(err)
                            }else{
                                console.log('ARQUIVO ENVIADO COM SUCESSO AO FTP')
                                res.status(200).send({"MSG":"ARQUIVO ENVIADO COM SUCESSO"})
                            }
                        }); */
                    }
                  });
            }
            
          } catch (err) {
            console.error(err);
          }

        //console.log(doubles)
        //return res.send(doubles);
      }
    } catch (err) {
      //send error message
      console.log(err)
      return res.send(err);
    } finally {
      if (connection) {
          // Always close connections
          await connection.close();
          console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET METAS - SMARKETING INTEGRATION');
      }
    }
  }

  module.exports={
                getSegmentos:getSegmentos,
                getLojas:getLojas,
                getCategoria:getCategoria,
                getFornecedor:getFornecedor,
                getProdutos:getProdutos,
                getProdutoPreco:getProdutoPreco,
                getProdutoEstoque:getProdutoEstoque,
                getProdutoAtivo:getProdutoAtivo,
                getProdutoEAN:getProdutoEAN,
                getCupom:getCupom,
                getMetas:getMetas
}