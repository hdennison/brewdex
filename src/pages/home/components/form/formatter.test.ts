import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { Mock } from "vitest";

import { v4 as uuidv4 } from "uuid";
import type { Doc } from "@/modules/document/types";
import { formToDocument } from "./formatter";
import type { FormOutput } from "./types";

// Mock uuid.v4 to return predictable values
vi.mock("uuid", () => ({ v4: vi.fn() }));

describe("formToDocument", () => {
  const ORIGINAL_DATE = new Date("2025-05-11T12:00:00.000Z");

  beforeEach(() => {
    // Freeze time for CreatedAt
    vi.useFakeTimers();
    vi.setSystemTime(ORIGINAL_DATE);

    // Reset uuid mock calls
    (uuidv4 as Mock).mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should map form output to a Doc with trimmed values and generated IDs", () => {
    // Arrange
    const formOutput: FormOutput = {
      name: "  My Document  ",
      contributors: [" Alice ", "Bob"],
      attachments: ["file1.pdf", "image.png"],
    };

    // Set up uuidv4 mock to return sequential IDs
    (uuidv4 as Mock)
      .mockReturnValueOnce("doc-uuid")
      .mockReturnValueOnce("contrib-uuid-1")
      .mockReturnValueOnce("contrib-uuid-2");

    // Act
    const result: Doc = formToDocument(formOutput);

    // Assert
    expect(result.ID).toBe("doc-uuid");
    expect(result.Title).toBe("My Document");
    expect(result.Version).toBe("0.0.1");
    expect(result.CreatedAt).toBe(ORIGINAL_DATE.toISOString());

    // Contributors
    expect(result.Contributors).toHaveLength(2);
    expect(result.Contributors[0]).toEqual({
      ID: "contrib-uuid-1",
      Name: "Alice",
    });
    expect(result.Contributors[1]).toEqual({
      ID: "contrib-uuid-2",
      Name: "Bob",
    });

    // Attachments passed through
    expect(result.Attachments).toEqual(["file1.pdf", "image.png"]);

    // uuidv4 called once + twice for contributors
    expect(uuidv4).toHaveBeenCalledTimes(3);
  });

  it("should handle empty contributors and attachments", () => {
    const formOutput: FormOutput = {
      name: "Doc Only",
      contributors: [],
      attachments: [],
    };

    // Only one call for document ID
    (uuidv4 as Mock).mockReturnValueOnce("doc-only-uuid");

    const result = formToDocument(formOutput);

    expect(result.ID).toBe("doc-only-uuid");
    expect(result.Title).toBe("Doc Only");
    expect(result.Contributors).toEqual([]);
    expect(result.Attachments).toEqual([]);
    expect(uuidv4).toHaveBeenCalledTimes(1);
  });
});
