import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../app/App";

test("App", () => {
  render(<App />);
  expect(screen.getByTestId("main")).toBeDefined();
/*   expect(screen.getByRole("heading", { level: 1, name: "Home" })).toBeDefined(); */
});
