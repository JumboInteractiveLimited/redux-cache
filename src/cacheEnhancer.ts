import { DEFAULT_KEY } from "./constants";
import { INVALIDATE_CACHE } from "./actions";
import { AccessStrategy, InvalidateStrategy } from "./utils";

export type Reducer = (state: State, action: any) => State;

export type ReplaceReducer = (reducer: Reducer) => ReplaceReducer;

export interface Store {
	replaceReducer: ReplaceReducer,
	[x: string]: any
}

export interface State {
	[reducerKey: string]: {
		cacheUntil?: number | null | undefined,
		[x: string]: any
	}
}

export interface CacheEnhancerConfig {
	log?: boolean,
	cacheKey?: string
}

type LogResult = (name: string, array: string[]) => void;

const logResult: LogResult = (name, array) => {
	console.log("redux-cache: %s: %s", name, array.join(", ") || "none found");
};

type LogGeneral = (message: string, ...data: string[]) => void;

const logGeneral: LogGeneral = (message, ...data) => {
	console.log(`redux-cache: ${message}`, ...data)
}

export interface UpdateStateArgs {
	reducersToInvalidate: string[],
	accessStrategy: AccessStrategy,
	invalidateStrategy: InvalidateStrategy,
	currentState: State,
	config: CacheEnhancerConfig
}

/**
 * This fn will handle invalidating the reducers you specify. It returns the updated state with the cache
 * values set to null.
 *
 * @param reducersToInvalidate List of reducers to invalidate
 * @param currentState The current and already reduced state.
 * @param [config={}] Configuration options
 * @param [config.log=false] Whether or not to output log information. Useful for debugging.
 * @param [config.cacheKey=DEFAULT_KEY] The cache key to use instead of the DEFAULT_KEY
 */
export const buildUpdateState = (logResultFn: LogResult, logGeneralFn: LogGeneral) => (args: UpdateStateArgs): State => {
	const {
		reducersToInvalidate,
		accessStrategy,
		invalidateStrategy,
		currentState,
		config
	} = args;

	const { log = false, cacheKey = DEFAULT_KEY } = config;
	const newState = { ...currentState };
	const stateKeys = Object.keys(newState);

	// We filter to those reducers which exist in the application state tree
	const matchedReducers = reducersToInvalidate.filter(reducerKey => {
		const matched = (stateKeys.indexOf(reducerKey) !== -1);
		if (!matched && log) { logGeneralFn("Did not match %s reducer to the state tree", reducerKey); }
		return matched;
	});
	if (log) { logResultFn("matchedReducers", matchedReducers); }

	// We filter those existing reducers down to those which actually have a the cache key.
	const cacheEnabledReducers = matchedReducers.filter(reducerKey => {
		return accessStrategy(newState, reducerKey, cacheKey)
	});
	if (log) { logResultFn("cacheEnabledReducers", cacheEnabledReducers); }

	// We are invalidating the cached reducers by setting the value for the cache key to null.
	// Don't fret -- they'll get a new and improved value for the cache key again when the successful action comes through.
	const updatedState = cacheEnabledReducers.reduce((prev, reducerKey) => {
		return {
			...prev,
			...invalidateStrategy(newState, reducerKey, cacheKey)
		}
	}, newState);

	if (log) {
		if (cacheEnabledReducers.length > 0) {
			logGeneralFn("Set %s to null for following reducers: %s", cacheKey, cacheEnabledReducers.join(", "));
		} else {
			logGeneralFn("No cached reducers to update");
		}
	}

	return updatedState;
};

export const updateState = buildUpdateState(logResult, logGeneral);

export type LiftReducer = (reducer: Reducer, config: CacheEnhancerConfig) => (state: State, action: any) => State;

export const liftReducer: LiftReducer = (reducer, config) => (state, action) => {
	const currentState = reducer(state, action);

	if (action.type !== INVALIDATE_CACHE) {
		return currentState;
	}

	const reducersToInvalidate = action.payload && action.payload.reducers || [];
	const accessStrategy = action.payload && action.payload.accessStrategy;
	const invalidateStrategy = action.payload && action.payload.invalidateStrategy;

	const newState = updateState({
		reducersToInvalidate,
		accessStrategy,
		invalidateStrategy,
		currentState,
		config
	});

	return newState;
}

/**
 * This is the store enhancer that you will add when you configureStore.
 */
export const buildCacheEnhancer = (liftReducerFn: LiftReducer) => (config: CacheEnhancerConfig = {}) => {
	return (createStore) => (rootReducer: Reducer, initialState: State, enhancer: Function): Store => {
		const store = createStore(liftReducerFn(rootReducer, config), initialState, enhancer);

		return {
			...store,
			replaceReducer: (reducer) => {
				return store.replaceReducer(liftReducerFn(reducer, config));
			}
		}
	}
}

export const cacheEnhancer = buildCacheEnhancer(liftReducer);