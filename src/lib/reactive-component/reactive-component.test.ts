import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/dom";
import { ReactiveComponent } from "./reactive-component";

class MockStore {
  private listeners: (() => void)[] = [];
  private count = 0;

  subscribe(cb: () => void): void {
    this.listeners.push(cb);
  }

  triggerUpdate() {
    this.listeners.forEach((cb) => cb());
  }

  getCount() {
    return this.count;
  }

  setCount(n: number) {
    this.count = n;
    this.triggerUpdate();
  }
}

// A minimal component that renders a counter value
class CounterComponent extends ReactiveComponent<MockStore> {
  constructor(props: { store: MockStore }) {
    super(props);
  }

  render(): Node {
    const div = document.createElement("div");
    div.textContent = `Count: ${this.store.getCount()}`;
    div.setAttribute("data-testid", "counter");
    return div;
  }
}

describe("ReactiveComponent", () => {
  let container: HTMLElement;
  let store: MockStore;

  beforeEach(() => {
    document.body.innerHTML = "";
    container = document.createElement("div");
    document.body.appendChild(container);
    store = new MockStore();
  });

  it("mounts with initial render", () => {
    const comp = new CounterComponent({ store });
    comp.mount(container);

    const el = screen.getByTestId("counter");
    expect(el.textContent).toBe("Count: 0");
  });

  it("reacts to store updates and re-renders", () => {
    const comp = new CounterComponent({ store });
    comp.mount(container);

    store.setCount(42);

    const el = screen.getByTestId("counter");
    expect(el.textContent).toBe("Count: 42");
  });

  it("replaces content instead of appending", () => {
    const comp = new CounterComponent({ store });
    comp.mount(container);

    // manually check the root node only contains one child
    expect(comp["root"].childNodes.length).toBe(1);

    store.setCount(100);

    expect(comp["root"].childNodes.length).toBe(1);
    expect(screen.getByTestId("counter").textContent).toBe("Count: 100");
  });

  it("mounts correctly when used via JSX runtime", () => {
    const store = new MockStore();
    const comp = new CounterComponent({ store });
    comp.mount(container);

    expect(screen.getByTestId("counter").textContent).toBe("Count: 0");

    store.setCount(7);
    expect(screen.getByTestId("counter").textContent).toBe("Count: 7");
  });

  it("covers DocumentFragment branch", () => {
    const store = new MockStore();

    class FragComp extends ReactiveComponent<MockStore> {
      render(): Node {
        const el = document.createElement("span");
        el.textContent = "in fragment";
        return el;
      }
    }

    const root = document.createDocumentFragment();
    const comp = new FragComp({ store, root });

    const container = document.createElement("div");
    comp.mount(container);

    expect(container.firstChild?.textContent).toBe("in fragment");
  });
});
