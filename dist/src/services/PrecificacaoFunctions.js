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
const oracledb_Precificacao = require('oracledb');
//LIBERA PEDIDO - RETORNO PAGAMENTO
function AtualizaPrecoVenda(parametro, req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let dtexpiracao = new Date().toLocaleString('pt-BR');
        try {
            var connection = yield oracledb_Precificacao.getConnection({
                user: process.env.USERNAME,
                password: process.env.PASSWORD,
                connectString: process.env.CONNECTSTRING
            });
            console.log('CONECTADO NO BANCO - ATUALIZA PRECO VENDA - PREDIFY ');
            const result_update_produto = yield connection.execute(`UPDATE PCTABPR PR SET PR.PTABELA=:1,PR.PTABELA1=(:1-(:1*0.02)),PR.PTABELA2=:1 , PR.DTULTALTPTABELA=SYSDATE WHERE PR.CODPROD=:2 AND PR.NUMREGIAO=:3;`, [parametro.numped], { autoCommit: true });
            if (result_update_produto.affectedRows == 0) {
                console.log('NENHUM PRODUTO ATUALIZADO! - ' + result_update_produto);
            }
            else {
                console.log('PRODUTO ATUALIZADO COM SUCESSO');
                console.log(result_update_produto);
                return res.send(result_update_produto);
            }
        }
        catch (err) {
            //send error message
            console.error(err.message + ' - ATUALIZA PRECO VENDA - PREDIFY');
            return res.send(err);
        }
        finally {
            if (connection) {
                try {
                    // Always close connections
                    yield connection.close();
                    console.log('CONEXAO FECHADA COM SUCESSO! - ATUALIZA PRECO VENDA - PREDIFY ');
                }
                catch (err) {
                    console.error(err.message + ' ATUALIZA PRECO VENDA - PREDIFY');
                }
            }
        }
    });
}
module.exports = {
    AtualizaPrecoVenda: AtualizaPrecoVenda
};
