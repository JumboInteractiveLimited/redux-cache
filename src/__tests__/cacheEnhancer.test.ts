var MockDate = require("mockdate");

import cacheEnhancer, { liftReducer } from "../cacheEnhancer";
import { INVALIDATE_CACHE } from '../actions';
import { DEFAULT_KEY } from "../constants";

beforeEach(() => {
	MockDate.set(0);
});

describe('cacheEnhancer', () => {
	
});

describe('liftReducer', () => {
	let reducer;
	let state;
	let action;

	beforeEach(() => {
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