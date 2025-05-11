import { EventEmitter } from "./event-emitter";
import type { Listener } from "./types";

interface StoreEvents<T> {
  dataChange: T[];
}

export class Store<T> {
  private data: T[];
  private emitter = new EventEmitter<StoreEvents<T>>();

  constructor(initialData: T[] = []) {
    this.data = initialData;
  }

  /**
   * Subscribe to data changes. Immediately invokes listener with current data.
   * Returns an unsubscribe function.
   */
  subscribe(listener: Listener<T[]>): () => void {
    this.emitter.on("dataChange", listener);
    listener([...this.data]);
    return () => this.emitter.off("dataChange", listener);
  }

  /** Get a shallow copy of the data array */
  get(): T[] {
    return [...this.data];
  }

  /** Replace the data array and notify subscribers */
  set(data: T[]): void {
    this.data = data;
    this.notify();
  }

  /** Update data via an updater function */
  update(updater: (data: T[]) => T[]): void {
    this.data = updater(this.data);
    this.notify();
  }

  /** Add a single item and notify subscribers */
  add(item: T): void {
    this.data.push(item);
    this.notify();
  }

  /** Remove items matching predicate and notify subscribers */
  remove(predicate: (item: T) => boolean): void {
    this.data = this.data.filter((item) => !predicate(item));
    this.notify();
  }

  /** Internal: emit cloned data to prevent external mutation */
  private notify(): void {
    this.emitter.emit("dataChange", [...this.data]);
  }
}
