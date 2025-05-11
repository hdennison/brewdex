import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { getRelativeTimeFromNow } from "./date";

describe("getRelativeTimeFromNow", () => {
  // Freeze Date.now() to a fixed point for deterministic tests
  const fixedNow = Date.parse("2023-01-01T00:00:00Z");
  let nowSpy: ReturnType<typeof vi.spyOn>;

  beforeAll(() => {
    nowSpy = vi.spyOn(Date, "now").mockReturnValue(fixedNow);
  });

  afterAll(() => {
    nowSpy.mockRestore();
  });

  it('returns "now" for the exact same timestamp in ms', () => {
    expect(getRelativeTimeFromNow(fixedNow)).toBe("now");
  });

  it('returns "now" for the exact same timestamp as numeric string in seconds', () => {
    const secsString = (fixedNow / 1000).toString();
    expect(getRelativeTimeFromNow(secsString)).toBe("now");
  });

  it("reports minutes ago for past timestamps", () => {
    const twoMinutesAgo = fixedNow - 2 * 60 * 1000;
    expect(getRelativeTimeFromNow(twoMinutesAgo)).toBe("2 minutes ago");
  });

  it("reports in days for future timestamps", () => {
    const inFiveDays = fixedNow + 5 * 24 * 60 * 60 * 1000;
    expect(getRelativeTimeFromNow(inFiveDays)).toBe("in 5 days");
  });

  it("parses ISO strings correctly", () => {
    const isoString = new Date(
      fixedNow - 7 * 24 * 60 * 60 * 1000
    ).toISOString();
    expect(getRelativeTimeFromNow(isoString)).toBe("7 days ago");
  });
});
