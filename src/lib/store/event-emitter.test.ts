import { describe, it, expect, vi, beforeEach } from "vitest";
import { EventEmitter } from "./event-emitter";

type TestEvents = {
  stringEvent: string;
  numberEvent: number;
  voidEvent: void;
};

describe("EventEmitter<Events>", () => {
  let emitter: EventEmitter<TestEvents>;
  let stringListener: ReturnType<typeof vi.fn>;
  let numberListener: ReturnType<typeof vi.fn>;
  let voidListener: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    emitter = new EventEmitter<TestEvents>();
    stringListener = vi.fn();
    numberListener = vi.fn();
    voidListener = vi.fn();
  });

  it("calls a registered listener when its event is emitted", () => {
    emitter.on("stringEvent", stringListener);
    emitter.emit("stringEvent", "hello");
    expect(stringListener).toHaveBeenCalledTimes(1);
    expect(stringListener).toHaveBeenCalledWith("hello");
  });

  it("passes the correct data type to each listener", () => {
    emitter.on("numberEvent", numberListener);
    emitter.emit("numberEvent", 42);
    expect(numberListener).toHaveBeenCalledWith(42);
  });

  it("emitting an event with no listeners does nothing", () => {
    // Should not throw or call anything
    expect(() => emitter.emit("stringEvent", "nope")).not.toThrow();
  });

  it("supports multiple listeners on the same event", () => {
    const anotherStringListener = vi.fn();
    emitter.on("stringEvent", stringListener);
    emitter.on("stringEvent", anotherStringListener);

    emitter.emit("stringEvent", "multi");
    expect(stringListener).toHaveBeenCalledWith("multi");
    expect(anotherStringListener).toHaveBeenCalledWith("multi");
  });

  it("does not call listeners for other events", () => {
    emitter.on("stringEvent", stringListener);
    emitter.emit("numberEvent", 123);
    expect(stringListener).not.toHaveBeenCalled();
  });

  it("removes a listener with off, so it no longer receives events", () => {
    emitter.on("stringEvent", stringListener);
    emitter.emit("stringEvent", "first");
    expect(stringListener).toHaveBeenCalledTimes(1);

    emitter.off("stringEvent", stringListener);
    emitter.emit("stringEvent", "second");
    expect(stringListener).toHaveBeenCalledTimes(1); // still only the first call
  });

  it("off only removes the specified listener, not others", () => {
    const second = vi.fn();
    emitter.on("voidEvent", voidListener);
    emitter.on("voidEvent", second);

    emitter.off("voidEvent", voidListener);
    emitter.emit("voidEvent", undefined);

    expect(voidListener).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("can register the same listener multiple times and off only removes one occurrence", () => {
    emitter.on("numberEvent", numberListener);
    emitter.on("numberEvent", numberListener);

    emitter.emit("numberEvent", 7);
    expect(numberListener).toHaveBeenCalledTimes(2);

    emitter.off("numberEvent", numberListener);
    numberListener.mockClear();

    emitter.emit("numberEvent", 8);
    // one listener should remain
    expect(numberListener).toHaveBeenCalledTimes(1);
  });

  it("off() on an event with no listeners does nothing (no throw)", () => {
    // Attempt to remove before any .on()
    expect(() => emitter.off("stringEvent", stringListener)).not.toThrow();

    // Register on a different event to ensure it hasn't been affected
    emitter.on("numberEvent", numberListener);
    emitter.emit("numberEvent", 123);
    expect(numberListener).toHaveBeenCalledOnce();
    expect(numberListener).toHaveBeenCalledWith(123);
  });

  it("emit() on an event with no listeners does nothing (no throw)", () => {
    // No listener ever registered for stringEvent
    expect(() => emitter.emit("stringEvent", "nothing")).not.toThrow();

    // And ensure other events still work
    emitter.on("voidEvent", voidListener);
    emitter.emit("voidEvent", undefined);
    expect(voidListener).toHaveBeenCalledOnce();
  });
});
