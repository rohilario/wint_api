const expressAuth = require('express')
const AuthRouter = expressAuth.Router();  
//const functionsAuth=require('../services/auth')
import authFuntions from '../middleware/auth'


AuthRouter.post('/token/create', function (req,res) {
  const usr=req.body.usr;
  const pass=req.body.pass
  const auth={usr:usr,pass:pass}
  authFuntions.validUser(req,res,auth)

})

AuthRouter.post('/rca/token/create', function (req,res) {
  const usr=req.body.data.usr || req.body.usr;
  const pass=req.body.data.pass || req.body.pass
  const auth={usr:usr,pass:pass}

  //console.log(req.body)

  authFuntions.validUserRCA(req,res,auth)

})

AuthRouter.get('/token/autenticate', authFuntions.verifyJWT,function (req,res) {
  
})

//module.exports=AuthRouter
export default AuthRouter