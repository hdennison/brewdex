import { describe, it, expect, beforeEach, vi } from "vitest";
import { h, Fragment } from "./jsx-runtime";
import { ReactiveComponent } from "@/lib/reactive-component/reactive-component";

describe("jsx-runtime h / Fragment", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders a DocumentFragment for Fragment, flattening and filtering children", () => {
    const frag = h(
      Fragment,
      undefined,
      "a",
      null,
      ["b", ["c", null]],
      document.createTextNode("d")
    );
    expect(frag.nodeType).toBe(Node.DOCUMENT_FRAGMENT_NODE);
    const texts = Array.from(frag.childNodes).map((n) => n.textContent);
    expect(texts).toEqual(["a", "b", "c", "d"]);
  });

  it("creates a native element with props, event listeners, style, and children", () => {
    const handleClick = vi.fn();
    const el = h(
      "button",
      {
        onClick: handleClick,
        className: "foo bar",
        htmlFor: "input-id",
        title: "hi",
        style: { color: "blue", display: "inline-block" },
        "data-test": "xyz",
      },
      "Click me"
    ) as HTMLButtonElement;

    expect(el.tagName).toBe("BUTTON");
    expect(el.getAttribute("class")).toBe("foo bar");
    expect(el.getAttribute("for")).toBe("input-id");
    expect(el.getAttribute("title")).toBe("hi");
    expect(el.getAttribute("data-test")).toBe("xyz");
    expect(el.style.color).toBe("blue");
    expect(el.style.display).toBe("inline-block");
    expect(el.textContent).toBe("Click me");

    el.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("invokes a functional component with props and children", () => {
    function FuncComp(props: { label: string }, children: any[]) {
      const p = document.createElement("p");
      p.textContent = `${props.label}:${children.join(",")}`;
      return p;
    }

    const node = h(FuncComp, { label: "X" }, "1", "2");
    expect(node).toBeInstanceOf(HTMLParagraphElement);
    expect((node as HTMLParagraphElement).textContent).toBe("X:1,2");
  });

  it("mounts a ReactiveComponent subclass, passing full props object", () => {
    const stubStore = {
      subscribe: vi.fn((cb: () => void) => {
        cb();
      }),
    };
    const renderSpy = vi.fn();

    class MyComp extends ReactiveComponent<typeof stubStore> {
      constructor(props: { store: typeof stubStore }) {
        super(props);
      }

      public render(): Node {
        renderSpy();
        const span = document.createElement("span");
        span.textContent = `counted`;
        return span;
      }
    }

    // h returns the component's root <div> directly
    const rootDiv = h(MyComp, { store: stubStore }, []) as HTMLDivElement;

    // subscribe called once in constructor
    expect(stubStore.subscribe).toHaveBeenCalledTimes(1);
    // renderSpy called once from subscribe callback and once from mount()
    expect(renderSpy).toHaveBeenCalledTimes(2);

    // rootDiv is the component's this.root
    expect(rootDiv.tagName).toBe("DIV");
    // and contains the <span> returned by render()
    const span = rootDiv.firstChild!;
    expect(span).toBeInstanceOf(HTMLSpanElement);
    expect((span as HTMLSpanElement).textContent).toBe("counted");
  });

  it("appends actual Node children without wrapping in text", () => {
    const childSpan = document.createElement("span");
    childSpan.setAttribute("data-role", "inner");
    childSpan.textContent = "inner text";

    const container = h("div", {}, childSpan) as HTMLDivElement;

    expect(container.childNodes.length).toBe(1);
    const appended = container.firstChild!;
    expect(appended).toBe(childSpan);
    expect((appended as HTMLSpanElement).getAttribute("data-role")).toBe(
      "inner"
    );
    expect((appended as HTMLSpanElement).textContent).toBe("inner text");
  });

  it("falls back to error when ReactiveComponent misses store prop", () => {
    class BrokenComp extends ReactiveComponent<any> {
      constructor(props: any) {
        super(props.store);
      }
      public render() {
        return document.createTextNode("");
      }
    }
    expect(() => h(BrokenComp as any, {}, [])).toThrow();
  });
});
