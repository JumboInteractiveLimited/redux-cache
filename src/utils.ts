export interface State {
	cacheUntil?: number | null | undefined,
	[x: string]: any
}

export type AccessStrategy = (state: State, reducerKey: string, cacheKey: string) => number | null | undefined;

export const defaultAccessStrategy: AccessStrategy = (state, reducerKey, cacheKey) => {
	return state && state[reducerKey] && state[reducerKey][cacheKey];
}

export type InvalidateStrategy = (state: State, reducerKey: string, cacheKey: string) => State;

export const defaultInvalidateStrategy: InvalidateStrategy = (state, reducerKey, cacheKey) => {
	return {
		[reducerKey]: {
			...state[reducerKey],
			[cacheKey]: null
		}
	}
}