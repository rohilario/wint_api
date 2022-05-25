const fs = require('fs');
const path = require('path');
const axios = require('axios');
const https = require('https');
const qs = require('qs');

let file=fs.readFileSync(process.env.CD_FILE_F1)
const grant_type = { 'grant_type': 'client_credentials' };
data= qs.stringify(grant_type)

async function getPixDate(req, res){

}

async function GetTokenBradesco(req,res){
    const instance = axios.create({
        httpsAgent: new https.Agent({
            //cert: fs.readFileSync(`user.cert`),
            //key: fs.readFileSync(`user.key`),
            pfx:file,
            passphrase: process.env.PASSPHRASE_CD_F1
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            "Authorization":process.env.AUTHORIZATION,
            'Access-Control-Allow-Origin' : '*',
          },
          
    })
    
instance.post('https://qrpix-h.bradesco.com.br/oauth/token',data).then( function(response) {
res.send(response.data)        
//console.log(response.data)
}).catch(error => {
    //console.log("CONEXAO FECHADA -- GET MILVUS")
    //console.log(error.response.data)
    //let erro=error
    res.send(error.response.data)
});      
}

module.exports={getPixDate:getPixDate,
    GetTokenBradesco:GetTokenBradesco
}
