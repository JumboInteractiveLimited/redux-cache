"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
/**
 * Checks if the cache TTL is still valid.
 *
 * @param {function} getState
 * @param {string} reducerKey
 * @param {string} [cacheKey=DEFAULT_KEY]
 * @returns {boolean}
 */
exports.checkCacheValid = function (getState, reducerKey, cacheKey) {
    if (cacheKey === void 0) { cacheKey = constants_1.DEFAULT_KEY; }
    var state = getState();
    var cacheUntil = state && state[reducerKey] && state[reducerKey][cacheKey];
    if (!cacheUntil) {
        return false;
    }
    var currentTime = Date.now();
    if (cacheUntil > currentTime) {
        return true;
    }
    return false;
};
exports.default = exports.checkCacheValid;
