"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
/**
 * Generates a unix timestamp in milliseconds
 *
 * @param {number} [duration=DEFAULT_DURATION_MS]
 * @returns {number}
 */
exports.generateCacheTTL = function (duration) {
    if (duration === void 0) { duration = constants_1.DEFAULT_DURATION_MS; }
    return Date.now() + duration;
};
exports.default = exports.generateCacheTTL;
