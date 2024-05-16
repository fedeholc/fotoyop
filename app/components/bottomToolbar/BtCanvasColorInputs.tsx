import React, { useContext, useState, useId } from "react";
import { BorderContext } from "@/app/providers/BorderProvider";

export default function BtCanvasColorInputs() {
  const { inputCanvasColor, handleInputCanvasColor } =
    useContext(BorderContext);
  const id = useId();
  return (
    <>
      <input
        id={`${id}inputCanvasColorT`}
        type="Text"
        min="0"
        value={inputCanvasColor}
        onChange={handleInputCanvasColor}
      />
      <input
        id={`${id}inputCanvasColor`}
        type="color"
        list="true"
        value={inputCanvasColor}
        onChange={handleInputCanvasColor}
      />
    </>
  );
}
