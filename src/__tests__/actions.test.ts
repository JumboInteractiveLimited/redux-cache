import { defaultAccessStrategy, defaultInvalidateStrategy } from "../utils";
import { invalidateCache } from "../actions";

describe("invalidateCache", () => {
	it("returns an empty array of reducers if none are provided as a parameter", () => {
		const invalidateAction = invalidateCache();
		expect(invalidateAction.payload.reducers).toEqual([]);
	});

	it("contains an array of reducers when provided as a parameter", () => {
		const expected = ["myReducer"];
		const invalidateAction = invalidateCache(expected);
		expect(invalidateAction.payload.reducers).toEqual(expected);
	});

	it("returns an array of reducers if provided a string as a parameter", () => {
		const expected = ["myReducer"];
		const invalidateAction = invalidateCache("myReducer");
		expect(invalidateAction.payload.reducers).toEqual(expected);
	});

	it("should use the default access strategy if none is provided", () => {
		const invalidateAction = invalidateCache("myReducer");
		expect(invalidateAction.payload.accessStrategy).toEqual(defaultAccessStrategy);
	});

	it("should use the default invalidate strategy if none is provided", () => {
		const invalidateAction = invalidateCache("myReducer");
		expect(invalidateAction.payload.invalidateStrategy).toEqual(defaultInvalidateStrategy);
	});

	it("should use the provided access strategy", () => {
		const myAccessStrategy = (state, reducerKey, cacheKey) => {
			return state && state[reducerKey].myKey && state[reducerKey].myKey[cacheKey]
		};

		const invalidateAction = invalidateCache("myReducer", {
			accessStrategy: myAccessStrategy
		});
		expect(invalidateAction.payload.accessStrategy).toEqual(myAccessStrategy);
	});

	it("should use the provided invalidate strategy", () => {
		const myInvalidateStrategy = (state, reducerKey, cacheKey) => {
			return {
				[reducerKey]: {
					...state[reducerKey],
					[cacheKey]: null
				}
			}
		};

		const invalidateAction = invalidateCache("myReducer", {
			invalidateStrategy: myInvalidateStrategy
		});

		expect(invalidateAction.payload.invalidateStrategy).toEqual(myInvalidateStrategy);
	});
});