import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { AppNotification } from "./types";
import { NotificationSubscription } from "./notification";

// Mock WebSocket implementation
class MockWebSocket {
  static instances: MockWebSocket[] = [];
  url: string;
  readyState = 0; // CONNECTING
  listeners: Record<string, Function[]> = {};

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  static reset() {
    MockWebSocket.instances = [];
  }

  addEventListener(event: string, handler: Function) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(handler);
  }

  close() {
    this.readyState = 3; // CLOSED
    this.emit("close", { code: 1000 });
  }

  emit(event: string, payload?: any) {
    (this.listeners[event] || []).forEach((fn) => fn(payload));
  }
}

describe("NotificationSubscription", () => {
  let onMessage: ReturnType<typeof vi.fn>;
  let onClose: ReturnType<typeof vi.fn>;
  let onError: ReturnType<typeof vi.fn>;
  let consoleWarn: ReturnType<typeof vi.spyOn>;
  let consoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    MockWebSocket.reset();
    vi.useFakeTimers();
    vi.stubGlobal("WebSocket", MockWebSocket);

    onMessage = vi.fn();
    onClose = vi.fn();
    onError = vi.fn();
    consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
    consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    consoleWarn.mockRestore();
    consoleError.mockRestore();
  });

  it("registers all event listeners on the socket", () => {
    new NotificationSubscription({ onMessage, onClose, onError });
    const ws = MockWebSocket.instances[0] as any;
    expect(ws.listeners.open).toHaveLength(1);
    expect(ws.listeners.message).toHaveLength(1);
    expect(ws.listeners.close).toHaveLength(1);
    expect(ws.listeners.error).toHaveLength(1);
  });

  it("processes string messages via onMessage", async () => {
    new NotificationSubscription({ onMessage, onClose, onError });
    const ws = MockWebSocket.instances[0];
    const payload = { test: true } as unknown as AppNotification;
    ws.emit("message", { data: JSON.stringify(payload) });
    await Promise.resolve();
    expect(onMessage).toHaveBeenCalledWith(payload);
  });

  it("processes Blob-like messages via onMessage", async () => {
    new NotificationSubscription({ onMessage, onClose, onError });
    const ws = MockWebSocket.instances[0];
    const payload = { foo: "bar" } as unknown as AppNotification;
    const blob = { text: () => Promise.resolve(JSON.stringify(payload)) };
    ws.emit("message", { data: blob });
    await Promise.resolve();
    expect(onMessage).toHaveBeenCalledWith(payload);
  });

  it("logs parse errors without calling onMessage", async () => {
    new NotificationSubscription({ onMessage, onClose, onError });
    const ws = MockWebSocket.instances[0];
    ws.emit("message", { data: "not-json" });
    await Promise.resolve();
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining("Failed to parse notification:"),
      expect.anything()
    );
    expect(onMessage).not.toHaveBeenCalled();
  });

  it("reconnects on unexpected close up to max attempts", () => {
    new NotificationSubscription({
      onMessage,
      onClose,
      onError,
      maxReconnectAttempts: 1,
      initialReconnectDelayMs: 100,
    });
    const ws1 = MockWebSocket.instances[0];
    ws1.emit("close", { code: 1006 });
    expect(onClose).toHaveBeenCalledWith({ code: 1006 });
    expect(consoleWarn).toHaveBeenCalledWith(
      `WebSocket closed (code=1006), reconnect #1 in 100ms…`
    );
    vi.advanceTimersByTime(100);
    expect(MockWebSocket.instances).toHaveLength(2);
  });

  it("limits reconnection attempts and logs error", () => {
    new NotificationSubscription({
      onMessage,
      maxReconnectAttempts: 0,
      initialReconnectDelayMs: 50,
    });
    const ws = MockWebSocket.instances[0];
    ws.emit("close", { code: 1011 });
    expect(consoleError).toHaveBeenCalledWith(
      "Max reconnect attempts reached; giving up."
    );
  });

  it("invokes error handler and closes socket on error event", () => {
    new NotificationSubscription({ onMessage, onClose, onError });
    const ws = MockWebSocket.instances[0];
    const err = new Error("fail");
    ws.emit("error", err);
    expect(onError).toHaveBeenCalledWith(err);
    expect(ws.readyState).toBe(3);
    expect(consoleError).toHaveBeenCalledWith("WebSocket error:", err);
  });

  it("uses default onClose and onError when not provided", () => {
    new NotificationSubscription({ onMessage });
    const ws = MockWebSocket.instances[0];
    ws.emit("error", new Error("e"));
    ws.emit("close", { code: 1000 });
    expect(onError).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("logs setup failure for thrown Error", () => {
    vi.unstubAllGlobals();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "WebSocket",
      class {
        constructor() {
          throw new Error("bad");
        }
      }
    );
    new NotificationSubscription({ onMessage });
    expect(spy).toHaveBeenCalledWith("WebSocket setup failure:", "bad");
    spy.mockRestore();
  });

  it("logs setup failure for thrown non-Error", () => {
    vi.unstubAllGlobals();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "WebSocket",
      class {
        constructor() {
          throw "oops";
        }
      }
    );
    new NotificationSubscription({ onMessage });
    expect(spy).toHaveBeenCalledWith("WebSocket setup failure:", "oops");
    spy.mockRestore();
  });

  it("should reset reconnectAttempts and reconnectDelay on open event", () => {
    new NotificationSubscription({
      onMessage,
      onClose,
      onError,
      maxReconnectAttempts: 2,
      initialReconnectDelayMs: 50,
    });
    const ws1 = MockWebSocket.instances[0];
    ws1.emit("close", { code: 1006 });
    expect(consoleWarn).toHaveBeenCalledWith(
      `WebSocket closed (code=1006), reconnect #1 in 50ms…`
    );
    vi.advanceTimersByTime(50);
    const ws2 = MockWebSocket.instances[1];
    ws2.emit("open", {});
    ws2.emit("close", { code: 1007 });
    expect(consoleWarn).toHaveBeenCalledWith(
      `WebSocket closed (code=1007), reconnect #1 in 50ms…`
    );
  });

  it("should not reconnect after manual close and close the socket", () => {
    const sub = new NotificationSubscription({ onMessage, onClose, onError });
    const ws = MockWebSocket.instances[0];
    sub.close();
    expect(ws.readyState).toBe(3);
    vi.advanceTimersByTime(1000);
    expect(MockWebSocket.instances).toHaveLength(1);
  });
});
