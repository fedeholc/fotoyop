import { describe } from "node:test";
import ButtonApply from "./buttonApply";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { test, expect } from "vitest";

describe("ButtonApply", () => {
  test("renders", () => {
    render(<ButtonApply onClick={() => {}} />);

    screen.debug();
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByTitle(/Apply/i)).toBeInTheDocument();
  });
});
