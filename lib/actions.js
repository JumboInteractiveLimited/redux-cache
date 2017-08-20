"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVALIDATE_CACHE = "@@redux-cache/INVALIDATE_CACHE";
/**
 * This action can be used to invalidate the cache for a given array of reducers.
 *
 * @param {string[]} [reducersToInvalidate=[]] List of reducers to invalidate
 * @returns {InvalidateCacheAction}
 */
exports.invalidateCache = function (reducersToInvalidate) {
    if (reducersToInvalidate === void 0) { reducersToInvalidate = []; }
    var reducers;
    if (reducersToInvalidate instanceof Array) {
        reducers = reducersToInvalidate;
    }
    if (typeof reducersToInvalidate === "string") {
        reducers = [reducersToInvalidate];
    }
    return {
        type: exports.INVALIDATE_CACHE,
        payload: {
            reducers: reducers
        }
    };
};
