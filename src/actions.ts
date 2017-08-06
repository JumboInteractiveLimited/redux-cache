const INVALIDATE_ACTION = "@@redux-cache/INVALIDATE_CACHE";

export interface Reducers {
	[index: number]: string
}

export interface InvalidateCacheAction {
	type: string,
	payload: {
		reducers: Reducers
	}
}

/**
 * This action can be used to invalidate the cache for a given array of reducers.
 * 
 * @param {string[]} [reducersToInvalidate=[]] List of reducers to invalidate
 * @returns {InvalidateCacheAction}
 */
export const invalidateCache = (reducersToInvalidate: Reducers | string = []): InvalidateCacheAction => {
	let reducers = reducersToInvalidate;
	if (typeof reducersToInvalidate === "string") {
		reducers = [reducersToInvalidate];
	}

	return {
		type: INVALIDATE_ACTION,
		payload: {
			reducers
		}
	}
}