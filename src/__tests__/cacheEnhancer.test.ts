var MockDate = require("mockdate");

import { buildCacheEnhancer, liftReducer, buildUpdateState } from "../cacheEnhancer";
import { defaultAccessStrategy } from "../utils";
import { INVALIDATE_CACHE } from "../actions";
import { DEFAULT_KEY } from "../constants";

let reducer;
let state;
let action;

beforeEach(() => {
	MockDate.set(0);
	reducer = jest.fn();

	state = {
		myReducer: {
			[DEFAULT_KEY]: 2000,
			myValue: "someValue"
		}
	};

	action = {
		type: INVALIDATE_CACHE,
		payload: {
			reducers: ["myReducer"],
			accessStrategy: defaultAccessStrategy
		}
	};
});

describe("cacheEnhancer:", () => {
	const mockConfig = {
		log: true
	};
	const mockCreateStore = jest.fn();
	const mockRootReducer = jest.fn();
	const mockInitialState = {
		myReducer: {
			myKey: "myValue"
		}
	};
	const mockEnhancer = jest.fn();
	const mockLiftReducer = jest.fn().mockReturnValue("I am mock lift reducer return");
	const cacheEnhancer = buildCacheEnhancer(mockLiftReducer);

	it("should call liftReducer with the root reducer and provided config", () => {

		cacheEnhancer(mockConfig)(mockCreateStore)(mockRootReducer, mockInitialState, mockEnhancer)

		const [liftReducerArgs] = mockLiftReducer.mock.calls;

		expect(liftReducerArgs).toEqual([mockRootReducer, mockConfig])
	});

	it("should call createStore with the output of liftReducer, initialState and the enhancer", () => {
		cacheEnhancer(mockConfig)(mockCreateStore)(mockRootReducer, mockInitialState, mockEnhancer);

		const [createStoreArgs] = mockCreateStore.mock.calls;

		expect(createStoreArgs).toEqual(["I am mock lift reducer return", mockInitialState, mockEnhancer]);
	});
});

describe("liftReducer:", () => {
	describe("unknown action:", () => {
		it("should call the reducer with the given state and action", () => {
			action = {
				type: "UNKNOWN_ACTION"
			}

			liftReducer(reducer, {})(state, action);
			const [reducerArgs] = reducer.mock.calls;
			expect(reducerArgs).toEqual([state, action])
		});
	});

	describe("invalidate cache action:", () => {
		it("should return the newState with the nullified cache key", () => {
			reducer = (state, action) => state;
			const expectedOutput = {
				...state,
				myReducer: {
					...state.myReducer,
					[DEFAULT_KEY]: null
				}
			}

			const output = liftReducer(reducer, {})(state, action);
			expect(output).toEqual(expectedOutput);
		})
	})
});


describe("updateState:", () => {
	const logResultSpy = jest.fn();
	const logGeneralSpy = jest.fn();
	const updateState = buildUpdateState(logResultSpy, logGeneralSpy);

	it("should update the state for cache enabled reducers that match", () => {
		const newState = updateState(["myReducer"], defaultAccessStrategy, state, {});
		expect(newState.myReducer[DEFAULT_KEY]).toBe(null);
	});

	it("should not mutate the current state", () => {
		updateState(["myReducer"], defaultAccessStrategy, state, {});
		expect(state.myReducer[DEFAULT_KEY]).toBe(2000);
	});

	it("should not update reducers that match but are not cache enabled", () => {
		const currentState = {
			...state,
			notCacheEnabled: {
				someKey: "someValue"
			}
		}

		const newState = updateState(["notCacheEnabled"], defaultAccessStrategy, currentState, {});
		expect(newState.notCacheEnabled).not.toHaveProperty(DEFAULT_KEY);
	});

	it("should ignore reducers that do not match", () => {
		const currentState = {
			...state,
			notCacheEnabled: {
				someKey: "someValue"
			}
		}

		const newState = updateState(["myReducer", "doesntMatch"], defaultAccessStrategy, currentState, {} );
		expect(newState).not.toHaveProperty("doesntMatch");
	});

	it("should use the provided cacheKey if given as a parameter", () => {
		const currentState = {
			myReducer: {
				myDifferentCacheKey: 2000,
				myValue: "someValue"
			}
		}

		const newState = updateState(["myReducer"], defaultAccessStrategy, currentState, { cacheKey: "myDifferentCacheKey" });
		expect(newState.myReducer).toHaveProperty("myDifferentCacheKey", null)
	});

	describe("logging:", () => {
		beforeEach(() => {
			logResultSpy.mockClear();
			logGeneralSpy.mockClear();
		});

		const currentState = {
			myReducer: {
				cacheUntil: 2000,
				myValue: "someValue"
			}
		}

		it("should not perform any logging if logging is not turned on:", () => {
			const newState = updateState(["myReducer"], defaultAccessStrategy, currentState, { log: false });
			expect(logResultSpy.mock.calls.length).toBe(0);
			expect(logGeneralSpy.mock.calls.length).toBe(0);
		})

		it("should log a result with the matched reducers", () => {
			updateState(["myReducer"], defaultAccessStrategy, currentState, { log: true });
			const [matchedCallArgs] = logResultSpy.mock.calls;
			expect(matchedCallArgs).toEqual(["matchedReducers", ["myReducer"]])
		})

		it("should log if it failed to match", () => {
			updateState(["someFakeReducer"], defaultAccessStrategy, currentState, { log: true })
			const [failedMatchArgs] = logGeneralSpy.mock.calls;
			expect(failedMatchArgs).toEqual(["Did not match %s reducer to the state tree", "someFakeReducer"])
		});

		it("should log the cache enabled reducers", () => {
			updateState(["myReducer"], defaultAccessStrategy, currentState, { log: true });
			const [matchedCallArgs, cacheEnabledCallArgs] = logResultSpy.mock.calls;
			expect(cacheEnabledCallArgs).toEqual(["cacheEnabledReducers", ["myReducer"]])
		});
	})
});
