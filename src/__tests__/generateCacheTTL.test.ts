import { generateCacheTTL } from "../generateCacheTTL";
import { DEFAULT_DURATION_MS } from "../constants";

Date.now = jest.fn(() => 0);

it("returns a TTL using the default duration if no duration parameter is provided", () => {
	var cacheUntil = generateCacheTTL();
	expect(cacheUntil).toEqual(Date.now() + DEFAULT_DURATION_MS);
});

it("returns a TTL using the duration if provided as a parameter", () => {
	var cacheUntil = generateCacheTTL(5000);
	expect(cacheUntil).toEqual(Date.now() + 5000);
});