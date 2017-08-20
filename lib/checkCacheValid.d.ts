export interface State {
    DEFAULT_KEY?: number | null | undefined;
    [x: string]: any;
}
/**
 * Checks if the cache TTL is still valid.
 *
 * @param {function} getState
 * @param {string} reducerKey
 * @param {string} [cacheKey=DEFAULT_KEY]
 * @returns {boolean}
 */
export declare const checkCacheValid: (getState: () => State, reducerKey: string, cacheKey?: string) => boolean;
export default checkCacheValid;
