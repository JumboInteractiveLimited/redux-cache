var MockDate = require("mockdate");

import checkCacheValid, { State } from "../checkCacheValid";
import { DEFAULT_KEY } from "../constants";

let getState: () => State;

beforeEach(() => {
	getState = () => ({
		posts: {
			[DEFAULT_KEY]: 5000,
		}
	});
	MockDate.set(0);
})

afterEach(() => {
	MockDate.reset();
});

it("returns false if there is no cache key on the reducer", () => {
	getState = () => ({ posts: { notValidKey: 1 }});
	const isCacheValid = checkCacheValid(getState, "posts");
	expect(isCacheValid).toBe(false);
});

it("returns true if the TTL is greater than the current date and time", () => {
	const isCacheValid = checkCacheValid(getState, "posts");
	expect(isCacheValid).toBe(true);
});

it("returns false if the TTL is less than the current date and time", () => {
	MockDate.set(5001);
	const isCacheValid = checkCacheValid(getState, "posts");
	expect(isCacheValid).toBe(false);
})

it("uses the provided cache key to check if one is provided as a parameter", () => {
	getState = () => ({ posts: { myOwnKey: 4000 }});
	expect(checkCacheValid(getState, "posts")).toBe(false);
	expect(checkCacheValid(getState, "posts", "myOwnKey")).toBe(true);
});
