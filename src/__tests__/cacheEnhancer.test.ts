var MockDate = require("mockdate");

import cacheEnhancer, { liftReducer, updateState } from "../cacheEnhancer";
import { INVALIDATE_CACHE } from '../actions';
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
	}
	action = {
		type: INVALIDATE_CACHE,
		payload: {
			reducers: ["myReducer"]
		}
	}
});

describe('cacheEnhancer', () => {
	
});

describe('liftReducer', () => {
	describe("unknown action", () => {
		it("should call the reducer with the given state and action", () => {
			action = {
				type: "UNKNOWN_ACTION"
			}
	
			liftReducer(reducer, {})(state, action);
			const [reducerArgs] = reducer.mock.calls;
			expect(reducerArgs).toEqual([state, action])
		});
	});
	
	describe("invalidate cache action", () => {
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


describe('updateState', () => {
	it("should update the state for cache enabled reducers that match", () => {
		const newState = updateState(["myReducer"], state, {});
		expect(state.myReducer[DEFAULT_KEY]).toBe(null);
	});

	it("should not update reducers that match but are not cache enabled", () => {
		const modifiedState = {
			...state,
			notCacheEnabled: {
				someKey: "someValue"
			}
		}

		const newState = updateState(["notCacheEnabled"], modifiedState, {})
		expect(newState.notCacheEnabled).not.toHaveProperty(DEFAULT_KEY);
	});

	it("should ignore reducers that do not match", () => {
		const modifiedState = {
			...state,
			notCacheEnabled: {
				someKey: "someValue"
			}
		}

		const newState = updateState(["myReducer", "doesntMatch"], modifiedState, {})
		expect(newState).not.toHaveProperty("doesntMatch");
	});
});
