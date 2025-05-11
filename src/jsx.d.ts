import { h, Fragment } from "@/lib/jsx/jsx-runtime";

declare global {
  namespace JSX {
    // The return type of your h()
    type Element = ReturnType<typeof h>;

    // Any intrinsic element is allowed (you can tighten this later)
    interface IntrinsicElements {
      [tagName: string]: any;
    }

    // If you ever use class components:
    interface ElementClass {
      render(): Element;
    }
  }
}
