const oracledb = require('oracledb');

async function checkConnection() {
    try {
      connection = await oracledb.getConnection({
          user: "CONSULTA",
          password: "CONSULTA",
          connectString: "192.168.0.20:1521/WINT"
      });
      console.log('connected to database');
    } catch (err) {
      console.error(err.message);
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close(); 
          console.log('close connection success');
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  }
  
  checkConnection();
