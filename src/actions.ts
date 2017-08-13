export const INVALIDATE_CACHE = "@@redux-cache/INVALIDATE_CACHE";

export interface InvalidateCacheAction {
	type: string,
	payload: {
		reducers: string[]
	}
}

/**
 * This action can be used to invalidate the cache for a given array of reducers.
 * 
 * @param {string[]} [reducersToInvalidate=[]] List of reducers to invalidate
 * @returns {InvalidateCacheAction}
 */
export const invalidateCache = (reducersToInvalidate: string[] | string = []): InvalidateCacheAction => {
	let reducers;

	if (reducersToInvalidate instanceof Array) {
		reducers = reducersToInvalidate;
	}

	if (typeof reducersToInvalidate === "string") {
		reducers = [reducersToInvalidate];
	}

	return {
		type: INVALIDATE_CACHE,
		payload: {
			reducers
		}
	}
}