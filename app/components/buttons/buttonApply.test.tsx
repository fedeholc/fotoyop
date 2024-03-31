import { describe } from "node:test";
import ButtonApply from "./buttonApply";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { test, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

describe("ButtonApply", () => {
  test("renders", () => {
    render(<ButtonApply onClick={() => {}} />);
    //screen.debug();
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByTitle(/Apply/i)).toBeInTheDocument();
  });
  test("on click", async () => {
    const onChange = vi.fn();
    render(<ButtonApply onClick={onChange} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
