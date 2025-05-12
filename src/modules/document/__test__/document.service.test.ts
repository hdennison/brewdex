import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { DocumentService } from "../document.service";
import type { Doc } from "../types";

describe("DocumentService", () => {
  let service: DocumentService;

  beforeEach(() => {
    service = new DocumentService("http://localhost:8080");
    // Stub the global fetch function
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    // Restore all stubbed globals
    vi.unstubAllGlobals();
  });

  it("throws on non-ok response", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(service.fetchAllDocuments()).rejects.toThrow(
      "Failed to fetch documents: 500 Internal Server Error"
    );
  });

  it("throws on fetch error", async () => {
    (fetch as any).mockRejectedValueOnce(new Error("Network Error"));

    await expect(service.fetchAllDocuments()).rejects.toThrow("Network Error");
  });

  it("returns data on success", async () => {
    const mockDocs: Doc[] = [
      {
        ID: "1",
        Title: "Doc1",
        Version: "1.0",
        CreatedAt: "",
        Contributors: [],
        Attachments: [],
      },
    ];

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.resolve(mockDocs),
    });

    const result = await service.fetchAllDocuments();
    expect(result).toEqual(mockDocs);
  });
});
