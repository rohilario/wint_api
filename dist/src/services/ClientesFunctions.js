"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const oracledb_ClientesFunctions = require('oracledb');
//GET DUPLICATAS EM ABERTO RCA - GERACAO DE PIX
function getClienteRca(req, res, params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var connection = yield oracledb_ClientesFunctions.getConnection({
                user: process.env.USERNAME,
                password: process.env.PASSWORD,
                connectString: process.env.CONNECTSTRING
            });
            console.log('CONCETADO NO BANCO! -- GET DUPLIC RCA');
            // run query to get all employees
            const result = yield connection.execute(`SELECT C.CODCLI,C.CLIENTE,C.CODCLI||' - '||C.CLIENTE AS NOME_COMPLETO,C.CGCENT,C.EMAILNFE AS EMAILCLIENTE,U.EMAIL AS EMAILRCA
      FROM PCCLIENT C, PCUSUARI U WHERE C.CODUSUR1=U.CODUSUR AND C.DTEXCLUSAO IS NULL AND C.CODUSUR1=:1 AND C.CODCLI=:2`, [params.codrca, params.codcli]);
            if (result.rows.length == 0) {
                //query return zero employees
                return res.send('NENHUM REGISTRO ENCONTRADO -- GET DUPLIC RCA');
            }
            else {
                console.log("DUPLICATAS ENCONTRADAS: " + result.rows.length);
                //send all employees
                const doubles = result.rows.map(function (newsql) {
                    return {
                        codcli: newsql[0],
                        cliente: newsql[1],
                        nome_completo: newsql[2],
                        cpfcnpj: newsql[3],
                        emailcliente: newsql[4],
                        emailrca: newsql[5],
                    };
                });
                //console.log(session)
                //console.log(alter_session)
                //console.log(after_session)
                return res.send(doubles);
            }
        }
        catch (err) {
            //send error message
            return res.send(err.message);
        }
        finally {
            if (connection) {
                try {
                    // Always close connections
                    yield connection.close();
                    console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET DUPLIC RCA');
                }
                catch (err) {
                    console.error(err.message);
                }
            }
        }
    });
}
module.exports = {
    getClienteRca: getClienteRca,
};
