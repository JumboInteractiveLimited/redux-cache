"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var defaultAccessStrategy = function (state, reducerKey, cacheKey) {
    return state && state[reducerKey] && state[reducerKey][cacheKey];
};
exports.checkCacheValid = function (getState, reducerKey, args) {
    if (args === void 0) { args = {}; }
    var _a = args.cacheKey, cacheKey = _a === void 0 ? constants_1.DEFAULT_KEY : _a, _b = args.accessStrategy, accessStrategy = _b === void 0 ? defaultAccessStrategy : _b;
    var state = getState();
    var cacheUntil = accessStrategy(state, reducerKey, cacheKey);
    var currentTime = Date.now();
    return !!(cacheUntil > currentTime);
};
exports.default = exports.checkCacheValid;
