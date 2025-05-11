import type { Listener } from "./types";

export class EventEmitter<Events extends Record<string, any>> {
  private listeners: {
    [K in keyof Events]?: Array<Listener<Events[K]>>;
  } = {};

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void {
    const listeners = this.listeners[event];
    if (!listeners) return;
    const idx = listeners.indexOf(listener);
    if (idx !== -1) {
      listeners.splice(idx, 1);
    }
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    const listeners = this.listeners[event];
    if (!listeners) return;
    // Copy the array in case a listener calls off()
    listeners.slice().forEach((fn) => fn(data));
  }
}
