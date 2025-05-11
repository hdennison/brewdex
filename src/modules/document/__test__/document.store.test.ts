import { describe, it, expect, beforeEach } from "vitest";
import { DocumentStore } from "../document.store";
import type { Doc } from "../types";

describe("DocumentStore", () => {
  let store: DocumentStore;
  let docA: Doc, docB: Doc, docC: Doc, docD: Doc, docE: Doc;

  beforeEach(() => {
    store = new DocumentStore();
    docA = {
      ID: "1",
      Title: "Alpha",
      Version: "1.0.0",
      CreatedAt: "2020-01-01T00:00:00Z",
      Contributors: [],
      Attachments: [],
    };
    docB = {
      ID: "2",
      Title: "Beta",
      Version: "1.1.0",
      CreatedAt: "2020-06-01T00:00:00Z",
      Contributors: [],
      Attachments: [],
    };
    docC = {
      ID: "3",
      Title: "Gamma",
      Version: "2.0.0",
      CreatedAt: "2021-01-01T00:00:00Z",
      Contributors: [],
      Attachments: [],
    };
    docD = {
      ID: "4",
      Title: "Delta",
      Version: "1.0.1",
      CreatedAt: "2020-02-01T00:00:00Z",
      Contributors: [],
      Attachments: [],
    };
    docE = {
      ID: "5",
      Title: "Epsilon",
      Version: "1.0.5",
      CreatedAt: "2020-03-01T00:00:00Z",
      Contributors: [],
      Attachments: [],
    };
    // start with A, B, C by default
    store.set([docA, docB, docC]);
  });

  it('sortBy "title" orders documents alphabetically by Title', () => {
    store.set([docC, docA, docB]);
    store.sortBy("title");
    const titles = store.get().map((d) => d.Title);
    expect(titles).toEqual(["Alpha", "Beta", "Gamma"]);
  });

  it('sortBy "version" orders by semantic Version then Title', () => {
    store.set([docB, docC, docA, docD]);
    store.sortBy("version");
    const versions = store.get().map((d) => d.Version);
    expect(versions).toEqual(["1.0.0", "1.0.1", "1.1.0", "2.0.0"]);

    // test fallback to Title when versions equal
    const docX: Doc = { ...docA, ID: "6", Title: "Zeta" };
    const docY: Doc = { ...docA, ID: "7", Title: "Eta" };
    store.set([docX, docY]);
    store.sortBy("version");
    const titles = store.get().map((d) => d.Title);
    expect(titles).toEqual(["Eta", "Zeta"]);
  });

  it('sortBy "date" orders by CreatedAt lex order', () => {
    store.set([docB, docC, docA, docD]);
    store.sortBy("creationDate");
    const dates = store.get().map((d) => d.CreatedAt);
    expect(dates).toEqual([
      "2020-01-01T00:00:00Z",
      "2020-02-01T00:00:00Z",
      "2020-06-01T00:00:00Z",
      "2021-01-01T00:00:00Z",
    ]);
  });

  it("add() appends when no sortBy has been called", () => {
    // new clean store
    store = new DocumentStore();
    store.set([docA]);
    store.add(docB);
    expect(store.get()).toEqual([docA, docB]);
  });

  it('add() inserts in correct position after sortBy "title"', () => {
    // current store is [Alpha, Beta, Gamma]
    store.sortBy("title");
    // add Delta => should go between Beta and Gamma
    store.add(docD);
    const titles = store.get().map((d) => d.Title);
    expect(titles).toEqual(["Alpha", "Beta", "Delta", "Gamma"]);
  });

  it('add() inserts in correct position after sortBy "version"', () => {
    store.set([docA, docB, docC, docD]);
    store.sortBy("version"); // now [1.0.0,1.0.1,1.1.0,2.0.0]
    store.add(docE); // 1.0.5 between 1.0.1 and 1.1.0
    const versions = store.get().map((d) => d.Version);
    expect(versions).toEqual(["1.0.0", "1.0.1", "1.0.5", "1.1.0", "2.0.0"]);
  });

  it('add() inserts in correct position after sortBy "date"', () => {
    store.set([docA, docB, docC]);
    store.sortBy("creationDate"); // [2020-01-01,2020-06-01,2021-01-01]
    const newDoc: Doc = {
      ...docA,
      ID: "8",
      CreatedAt: "2020-03-15T00:00:00Z",
    };
    store.add(newDoc);
    const dates = store.get().map((d) => d.CreatedAt);
    expect(dates).toEqual([
      "2020-01-01T00:00:00Z",
      "2020-03-15T00:00:00Z",
      "2020-06-01T00:00:00Z",
      "2021-01-01T00:00:00Z",
    ]);
  });
});
