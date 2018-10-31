import { defaultAccessStrategy } from "../utils";

describe("defaultAccessStrategy", () => {
	it("should access the cache key", () => {
		const reducerKey = "myReducer";
		const cacheKey = "cacheUntil";

		const state = {
			[reducerKey]: {
				[cacheKey]: 1000
			}
		}

		expect(defaultAccessStrategy(state, reducerKey, cacheKey)).toBe(1000);
	});
});