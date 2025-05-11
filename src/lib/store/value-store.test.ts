import { describe, it, expect, vi, beforeEach } from "vitest";
import { createValueStore } from "./value-store";
import { Store } from "./store";

describe("createValueStore", () => {
  let getCount: () => number;
  let setCount: (v: number) => void;
  let store: Store<number>;

  beforeEach(() => {
    [getCount, setCount, store] = createValueStore(0);
  });

  it("returns an initial count", () => {
    expect(getCount()).toBe(0);
  });

  it("setCount updates the count returned by getCount", () => {
    setCount(5);
    expect(getCount()).toBe(5);
    setCount(-3);
    expect(getCount()).toBe(-3);
  });

  it("underlying store.get reflects the same value", () => {
    setCount(42);
    expect(store.get()).toEqual([42]);
  });

  it("store.subscribe notifies subscribers with new values", () => {
    const callback = vi.fn();
    const unsubscribe = store.subscribe((arr) => callback(arr[0]));

    // immediate notification
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(0);

    // update
    setCount(7);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith(7);

    // unsubscribe and further updates do not notify
    unsubscribe();
    setCount(9);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("multiple subscribers each get notified independently", () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();

    // subscribe first listener and assert its immediate notification
    const unsub1 = store.subscribe((arr) => cb1(arr[0]));
    expect(cb1).toHaveBeenCalledTimes(1);
    expect(cb1).toHaveBeenCalledWith(0);
    cb1.mockClear();

    // subscribe second listener and assert its immediate notification
    store.subscribe((arr) => cb2(arr[0]));

    expect(cb2).toHaveBeenCalledTimes(1);
    expect(cb2).toHaveBeenCalledWith(0);
    cb2.mockClear();

    // update both
    setCount(3);
    expect(cb1).toHaveBeenCalledWith(3);
    expect(cb2).toHaveBeenCalledWith(3);

    // unsubscribe only first and update again
    unsub1();
    cb1.mockClear();
    cb2.mockClear();
    setCount(8);
    expect(cb1).not.toHaveBeenCalled();
    expect(cb2).toHaveBeenCalledWith(8);
  });
});
