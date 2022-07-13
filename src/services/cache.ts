const redisClient = require("redis");
//let redisClient;

async function cacheData(req, res, next) {
  const CacheKey = req.params.cachekey
  let results;
  try {
    const cacheResults = await redisClient.get(CacheKey);
    if (cacheResults) {
      results = JSON.parse(cacheResults);
      res.send({
        fromCache: true,
        data: results,
      });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(404);
  }
}

module.exports={
  cacheData:cacheData 
}
