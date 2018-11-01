import { defaultAccessStrategy, defaultInvalidateStrategy } from "../utils";

const reducerKey = "myReducer";
const cacheKey = "cacheUntil";

const state = {
	[reducerKey]: {
		myKey: "myValue",
		[cacheKey]: 1000
	}
}

const expected = {
	[reducerKey]: {
		myKey: "myValue",
		[cacheKey]: null
	}
}

describe("defaultAccessStrategy", () => {
	it("should access the cache key", () => {
		expect(defaultAccessStrategy(state, reducerKey, cacheKey)).toBe(1000);
	});
});

describe("defaultInvalidateStrategy", () => {
	it("should wipe the cache key", () => {
		expect(defaultInvalidateStrategy(state, reducerKey, cacheKey)).toEqual(expected);
	});
});