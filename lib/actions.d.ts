export declare const INVALIDATE_CACHE = "@@redux-cache/INVALIDATE_CACHE";
export interface InvalidateCacheAction {
    type: string;
    payload: {
        reducers: string[];
    };
}
/**
 * This action can be used to invalidate the cache for a given array of reducers.
 *
 * @param {string[]} [reducersToInvalidate=[]] List of reducers to invalidate
 * @returns {InvalidateCacheAction}
 */
export declare const invalidateCache: (reducersToInvalidate?: string | string[]) => InvalidateCacheAction;
