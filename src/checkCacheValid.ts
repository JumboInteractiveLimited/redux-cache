import { DEFAULT_KEY } from "./constants";

export interface State {
	DEFAULT_KEY?: number | null | undefined,
	[x: string]: any
}

export type AccessStrategy = (state: State, reducerKey: string, cacheKey: string) => number | null | undefined;
const defaultAccessStrategy: AccessStrategy = (state, reducerKey, cacheKey) => {
	return state && state[reducerKey] && state[reducerKey][cacheKey];
}

export type GetState = () => State;
export type Args = {
	cacheKey?: string,
	accessStrategy?: AccessStrategy
}

export const checkCacheValid = (getState: GetState, reducerKey: string, args: Args = {}): boolean => {
	const { 
		cacheKey = DEFAULT_KEY, 
		accessStrategy = defaultAccessStrategy 
	} = args;

	const state = getState();

	const cacheUntil = accessStrategy(state, reducerKey, cacheKey);
	
	const currentTime: number = Date.now();
	
	return !!(cacheUntil > currentTime);
};

export default checkCacheValid;