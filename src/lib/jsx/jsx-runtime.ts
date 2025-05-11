import { ReactiveComponent } from "@/lib/reactive-component/reactive-component";

export const Fragment = Symbol("Fragment");

export function h(
  tag: any,
  props?: Record<string, any>,
  ...children: any[]
): Node {
  props = props ?? {};

  // Fragment support
  if (tag === Fragment) {
    const frag = document.createDocumentFragment();
    children
      .flat(Infinity)
      .filter((c) => c != null)
      .forEach((c) =>
        frag.append(c instanceof Node ? c : document.createTextNode(String(c)))
      );
    return frag;
  }

  if (typeof tag === "function" && tag.prototype instanceof ReactiveComponent) {
    const comp = new tag(props);
    const frag = document.createDocumentFragment();
    comp.mount(frag);
    return comp.root;
  }

  if (typeof tag === "function") {
    return tag(props, children);
  }

  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith("on") && typeof value === "function") {
      el.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
    } else if (key === "className") {
      el.setAttribute("class", String(value));
    } else if (key === "htmlFor") {
      el.setAttribute("for", String(value));
    } else if (key === "style" && typeof value === "object") {
      Object.assign((el as HTMLElement).style, value);
    } else {
      el.setAttribute(key, String(value));
    }
  }

  children
    .flat(Infinity)
    .filter((c) => c != null)
    .forEach((child) => {
      if (child instanceof Node) {
        el.append(child);
      } else {
        el.append(document.createTextNode(String(child)));
      }
    });

  return el;
}

export { h as jsx, h as jsxs };
