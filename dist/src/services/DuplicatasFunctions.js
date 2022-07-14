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
const oracledb_DuplicatasFunctions = require('oracledb');
//GET DUPLICATAS EM ABERTO RCA - GERACAO DE PIX
function GetDuplicRCACliente(req, res, params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var connection = yield oracledb_DuplicatasFunctions.getConnection({
                user: process.env.USERNAME,
                password: process.env.PASSWORD,
                connectString: process.env.CONNECTSTRING
            });
            console.log('CONCETADO NO BANCO! -- GET DUPLIC RCA');
            // run query to get all employees
            let result = yield connection.execute(`SELECT P.CODFILIAL,P.DUPLIC,P.PREST,P.NUMPED,P.VALOR,P.CODCLI,C.CLIENTE,P.DTVENC
      ,REPLACE(REPLACE(REPLACE(C.CGCENT,'.',''),'/',''),'-','') AS CGCENT
      ,CASE WHEN P.DTVENC<SYSDATE THEN ((2*p.valor)/100) ELSE 0 END AS VALOR_MULTA
      ,CASE WHEN P.DTVENC<SYSDATE THEN ROUND((SYSDATE-P.DTVENC)-1) ELSE 0 END AS QTDIAS_JUROS
      ,CASE WHEN P.DTVENC<SYSDATE THEN (CASE WHEN DU.DIAFINANCEIRO='N' THEN (SELECT COUNT(*) FROM PCDIASUTEIS D WHERE D.CODFILIAL=P.CODFILIAL AND D.DIAFINANCEIRO='S' AND D.DATA BETWEEN P.DTVENC AND SYSDATE) ELSE (SELECT COUNT(*) FROM PCDIASUTEIS D WHERE D.CODFILIAL=P.CODFILIAL AND D.DIAFINANCEIRO='S' AND D.DATA BETWEEN P.DTVENC AND SYSDATE) END) ELSE 0 END AS QTDIAS_JUROS_DIAS_UTEIS
      ,CASE WHEN P.DTVENC<SYSDATE THEN (((5*P.VALOR)/100)/30) ELSE 0 END AS VLMORA
      ,(P.VALOR + (CASE WHEN P.DTVENC<SYSDATE THEN ((2*p.valor)/100) ELSE 0 END) + ((CASE WHEN P.DTVENC<SYSDATE THEN ROUND((SYSDATE-P.DTVENC)-1) ELSE 0 END) * CASE WHEN P.DTVENC<SYSDATE THEN (((5*P.VALOR)/100)/30) ELSE 0 END ) ) AS VLJUROSMULTADIASCORRIDOS
      ,C.EMAILNFE AS EMAILCLIENTE,U.EMAIL AS EMAILRCA
      FROM PCPREST P,PCCLIENT C, PCDIASUTEIS DU, PCUSUARI U
      WHERE DU.DATA=P.DTVENC AND DU.CODFILIAL=P.CODFILIAL --AND DU.DIAFINANCEIRO='S'
      AND P.CODCLI=C.CODCLI AND P.CODUSUR=U.CODUSUR AND P.DTPAG IS NULL AND P.VPAGO IS NULL 
      AND P.CODUSUR=:1
      AND P.CODCLI=:2
      ORDER BY P.DTVENC DESC`, [params.codrca, params.codcli]);
            if (result.rows.length == 0) {
                //query return zero employees
                return res.send('NENHUM REGISTRO ENCONTRADO -- GET DUPLIC RCA');
            }
            else {
                console.log("DUPLICATAS ENCONTRADAS: " + result.rows.length);
                //send all employees
                const doubles = result.rows.map(function (newsql) {
                    return {
                        CODFILIAL: newsql[0],
                        DUPLIC: newsql[1],
                        PREST: newsql[2],
                        NUMPED: newsql[3],
                        VALOR: newsql[4],
                        CODCLI: newsql[5],
                        CLIENTE: newsql[6],
                        DTVENC: newsql[7],
                        CPFCNPJ: newsql[8],
                        VALORMULTA: newsql[9],
                        QTDIAS: newsql[10],
                        QTDIASUTEIS: newsql[11],
                        VLMORA: newsql[12],
                        VLTOTALJUROSMULTA: newsql[13],
                        EMAIL: newsql[14],
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
//GET DUPLICATAS EM ABERTO RCA AGRUPADOS POR VALOR
function getDuplicAbertoRca(req, res, params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var connection = yield oracledb_DuplicatasFunctions.getConnection({
                user: process.env.USERNAME,
                password: process.env.PASSWORD,
                connectString: process.env.CONNECTSTRING
            });
            console.log('CONCETADO NO BANCO! -- GET DUPLIC ABERTO RCA');
            // run query to get all employees
            let result = yield connection.execute(`SELECT P.CODCLI,C.CLIENTE,SUM(P.VALOR) AS VALOR_DEVIDO_SEM_MULTA_JUROS 
          ,SUM((P.VALOR + (CASE WHEN P.DTVENC<SYSDATE THEN ((2*p.valor)/100) ELSE 0 END) + ((CASE WHEN P.DTVENC<SYSDATE THEN ROUND((SYSDATE-P.DTVENC)-1) ELSE 0 END) * CASE WHEN P.DTVENC<SYSDATE THEN (((5*P.VALOR)/100)/30) ELSE 0 END ) )) AS VLJUROSMULTADIASCORRIDOS
          FROM PCPREST P, PCCLIENT C WHERE P.CODCLI=C.CODCLI AND P.DTPAG IS NULL AND P.CODUSUR=:1 GROUP BY P.CODCLI,C.CLIENTE`, [params.codrca]);
            if (result.rows.length == 0) {
                //query return zero employees
                return res.send('NENHUM REGISTRO ENCONTRADO -- GET DUPLIC ABERTO RCA');
            }
            else {
                console.log("DUPLICATAS ENCONTRADAS: " + result.rows.length);
                //send all employees
                const doubles = result.rows.map(function (newsql) {
                    return {
                        codcli: newsql[0],
                        cliente: newsql[1],
                        nome_completo: newsql[2],
                        valor_devido_sem_juros_multa: newsql[3],
                        VLJUROSMULTADIASCORRIDOS: newsql[4],
                    };
                });
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
                    console.log('CONEXAO COM O BANCO FECHADA COM SUCESSO -- GET DUPLIC ABERTO RCA');
                }
                catch (err) {
                    console.error(err.message);
                }
            }
        }
    });
}
module.exports = {
    GetDuplicRCACliente: GetDuplicRCACliente,
    getDuplicAbertoRca: getDuplicAbertoRca
};
