import { describe, it, expect, beforeEach } from "vitest";

import { documentFactory } from "@/modules/document/__test__/document.factory";
import { DocumentStore } from "../document.store";

describe("DocumentStore.sortBy", () => {
  let store: DocumentStore;

  beforeEach(() => {
    store = new DocumentStore();
  });

  function getTitles(): string[] {
    return store.get().map((d) => d.Title);
  }

  it("sorts documents by title", () => {
    store.set([
      documentFactory.build({ Title: "Zebra" }),
      documentFactory.build({ Title: "Alpha" }),
      documentFactory.build({ Title: "Lemon" }),
    ]);

    store.sortBy("title");

    expect(getTitles()).toEqual(["Alpha", "Lemon", "Zebra"]);
  });

  it("sorts documents by version", () => {
    store.set([
      documentFactory.build({ Title: "Doc C", Version: "2.1.0" }),
      documentFactory.build({ Title: "Doc A", Version: "1.0.5" }),
      documentFactory.build({ Title: "Doc B", Version: "1.0.10" }),
    ]);

    store.sortBy("version");

    expect(getTitles()).toEqual(["Doc A", "Doc B", "Doc C"]);
  });

  it("falls back to title when versions are equal", () => {
    store.set([
      documentFactory.build({ Title: "Bravo", Version: "1.0.0" }),
      documentFactory.build({ Title: "Alpha", Version: "1.0.0" }),
    ]);

    store.sortBy("version");

    expect(getTitles()).toEqual(["Alpha", "Bravo"]);
  });

  it("sorts documents by CreatedAt date", () => {
    store.set([
      documentFactory.build({ Title: "Newest", CreatedAt: "2024-01-10" }),
      documentFactory.build({ Title: "Oldest", CreatedAt: "2022-05-20" }),
      documentFactory.build({ Title: "Middle", CreatedAt: "2023-03-01" }),
    ]);

    store.sortBy("creationDate");

    expect(getTitles()).toEqual(["Oldest", "Middle", "Newest"]);
  });
});
