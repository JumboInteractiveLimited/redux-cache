This library is no longer maintained.
===


[![Build Status](https://travis-ci.org/JumboInteractiveLimited/redux-cache.svg?branch=master)](https://travis-ci.org/JumboInteractiveLimited/redux-cache) [![Coverage Status](https://coveralls.io/repos/github/JumboInteractiveLimited/redux-cache/badge.svg?branch=master)](https://coveralls.io/github/JumboInteractiveLimited/redux-cache?branch=master)
# redux-cache
This library provides an easy to use client side TTL caching strategy for redux applications.

Often, it is unnecessary to refetch data from an API if we know that it is unlikely to have changed within a certain period. By not fetching the data we are being friendly to mobile data users, limiting unnecessary API calls, and minimizing re-renders of applications due to state updates.

## Installation
`npm install -s redux-cache`

## Usage
**Note:** For a complete example, have a look at the [example directory](example). You can clone this repo and actually start the example to see it working.

### 1. Add the cacheEnhancer to the store
Add the store enhancer to your redux store. Example:

```javascript
import { compose, applyMiddleware, createStore } from 'redux'
import { cacheEnhancer } from 'redux-cache'

const store = createStore(
	reducer,
	undefined,
	compose(
		applyMiddleware(...),
		cacheEnhancer()
	)
)
```

This will enhance your store so that whenever you dispatch the invalidateCache action, it automatically will invalidate the cache for any provided reducers. This means you do not have to bother with the boilerplate for every single reducer. Great for larger apps!

### 2. Set up your reducer
Included are a couple of utilities for setting up your reducer to make it "cache enabled".

Firstly, the `DEFAULT_KEY` is what `redux-cache` will use for storing and clearing cache values unless told to use an additional cache key. Secondly is the `generateCacheTTL` function which will create a timestamp for you.

In your reducer:
```javascript
// postsReducer.js

import { DEFAULT_KEY, generateCacheTTL } from "redux-cache";

const initialState = {
	[DEFAULT_KEY]: null
	// ...other keys
}

const postReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_POSTS_SUCCESS: {
			return {
				...state,
				[DEFAULT_KEY]: generateCacheTTL(),
				results: action.payload
			};
		}

		default: {
			return state;
		}
	}
}
```

We set up the key in the initial state and then on the successful fetch action we generate a new TTL time.

### 3. Check your cache before using an action
Before you fire off another get request, you should check if the cache is valid. A util fn - `checkCacheValid()` - has been provided:

```javascript
// postsActions.js
import { checkCacheValid } from "redux-cache";

export const getPosts = () => (dispatch, getState) => {
	const isCacheValid = checkCacheValid(getState, "posts");
	if (isCacheValid) { return null; }

	dispatch({
		type: FETCH_POSTS_REQUEST
	});

	axios.get("https://jsonplaceholder.typicode.com/posts")
		.then((response) => {
				dispatch({
				type: FETCH_POSTS_SUCCESS,
				payload: response.data,
			});
		})
		.catch((error) => {
			console.log('error: ', error);
			dispatch({
				type: FETCH_POSTS_FAILURE,
				payload: error,
			});
		});
};
```

If the cache is valid, drop the action on the floor. This will stop any calls to the API being made.

### 4. Invalidating the cache
If you need to invalidate the cache for a reducer there is a utility action provided - `invalidateCache`. Just dispatch this with the reducer(s) you need to invalidate.

```javascript
import { invalidateCache } from "redux-cache";

invalidateCache("posts");
```

## API
### `cacheEnhancer([config])`
* arguments:
  * **config** - *object*
    * log - *boolean* - default: false. Will output to console when the invalidateCache is being processed. Useful for debugging.
	* cacheKey - *string* - default: [`DEFAULT_KEY`](#constants). The cacheKey to be updating in your reducers when invalidating the cache.

### `generateCacheTTL([duration])`
* arguments: 
  * **duration** - *number* - default: [`DEFAULT_DURATION_MS`](#constants). A number representing miliseconds. To be added to the current time.

### `checkCacheValid(getState, reducerKey, [config])`
* arguments:
  * **getState** - *function* - The getState function provided by using `redux-thunk` which will be used to get the application state
  * **reducerKey** - *string* - The key of the reducer to check whether the cache is still valid
  * **config**
  	* cacheKey - *string* - default: [`DEFAULT_KEY`](#constants). The cacheKey to be checking.
	* accessStrategy - *function* - default: (state, reducerKey, cacheKey) => state[reducerKey][cacheKey]. Use this to overide the way in which the cacheKey is checked. This allows for greater configurability for applying the caching strategy to nested items in your reducer.

### `invalidateCache(reducers)`
* arguments
  * **reducers** - *array (of strings) or single string* - An array or string of reducers to invalidate.

### Constants
* `DEFAULT_KEY` - "cacheUntil"
* `DEFAULT_DURATION_MS` - 600000 (in milliseconds). 10 minutes.

## Tests
To run the tests:

`npm run test`

## License:
[MIT](LICENSE)
