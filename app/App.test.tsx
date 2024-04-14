import { expect, test } from "vitest";
import { axe, toHaveNoViolations } from "jest-axe";

import { render, screen } from "@testing-library/react";
import App from "./App";

expect.extend(toHaveNoViolations);

test("App", () => {
  render(<App />);
  expect(screen.getByTestId("main")).toBeDefined();
  /*   expect(screen.getByRole("heading", { level: 1, name: "Home" })).toBeDefined(); */
});

test("should have no accessibility violations", async () => {
  const { container } = render(<App />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
