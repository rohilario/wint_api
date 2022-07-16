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
const redis = require('redis');
//let redisClient;
function verifyCache(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let CacheKey = 'teste';
        let results;
        try {
            const redisClient = redis.createClient();
            redisClient.on("error", (error) => console.error(`Error : ${error}`));
            yield redisClient.connect();
            console.log('REDIS CONECTADO COM SUCESSO!');
            const cacheResults = yield redisClient.get(CacheKey);
            console.log(cacheResults);
            if (cacheResults) {
                console.log('CACHE REDIS ENCONTRADO');
                results = JSON.parse(cacheResults);
                res.send({
                    fromCache: true,
                    data: results,
                });
            }
            else {
                console.log('CONSULTA SEM REDIS CACHE');
                next();
            }
        }
        catch (error) {
            console.error(error);
            res.status(404);
        }
    });
}
function setChache(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const redisClient = redis.createClient();
            redisClient.on("error", (error) => console.error(`Error : ${error}`));
            yield redisClient.connect();
            console.log('REDIS CONECTADO COM SUCESSO!');
        }
        catch (error) {
            console.error(error);
            res.status(404);
        }
    });
}
exports.default = { verifyCache, setChache };
/*module.exports={
  cacheData:cacheData
}*/
