import { DEFAULT_KEY } from "./constants";

export interface State {
	DEFAULT_KEY?: number | null | undefined,
	[x: string]: any
}

/**
 * Checks if the cache TTL is still valid.
 * 
 * @param {function} getState 
 * @param {string} reducerKey
 * @param {string} [cacheKey=DEFAULT_KEY]
 * @returns {boolean}
 */
export const checkCacheValid = (getState: () => State, reducerKey: string, cacheKey: string = DEFAULT_KEY): boolean => {
	const state = getState();
	const cacheUntil: number = state && state[reducerKey] && state[reducerKey][cacheKey];
	if (!cacheUntil) {
		return false
	}

	const currentTime: number = Date.now();
	if (cacheUntil > currentTime) {
		return true
	}

	return false;

};

export default checkCacheValid;