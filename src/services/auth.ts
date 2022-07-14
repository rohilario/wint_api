const jwt = require('jsonwebtoken');
const helper = require('../services/functions')

async function validUser(req,res,params){
  
  let user = await helper.getUserAuth(req,res,params)

  if(params.usr || params.pass){
    console.log('VALIDANDO SENHA..')
    if(params.usr===user[0].nome || params.pass===user[0].pass){
      console.log('SENHA VALIDADA COM SUCESSO!')
      console.log('GERANDO TOKEN...')
      CreateJWT(user[0],req, res); 
    }else{
      console.log('SENHA INVALIDA')
      res.json({"ERROR":"USUARIO OU SENHAS INVALIDOS!!"});res.status(404)
    }
  }else{
    res.json({"ERROR":"PARAMETROS NAO INFORMADOS CORRETAMENTE"});res.status(404)
    console.log('PARAMETROS NAO INFORMADOS')
  }

}

async function validUserRCA(req,res,params){
  
  let user = await helper.getRCAAuth(req,res,params)

  if(params.usr || params.pass){
    console.log('VALIDANDO SENHA..')
    if(params.usr===user[0].email || params.pass===user[0].pass){
      console.log('SENHA VALIDADA COM SUCESSO!')
      console.log('GERANDO TOKEN...')
      CreateJWT(user[0],req, res); 
    }else{
      console.log('SENHA INVALIDA')
      return res.json({ auth: false, token: null }).status(200);
      //res.json({"ERROR":"USUARIO OU SENHAS INVALIDOS!!"});
      
    }
  }else{
    res.json({"ERROR":"PARAMETROS NAO INFORMADOS CORRETAMENTE"});res.status(404)
    console.log('PARAMETROS NAO INFORMADOS')
  }

}

function CreateJWT(params,req,res){
  let id=params.pass || params.matricula
    const token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 300 // expires in 5min
    });
    console.log('TOKEN GERADO COM SUCESSO!')
    return res.json({ auth: true, token: token, codrca:params.pass || params.matricula, nome:params.nome });
    
  }

//Autorização
function verifyJWT(req, res, next){
    var token = req.headers['x-access-token'];
    console.log(token)
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      next();
    });
}

/*module.exports={
    verifyJWT:verifyJWT,
    CreateJWT:CreateJWT,
    validUser:validUser,
    validUserRCA:validUserRCA
}*/

export default {
  verifyJWT:verifyJWT,
  CreateJWT:CreateJWT,
  validUser:validUser,
  validUserRCA:validUserRCA
}

