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
});