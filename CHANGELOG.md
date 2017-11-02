# 0.3.0
* Changed `checkCacheValid` third argument to be a config object instead of just the `cacheKey` string. 
  * This now allows for a custom `accessStrategy` to be provided which can override how to find the cacheKey.
  * Please note this may be a breaking change if you are passing cacheKey as a string before updating to this package.
