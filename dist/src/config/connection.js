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
Object.defineProperty(exports, "__esModule", { value: true });
const oracledb = require('oracledb');
function initOracleDbConection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create a connection pool which will later be accessed via the
            // pool cache as the 'default' pool.
            yield oracledb.createPool({
                user: process.env.USERNAME,
                password: process.env.PASSWORD,
                connectString: process.env.CONNECTSTRING,
                poolAlias: 'appspool',
                // edition: 'ORA$BASE', // used for Edition Based Redefintion
                // events: false, // whether to handle Oracle Database FAN and RLB events or support CQN
                // externalAuth: false, // whether connections should be established using External Authentication
                // homogeneous: true, // all connections in the pool have the same credentials
                // poolAlias: 'default', // set an alias to allow access to the pool via a name.
                // poolIncrement: 1, // only grow the pool by one connection at a time
                // poolMax: 4, // maximum size of the pool. Increase UV_THREADPOOL_SIZE if you increase poolMax
                // poolMin: 0, // start with no connections; let the pool shrink completely
                poolPingInterval: 600, // check aliveness of connection if idle in the pool for 60 seconds
                // poolTimeout: 60, // terminate connections that are idle in the pool for 60 seconds
                // queueMax: 500, // don't allow more than 500 unsatisfied getConnection() calls in the pool queue
                // queueTimeout: 60000, // terminate getConnection() calls queued for longer than 60000 milliseconds
                // sessionCallback: myFunction, // function invoked for brand new connections or by a connection tag mismatch
                // sodaMetaDataCache: false, // Set true to improve SODA collection access performance
                // stmtCacheSize: 30, // number of statements that are cached in the statement cache of each connection
                // enableStatistics: false // record pool usage for oracledb.getPool().getStatistics() and logStatistics()
            });
            console.log("CONEXAO ORACLE - CRIADO SPOOL 'appspool' - REUTILIZAR ESTA CONEXAO! ");
            yield checkConnection();
            // Now the pool is running, it can be used
            //await dostuff();
        }
        catch (err) {
            console.error('init() error: ' + err.message);
        }
        finally {
            //await closePoolAndExit();
        }
    });
}
function GetConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        let connection;
        try {
            connection = yield oracledb.getConnection({
                user: process.env.USERNAME,
                password: process.env.PASSWORD,
                connectString: process.env.CONNECTSTRING
            });
            return connection;
        }
        catch (err) {
            //send error message
            return err.message;
        }
        finally {
            if (connection) {
                try {
                    // Always close connections
                    yield connection.close();
                }
                catch (err) {
                    console.error(err.message);
                }
            }
        }
    });
}
function checkConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("CHECANDO CONEXAO COM O ORACLE A PARTIR DO SPOOL... 'appspool' ");
        try {
            const connection = yield oracledb.getConnection('appspool');
            console.log('CONECTADO NO BANCO ORACLE! -- CHECK CONECTION');
            if (connection) {
                console.log('CONEXAO TESTADA COM SUCESSO! MANTENDO ATIVA.. -- CHECK CONECTION');
                console.log("-------------------------------------------------------------------------------------------------------------------------------------");
                console.log("----------------------------------------------------#AGUARDANDO REQUESTS...#---------------------------------------------------------");
                console.log("-----------------------------------------------# WINTHOR API ROFE DISTRIBUIDORA #----------------------------------------------------");
                console.log("-------------------------------------------------------------------------------------------------------------------------------------");
            }
            else {
                console.log('nao conectado');
            }
        }
        catch (err) {
            let errr = err;
            console.error(errr);
            //await connection.close(); 
        }
    });
}
function closePool() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Destroy pool: appspool');
            //connetion.close();
            const pool = yield oracledb.getPool('appspool');
            yield pool.close();
            console.log('CONEXAO POOL DESTRUIDA COM SUCESSO');
        }
        catch (err) {
            console.log('Error destroying pool:', err);
        }
    });
}
/*module.exports={checkConnection:checkConnection,initOracleDbConection:initOracleDbConection,closePool:closePool,GetConnection:GetConnection}*/
exports.default = {
    checkConnection: checkConnection,
    initOracleDbConection: initOracleDbConection,
    closePool: closePool,
    GetConnection: GetConnection
};
