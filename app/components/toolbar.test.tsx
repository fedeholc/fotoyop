import { axe, toHaveNoViolations } from "jest-axe";
import { render } from "@testing-library/react";
import { BottomToolbar } from "./toolbar";

expect.extend(toHaveNoViolations);

test("should have no accessibility violations", async () => {
  const { container } = render(<BottomToolbar />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
