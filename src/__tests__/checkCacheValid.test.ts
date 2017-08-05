var MockDate = require("mockdate");
import checkCacheValid, { State } from "../checkCacheValid";
import { DEFAULT_KEY } from "../constants";

let getState: () => State;

beforeEach(() => {
	getState = () => ({
		[DEFAULT_KEY]: 5000,
	});
	MockDate.set(0);
})

afterEach(() => {
	MockDate.reset();
});

it("returns false if there is no cache key on the reducer", () => {
	getState = () => ({ notValidKey: 1 });
	const isCacheValid = checkCacheValid(getState);
	expect(isCacheValid).toBe(false);
});

it("returns true if the TTL is greater than the current date and time", () => {
	const isCacheValid = checkCacheValid(getState);
	expect(isCacheValid).toBe(true);
});

it("returns false if the TTL is less than the current date and time", () => {
	MockDate.set(5001);
	const isCacheValid = checkCacheValid(getState);
	expect(isCacheValid).toBe(false);
})

it("uses the provided cache key to check if one is provided as a parameter", () => {
	getState = () => ({ myOwnKey: 4000 });
	expect(checkCacheValid(getState)).toBe(false);
	const isCacheValid = checkCacheValid(getState, "myOwnKey");
	expect(checkCacheValid(getState, "myOwnKey")).toBe(true);
});
