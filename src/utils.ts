// TODO: should this be commonized somewhere rather than duplicated in checkCacheValid.ts
export interface State {
	DEFAULT_KEY?: number | null | undefined,
	[x: string]: any
}

export type AccessStrategy = (state: State, reducerKey: string, cacheKey: string) => number | null | undefined;

export const defaultAccessStrategy: AccessStrategy = (state, reducerKey, cacheKey) => {
	return state && state[reducerKey] && state[reducerKey][cacheKey];
}
