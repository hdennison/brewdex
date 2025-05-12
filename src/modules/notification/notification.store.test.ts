import { describe, it, expect } from "vitest";
import { NotificationStore } from "./notification.store";
import type { AppNotification } from "./types";

// Helper to create a dummy AppNotification for testing
function createMockNotification(): AppNotification {
  return {} as AppNotification;
}

describe("NotificationStore", () => {
  it("should return 0 when initialized with no notifications", () => {
    const store = new NotificationStore([]);
    expect(store.getAmount()).toBe(0);
    expect(store.hasMany).toBe(false);
  });

  it("should increment count up to the maximum display value", () => {
    const store = new NotificationStore([]);
    for (let i = 1; i <= 9; i++) {
      store.push(createMockNotification());
      expect(store.getAmount()).toBe(i);
      expect(store.hasMany).toBe(false);
    }
  });

  it('should display "9+" and set hasMany to true when count exceeds the maximum', () => {
    const store = new NotificationStore([]);
    // Push notifications beyond the max display cap
    for (let i = 1; i <= 11; i++) {
      store.push(createMockNotification());
    }
    expect(store.getAmount()).toBe("9+");
    expect(store.hasMany).toBe(true);
  });
});
