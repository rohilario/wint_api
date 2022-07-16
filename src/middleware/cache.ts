const redis = require('redis')

//let redisClient;

async function verifyCache(req, res, next) {
  let CacheKey = 'teste'
  let results;
  try {
    const redisClient = redis.createClient(); 
    redisClient.on("error", (error) => console.error(`Error : ${error}`));
    await redisClient.connect();
    console.log('REDIS CONECTADO COM SUCESSO!')
    const cacheResults = await redisClient.get(CacheKey);
    console.log(cacheResults);
    if (cacheResults) {
      console.log('CACHE REDIS ENCONTRADO')
      results = JSON.parse(cacheResults);
      res.send({
        fromCache: true,
        data: results,
      });
    }else{
      console.log('CONSULTA SEM REDIS CACHE');
      next();
      
    }
  } catch (error) {
    console.error(error);
    res.status(404);
  }
}

async function setChache(req,res,next){
  try{
    const redisClient = redis.createClient(); 
    redisClient.on("error", (error) => console.error(`Error : ${error}`));
    await redisClient.connect();
    console.log('REDIS CONECTADO COM SUCESSO!')
  }
  catch (error) {
    console.error(error);
    res.status(404);
  }


}

export default {verifyCache,setChache}

/*module.exports={
  cacheData:cacheData 
}*/

