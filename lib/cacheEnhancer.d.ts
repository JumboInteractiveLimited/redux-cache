export interface Store {
    [x: string]: any;
    replaceReducer: (reducer: () => State) => Function;
}
export interface State {
    DEFAULT_KEY?: number | null | undefined;
    [x: string]: any;
}
export interface CacheEnhancerConfig {
    log?: boolean;
    cacheKey?: string;
}
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
export declare const updateState: (reducersToInvalidate: any, currentState: any, config: any) => any;
export declare const liftReducer: (reducer: any, config: any) => (state: any, action: any) => any;
