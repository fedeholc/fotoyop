import React, { useContext, useId } from "react";
import { BorderContext } from "../../providers/BorderProvider";
import sideToolbar from "./sideToolbar.module.css";

export default function CanvasColorInputs() {
  const {
    inputCanvasColor,

    handleInputCanvasColor,
  } = useContext(BorderContext);
  const id = useId();
  return (
    <div className={sideToolbar.borderColorRow}>
      <input
        id={`${id}inputCanvasColor`}
        type="color"
        list="true"
        value={inputCanvasColor}
        onChange={handleInputCanvasColor}
      />

      <input
        id={`${id}inputCanvasColorT`}
        type="Text"
        min="0"
        value={inputCanvasColor}
        onChange={handleInputCanvasColor}
      ></input>
    </div>
  );
}
