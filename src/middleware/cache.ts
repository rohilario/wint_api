const redis = require('redis')

//let redisClient;
async function createRedisConnection() {
  const redisClient = redis.createClient();
  return redisClient ;
}
async function verifyCache(req, res, next) {
  let CacheKey = req.hostname+'_'+req.baseUrl+req.route.path+'.'+req.headers['x-access-token']
  let results;
  try {
    const redisClient = await createRedisConnection();
    //redisClient.on("error", (error) => console.error(`Error : ${error}`));
    redisClient.connect()
    const cacheResults = await redisClient.get(CacheKey);
    //console.log('CACHE '+ cacheResults);
    if (cacheResults){
      console.log('CACHE REDIS ENCONTRADO')
      console.log('RETORNANDO DADOS DE CACHE..')
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

async function setChache(key,value){
  try{
    const redisClient = redis.createClient(); 
    redisClient.on("error", (error) => console.error(`Error : ${error}`));
    await redisClient.connect();
    console.log('REDIS CONECTADO COM SUCESSO! -- SET KEY VALUE')
    await redisClient.set(key, JSON.stringify(value), {
        EX: 180,
        NX: true,
    });
    console.log('CACHE GERADO COM SUCESSO')
  }
  catch (error) {
    console.error(error);
  }
}

export default {createRedisConnection,verifyCache,setChache}

/*module.exports={
  cacheData:cacheData 
}*/

