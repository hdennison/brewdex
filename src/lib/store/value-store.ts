import { Store } from "./store";

export function createValueStore<T>(
  initial: T
): [() => T, (v: T) => void, Store<T>] {
  const store = new Store<T>([initial]);

  const get = () => store.get()[0];

  const set = (v: T) => store.set([v]);
  return [get, set, store];
}
