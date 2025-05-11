import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent } from "@testing-library/dom";
import { Modal } from "./modal";
import { ModalStore } from "./modal.store";

describe("Modal", () => {
  let store: ModalStore;
  let container: HTMLElement;
  let content: Node;
  let modal: Modal;

  beforeEach(() => {
    document.body.innerHTML = "";
    store = new ModalStore({ open: false });
    container = document.createElement("div");
    content = document.createTextNode("Test content");
    modal = new Modal({ content, store, title: "Test Title" });
    modal.mount(container);
    document.body.appendChild(container);
  });

  it("should render the title", () => {
    const heading = container.querySelector("#modal-heading");
    expect(heading).not.toBeNull();
    expect(heading?.textContent).toBe("Test Title");
  });

  it("should render the content inside modal-content", () => {
    const contentDiv = container.querySelector("#modal-content");
    expect(contentDiv).not.toBeNull();
    expect(contentDiv?.textContent).toBe("Test content");
  });

  it("should open dialog when store is opened", () => {
    store.open();
    const dialog = container.querySelector("dialog") as HTMLDialogElement;
    expect(dialog.open).toBe(true);
  });

  it("should close dialog when store is closed", () => {
    // open first
    store.open();
    let dialog = container.querySelector("dialog") as HTMLDialogElement;
    expect(dialog.open).toBe(true);

    // then close
    store.close();
    dialog = container.querySelector("dialog") as HTMLDialogElement;
    expect(dialog.open).toBe(false);
  });

  it("should call store.close when close button is clicked", () => {
    store.open();
    const button = container.querySelector("button[title='Close dialog']") as HTMLButtonElement;
    const closeSpy = vi.spyOn(store, "close");
    fireEvent.click(button);
    expect(closeSpy).toHaveBeenCalled();
  });
});
