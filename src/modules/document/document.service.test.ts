import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { DocumentService } from "./document.service";
import type { Doc } from "./types";

const mockDocs: Partial<Doc>[] = [
  { ID: "1", Title: "Document 1" },
  { ID: "2", Title: "Document 2" },
];

describe("DocumentService", () => {
  const service = new DocumentService("http://localhost:8080");

  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches documents successfully", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDocs,
    });

    const result = await service.fetchAllDocuments();

    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/documents");
    expect(result).toEqual(mockDocs);
  });

  it("handles non-ok response gracefully", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const result = await service.fetchAllDocuments();

    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/documents");
    expect(result).toEqual([]);
  });

  it("handles fetch error gracefully", async () => {
    (fetch as any).mockRejectedValueOnce(new Error("Network Error"));

    const result = await service.fetchAllDocuments();

    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/documents");
    expect(result).toEqual([]);
  });
});
