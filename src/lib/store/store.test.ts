import { describe, it, expect, vi, beforeEach } from "vitest";
import { Store } from "./store";

describe("Store<T>", () => {
  let store: Store<number>;
  let listener: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    store = new Store<number>([1, 2, 3]);
    listener = vi.fn();
  });

  it("calls subscriber immediately with initial data", () => {
    store.subscribe(listener);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith([1, 2, 3]);
  });

  it("get() returns the current data array", () => {
    expect(store.get()).toEqual([1, 2, 3]);
  });

  it("set() replaces data and notifies subscribers", () => {
    store.subscribe(listener);
    listener.mockClear();

    store.set([10, 20]);
    expect(store.get()).toEqual([10, 20]);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith([10, 20]);
  });

  it("update() lets you derive new data and notifies", () => {
    store.subscribe(listener);
    listener.mockClear();

    store.update((data) => data.map((n) => n * 2));
    expect(store.get()).toEqual([2, 4, 6]);
    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith([2, 4, 6]);
  });

  it("add() appends an item and notifies", () => {
    store.subscribe(listener);
    listener.mockClear();

    store.add(4);
    expect(store.get()).toEqual([1, 2, 3, 4]);
    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith([1, 2, 3, 4]);
  });

  it("remove() filters out matching items and notifies", () => {
    store.subscribe(listener);
    listener.mockClear();

    // remove evens
    store.remove((n) => n % 2 === 0);
    expect(store.get()).toEqual([1, 3]);
    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith([1, 3]);
  });

  it("multiple subscribers each get notified", () => {
    const listener2 = vi.fn();
    store.subscribe(listener);
    store.subscribe(listener2);
    listener.mockClear();
    listener2.mockClear();

    store.set([42]);
    expect(listener).toHaveBeenCalledWith([42]);
    expect(listener2).toHaveBeenCalledWith([42]);
  });

  it("unsubscribe stops further notifications", () => {
    const unsubscribe = store.subscribe(listener);
    listener.mockClear();

    store.set([5]);
    expect(listener).toHaveBeenCalledOnce();

    unsubscribe();
    listener.mockClear();

    store.set([6]);
    expect(listener).not.toHaveBeenCalled();
  });
});
