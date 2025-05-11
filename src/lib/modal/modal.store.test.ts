import { describe, it, expect, beforeEach, vi } from "vitest";
import { ModalStore } from "./modal.store";

describe("ModalStore", () => {
  let store: ModalStore;

  beforeEach(() => {
    // initialize with closed state
    store = new ModalStore({ open: false });
  });

  it("should initialize with given state", () => {
    expect(store.isOpen()).toBe(false);
  });

  it("should open the modal", () => {
    store.open();
    expect(store.isOpen()).toBe(true);
  });

  it("should close the modal", () => {
    // open first
    store.open();
    expect(store.isOpen()).toBe(true);

    // then close
    store.close();
    expect(store.isOpen()).toBe(false);
  });

  it("should notify subscribers on open", () => {
    const subscriber = vi.fn();
    store.subscribe(subscriber);
    // Clear initial notification
    subscriber.mockClear();

    store.open();
    expect(subscriber).toHaveBeenCalledTimes(1);
  });

  it("should notify subscribers on close", () => {
    const subscriber = vi.fn();
    store.subscribe(subscriber);
    // Clear initial notification
    subscriber.mockClear();

    store.close();
    expect(subscriber).toHaveBeenCalledTimes(1);
  });
});
