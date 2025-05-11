import { describe, it, expect, beforeEach } from "vitest";
import { loadPageFromRoute } from "./router";

// Mock the dynamic imports
vi.mock("@/pages/home/home.page", () => ({
  default: "HomePageComponent",
}));

vi.mock("@/pages/not-found/not-found.page", () => ({
  default: "NotFoundPageComponent",
}));

describe("loadPageFromRoute", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('loads the home page module for path "/"', async () => {
    const page = await loadPageFromRoute("/");
    expect(page).toBe("HomePageComponent");
  });

  it("loads the not-found page module for unknown paths", async () => {
    for (const p of ["/foo", "/about", ""]) {
      const page = await loadPageFromRoute(p);
      expect(page).toBe("NotFoundPageComponent");
    }
  });
});
