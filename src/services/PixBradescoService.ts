const fs_PixBradescoFunctions = require('fs');
const axiosPixBradescoFunctions = require('axios');
const https = require('https');
const qs = require('qs');
const jwt_decode = require('jwt-decode');
const pixBradescoFunctions=require('../services/Services')


let file=fs_PixBradescoFunctions.readFileSync(process.env.CD_FILE_F1)
const grant_type = { 'grant_type': 'client_credentials' };
const data= qs.stringify(grant_type)

async function getPixDate(req, res){

}

async function GetTokenBradesco(req,res){
    const token=await pixBradescoFunctions.getPixToken();
    //console.log(token.TOKEN);
    if(token.status==='TOKEN VALIDO'){
        console.log('TOKEN VALIDO - TOKEN NAO SERA RENOVADO')
        res.send(token)
    }else{
        console.log('TOKEN INVALIDO, RENOVANDO TOKEN...')
        //console.log(token.PIXTOKENID)
        pixBradescoFunctions.UpdatePixTokenStatus(token.pixtokenid)
        const instance = axiosPixBradescoFunctions.create({
            httpsAgent: new https.Agent({
                //cert: fs_PixBradescoFunctions.readFileSync(`user.cert`),
                //key: fs_PixBradescoFunctions.readFileSync(`user.key`),
                pfx:file,
                passphrase: process.env.PASSPHRASE_CD_F1
            }),
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                "Authorization":process.env.AUTHORIZATION,
                'Access-Control-Allow-Origin' : '*',
              },
              
        })
    
    
    
    instance.post(process.env.BASE_URL+'/oauth/token',data).then( function(response) {
    console.log('TOKEN OBTIDO COM SUCESSO!')
    let token = response.data.access_token;
    let token_type = response.data.token_type;
    let decoded = jwt_decode(token);
    
    var date = new Date(decoded.exp * 1000);
    let text = date.toLocaleString('PT-Br');
    console.log('DECODED ' + text)
    // day of timestamp
    var day= date.getDate()
    // month of timestamp
    var day= date.getMonth();
    // year of timestamp
    var day= date.getFullYear();
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();
    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    let dthrtoken={dthrexpiration:formattedTime}
    let tokenbradesco=Object.assign(response.data, dthrtoken);

    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  
    const tokenobj={"token":token,
                    "dthrexpiration":text,
                "token_type":token_type}
    pixBradescoFunctions.InsertPixToken(tokenobj)
    res.send(tokenbradesco)        
    }).catch(error => {
        console.log('ERRO AO OBTER O TOKEN BRADESCO!')
        res.send(error.response.data)
    });     
    }
 
}

async function RegistraPix(req,res,params,authorization){
    console.log(params)
    const instance2 = axiosPixBradescoFunctions.create({
        httpsAgent: new https.Agent({
            //cert: fs_PixBradescoFunctions.readFileSync(`user.cert`),
            //key: fs_PixBradescoFunctions.readFileSync(`user.key`),
            pfx:file,
            passphrase: process.env.PASSPHRASE_CD_F1
        }),
        headers: {
            //'content-type': 'application/x-www-form-urlencoded',
            "Authorization":authorization,
            'Access-Control-Allow-Origin' : '*',
          },
    })

    instance2.post(process.env.BASE_URL+'/v2/cob-emv',params).then(function(response){
    //console.log(response.data)    
    //return response.data
    console.log('PIX EMITIDO COM SUCESSO!')
    res.send(response.data)
        }).catch(error => {
            console.log('ERRO NA REQUEST')
            //console.log(error.response.data)
            //return error.response
            res.send(error.response.data)
        });    

}

async function getPagamentoPixId(req,res,authorization,txid){
    //console.log(params)
    const instance2 = axiosPixBradescoFunctions.create({
        httpsAgent: new https.Agent({
            //cert: fs_PixBradescoFunctions.readFileSync(`user.cert`),
            //key: fs_PixBradescoFunctions.readFileSync(`user.key`),
            pfx:file,
            passphrase: process.env.PASSPHRASE_CD_F1
        }),
        headers: {
            //'content-type': 'application/x-www-form-urlencoded',
            "Authorization":authorization,
            'Access-Control-Allow-Origin' : '*',
          },
    })

    instance2.get(process.env.BASE_URL+'/v2/cob/'+txid).then(function(response){
    //console.log(response.data)    
    //return response.data
    console.log('PIX CONSULTADO COM SUCESSO! - getPagamentoPixId')
    res.send(response.data)
        }).catch(error => {
            console.log('ERRO NA REQUEST - getPagamentoPixId')
            //console.log(error.response.data)
            //return error.response
            res.send(error.response.data)
        });    

}
//Cadastro Webhook Bradesco
async function InsertWebhookPix(req,res,key,authorization){
    //console.log(params)
    const instance2 = axiosPixBradescoFunctions.create({
        httpsAgent: new https.Agent({
            //cert: fs_PixBradescoFunctions.readFileSync(`user.cert`),
            //key: fs_PixBradescoFunctions.readFileSync(`user.key`),
            pfx:file,
            passphrase: process.env.PASSPHRASE_CD_F1
        }),
        headers: {
            //'content-type': 'application/x-www-form-urlencoded',
            "Authorization":authorization,
            'Access-Control-Allow-Origin' : '*',
          },
    })

    instance2.get(process.env.BASE_URL+'/v2/webhook/'+key).then(function(response){
    //console.log(response.data)    
    //return response.data
    console.log('TESTE - Cadastro Webhook Bradesco')
    res.send(response.data)
        }).catch(error => {
            console.log('ERRO NA REQUEST - Cadastro Webhook Bradesco')
            //console.log(error.response.data)
            //return error.response
            res.send(error.response.data)
        });    

}

module.exports={
    getPixDate:getPixDate,
    GetTokenBradesco:GetTokenBradesco,
    RegistraPix:RegistraPix,
    getPagamentoPixId:getPagamentoPixId,
    InsertWebhookPix:InsertWebhookPix
}


  