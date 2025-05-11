import { Store } from "@/lib/store/store";

export const layoutModes = ["list", "grid"];
export type LayoutMode = (typeof layoutModes)[number];
export class LayoutStore extends Store<LayoutMode> {}
