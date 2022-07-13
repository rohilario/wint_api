const oracledb_ClientesFunctions = require('oracledb');

  //GET DUPLICATAS EM ABERTO RCA - GERACAO DE PIX
  async function getClienteRca(req, res, params){
    try {
      var connection = await oracledb_ClientesFunctions.getConnection({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTSTRING
      });
      console.log('CONCETADO NO BANCO! -- GET DUPLIC RCA');
      // run query to get all employees
      const result = await connection.execute(
      `SELECT C.CODCLI,C.CLIENTE,C.CODCLI||' - '||C.CLIENTE AS NOME_COMPLETO,C.CGCENT,C.EMAILNFE AS EMAILCLIENTE,U.EMAIL AS EMAILRCA
      FROM PCCLIENT C, PCUSUARI U WHERE C.CODUSUR1=U.CODUSUR AND C.DTEXCLUSAO IS NULL AND C.CODUSUR1=:1 AND C.CODCLI=:2`,[params.codrca,params.codcli]);
      if (result.rows.length == 0) {
        //query return zero employees
        return res.send('NENHUM REGISTRO ENCONTRADO -- GET DUPLIC RCA');
      } else {
        console.log("DUPLICATAS ENCONTRADAS: " + result.rows.length)
        //send all employees
        const doubles = result.rows.map(function(newsql) {
            return {
                    codcli:newsql[0],
                    cliente:newsql[1],
                    nome_completo:newsql[2],
                    cpfcnpj:newsql[3],
                    emailcliente:newsql[4],
                    emailrca:newsql[5],

            }
        })
        //console.log(session)
        //console.log(alter_session)
        //console.log(after_session)
        return res.send(doubles);
      }
    } catch (err:any) {
      //send error message
      return res.send(err.message);
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET DUPLIC RCA');
        } catch (err:any) {
          console.error(err.message);
        }
      }
    }
  }
  module.exports={
    getClienteRca:getClienteRca,
  }