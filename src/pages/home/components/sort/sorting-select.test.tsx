import { screen, fireEvent } from "@testing-library/dom";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { SortingSelect, options } from "./select";

describe("SortingSelect", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders label and select with all options", () => {
    const onChange = vi.fn();
    const element = SortingSelect({ onChange });
    document.body.appendChild(element);

    const select = screen.getByLabelText("Sort by:") as HTMLSelectElement;
    expect(select).not.toBeNull();

    const renderedOptions = screen.getAllByRole("option") as HTMLOptionElement[];
    expect(renderedOptions.length).toBe(options.length + 1); // includes placeholder

    options.forEach(({ label, value }) => {
      const option = renderedOptions.find((opt) => opt.value === value);
      expect(option?.textContent).toBe(label);
    });
  });

  it("calls onChange handler when selection changes", async () => {
    const onChange = vi.fn();
    const element = SortingSelect({ onChange });
    document.body.appendChild(element);

    const select = screen.getByLabelText("Sort by:") as HTMLSelectElement;
    select.value = "version";
    fireEvent.change(select);

    expect(onChange).toHaveBeenCalledOnce();
  });

  it("has placeholder selected by default", () => {
    const element = SortingSelect({ onChange: vi.fn() });
    document.body.appendChild(element);

    const placeholder = screen.getByText("Select one…") as HTMLOptionElement;
    expect(placeholder.selected).toBe(true);
    expect(placeholder.disabled).toBe(true);
  });
});
