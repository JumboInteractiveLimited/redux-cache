"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var actions_1 = require("./actions");
var logResult = function (name, array) {
    console.log("redux-cache: %s: %s", name, array.join(", ") || "none found");
};
/**
 * This fn will handle invalidating the reducers you specify. It returns the updated state with the cache
 * values set to null.
 *
 * @param {string[]} reducersToInvalidate - List of reducers to invalidate
 * @param {object} currentState - The current and already reduced state.
 * @param {object} [config={}] - Configuration options
 * @param {boolean} [config.log=false] - Whether or not to output log information. Useful for debugging.
 * @param {string} [config.cacheKey=DEFAULT_KEY] - The cache key to use instead of the DEFAULT_KEY
 */
exports.updateState = function (reducersToInvalidate, currentState, config) {
    var _a = config.log, log = _a === void 0 ? false : _a, _b = config.cacheKey, cacheKey = _b === void 0 ? constants_1.DEFAULT_KEY : _b;
    var newState = __assign({}, currentState);
    var stateKeys = Object.keys(newState);
    // We filter to those reducers which exist in the application state tree
    var matchedReducers = reducersToInvalidate.filter(function (reducerKey) {
        var matched = (stateKeys.indexOf(reducerKey) !== -1);
        if (!matched && log) {
            console.log("redux-cache: did not match %s reducer to state tree", reducerKey);
        }
        return matched;
    });
    if (log) {
        logResult("matchedReducers", matchedReducers);
    }
    // We filter those existing reducers down to those which actually have a the cache key.
    var cacheEnabledReducers = matchedReducers.filter(function (reducerKey) {
        return newState && newState[reducerKey] && newState[reducerKey][cacheKey];
    });
    if (log) {
        logResult("cacheEnabledReducers", cacheEnabledReducers);
    }
    // We are invalidating the cached reducers by setting the value for the cache key to null.
    // Don't fret -- they'll get a new and improved value for the cache key again when the successful action comes through.
    cacheEnabledReducers.forEach(function (reducerKey) { newState[reducerKey][cacheKey] = null; });
    if (log) {
        if (cacheEnabledReducers.length > 0) {
            console.log("redux-cache: Set %s to null for following reducers: %s", cacheKey, cacheEnabledReducers.join(", "));
        }
        else {
            console.log("redux-cache: No cached reducers to update");
        }
    }
    return newState;
};
exports.liftReducer = function (reducer, config) { return function (state, action) {
    if (action.type !== actions_1.INVALIDATE_CACHE) {
        return reducer(state, action);
    }
    var reducersToInvalidate = action.payload && action.payload.reducers || [];
    var currentState = reducer(state, action);
    var newState = exports.updateState(reducersToInvalidate, currentState, config);
    return newState;
}; };
/**
 * This is the store enhancer that you will add when you configureStore.
 *
 * @param {CacheEnhancerConfig} [config={}]
 * @returns {Object} - returns the enhanced store
 */
var cacheEnhancer = function (config) {
    if (config === void 0) { config = {}; }
    return function (createStore) { return function (rootReducer, initialState, enhancer) {
        var store = createStore(exports.liftReducer(rootReducer, config), initialState, enhancer);
        return __assign({}, store, { replaceReducer: function (reducer) {
                return store.replaceReducer(exports.liftReducer(reducer, config));
            } });
    }; };
};
