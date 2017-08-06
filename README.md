[![Build Status](https://travis-ci.org/JumboInteractiveLimited/redux-cache.svg?branch=master)](https://travis-ci.org/JumboInteractiveLimited/redux-cache)
# redux-cache
*This library is a WIP. Will be pushed to NPM soon.*

This library provides an easy to use client side TTL caching strategy for redux applications.

Often, it is unnecessary to refetch data from an API if we know that it is unlikely to change within a certain period. By not fetching the data we are being friendly to mobile data users, limiting unnecessary API calls, and minimizing re-renders of applications due to state updates.

## Installation
**Note:** Current redux-cache package is an un-maintained library. This will soon be pushed.

~~`npm install -s redux-cache`~~

## Usage
Add the store enhancer (`cacheEnhancer`) to your redux store. Example:

// WIP

1. A store enhancer - `cacheEnhancer()`
1. A TTL generator - `generateCacheTTL()`
1. A cache validator - `checkCacheValid()`
1. An Invalidate action
1. A default cache key