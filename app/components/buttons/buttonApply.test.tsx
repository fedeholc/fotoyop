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
    await userEvent.click(screen.getByRole("button", { name: /apply/i }));
    //ojo, acá apply no se busca en la propiedad name del boton sino en lo que se llama el nombre accesible, el texto puede estar en el aria-label, title, etc.
    //en este caso que hay un solo boton en el documento, se podría buscar por role y no hace falta especificar el nombre
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
