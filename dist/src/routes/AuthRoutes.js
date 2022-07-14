"use strict";
const expressAuth = require('express');
const AuthRouter = expressAuth.Router();
const functionsAuth = require('../services/auth');
AuthRouter.post('/token/create2', function (req, res) {
    const usr = req.body.usr;
    const pass = req.body.pass;
    const auth = { usr: usr, pass: pass };
    console.log(auth);
    console.log('teste');
    //functionsAuth.validUser(req,res,auth)
});
AuthRouter.post('/rca/token/create', function (req, res) {
    const usr = req.body.data.usr || req.body.usr;
    const pass = req.body.data.pass || req.body.pass;
    const auth = { usr: usr, pass: pass };
    //console.log(req.body)
    functionsAuth.validUserRCA(req, res, auth);
});
module.exports = AuthRouter;
