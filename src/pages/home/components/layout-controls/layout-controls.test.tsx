import { screen, fireEvent } from "@testing-library/dom";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { LayoutControls } from "./layout-controls";
import { layoutModes } from "../../home.store";
import { Store } from "@/lib/store/store";

class MockLayoutStore extends Store<string> {
  constructor(initial: string[] = []) {
    super(initial);
  }
}

describe("LayoutControls", () => {
  let container: HTMLElement;
  let store: MockLayoutStore;

  beforeEach(() => {
    document.body.innerHTML = "";
    container = document.createElement("div");
    document.body.appendChild(container);

    store = new MockLayoutStore([layoutModes[0]]);
  });

  it("renders one button per layout mode", () => {
    const comp = new LayoutControls({ store });
    comp.mount(container);

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(layoutModes.length);
  });

  it("marks the active layout with aria-pressed=true", () => {
    store.set([layoutModes[1]]);
    const comp = new LayoutControls({ store });
    comp.mount(container);

    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn, i) => {
      const expected = layoutModes[i] === layoutModes[1];
      expect(btn.getAttribute("aria-pressed")).toBe(String(expected));
    });
  });

  it("updates the layout when a button is clicked", () => {
    const spy = vi.spyOn(store, "set");
    const comp = new LayoutControls({ store });
    comp.mount(container);

    const secondBtn = screen.getAllByRole("button")[1];
    fireEvent.click(secondBtn);

    expect(spy).toHaveBeenCalledWith([layoutModes[1]]);
  });
});
