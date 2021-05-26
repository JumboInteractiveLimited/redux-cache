import { DEFAULT_KEY } from "./constants";
import { defaultAccessStrategy, AccessStrategy } from "./utils";

export interface State {
	cacheUntil?: number | null | undefined,
	[x: string]: any
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