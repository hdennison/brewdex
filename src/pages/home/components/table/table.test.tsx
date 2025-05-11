import { screen, waitFor } from "@testing-library/dom";
import { DocumentStore } from "@/modules/document/document.store";
import { beforeEach, describe, expect, it } from "vitest";
import { documentFactory } from "@/modules/document/__test__/document.factory";
import { DocumentTable } from "./table";
import { LayoutStore } from "../../home.store";


let container: HTMLElement;
let documentStore: DocumentStore;
let layoutStore: LayoutStore;

beforeEach(() => {
  document.body.innerHTML = "";
  container = document.createElement("div");
  document.body.appendChild(container);

  documentStore = new DocumentStore();
  layoutStore = new LayoutStore();
});

describe("DocumentTable", () => {
  it("renders initial documents", async () => {
    const docs = [
      documentFactory.build({ Title: "Alpha" }),
      documentFactory.build({ Title: "Beta" }),
    ];
    documentStore.set(docs);

    const table = new DocumentTable({ documentStore, layoutStore });
    table.mount(container);

    await waitFor(() => {
      const alpha = screen.getByText("Alpha");
      const beta = screen.getByText("Beta");

      expect(alpha).not.toBeNull();
      expect(beta).not.toBeNull();
    });
  });

  it("updates when store changes", async () => {
    const initial = [
      documentFactory.build({ Title: "One" }),
    ];
    const updated = [
      documentFactory.build({ Title: "Two" }),
    ];

    documentStore.set(initial);
    const table = new DocumentTable({ documentStore, layoutStore });
    table.mount(container);

    expect(screen.getByText("One")).not.toBeNull();

    documentStore.set(updated);

    await waitFor(() => {
      expect(screen.queryByText("One")).toBeNull();
      expect(screen.getByText("Two")).not.toBeNull();
    });
  });
});
