import { DEFAULT_KEY } from "./constants";

export interface State {
	"DEFAULT_KEY"?: number,
	[x: string]: any
}

/**
 * Checks if the cache TTL is still valid.
 * 
 * @param {function} getState 
 * @param {string} [cacheKey=DEFAULT_KEY]
 * @returns {boolean}
 */
const checkCacheValid = (getState: () => State, cacheKey: string = DEFAULT_KEY): boolean => {
	const state = getState();
	const cacheUntil: number = state[cacheKey];
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