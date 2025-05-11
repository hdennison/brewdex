import { describe, it, expect } from "vitest";
import { fireEvent } from "@testing-library/dom";
import { setupCounter } from "./counter";

describe("setupCounter", () => {
  let button: HTMLButtonElement;

  beforeEach(() => {
    // Create a button element for each test
    button = document.createElement("button") as HTMLButtonElement;
    document.body.appendChild(button);
    setupCounter(button);
  });

  afterEach(() => {
    // Clean up after each test
    document.body.innerHTML = "";
  });

  it("initializes counter to 0", () => {
    expect(button.innerHTML).toBe("count is 0");
  });

  it("increments counter on click", () => {
    // Simulate a single click
    fireEvent.click(button);
    expect(button.innerHTML).toBe("count is 1");
  });

  it("increments counter multiple times", () => {
    // Simulate multiple clicks
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    expect(button.innerHTML).toBe("count is 3");
  });

  it("does not change counter when other events fire", () => {
    // Simulate a different event (e.g., mouseover)
    fireEvent.mouseOver(button);
    expect(button.innerHTML).toBe("count is 0");
  });
});
