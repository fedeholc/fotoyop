import React, { useContext, useId } from "react";
import { BorderContext } from "../../providers/BorderProvider";
import sideToolbar from "./sideToolbar.module.css";

export default function BorderColorInputs() {
  const {
    inputBorderColor,

    handleInputBorderColor,
  } = useContext(BorderContext);
  const id = useId();
  return (
    <div className={sideToolbar.borderColorRow}>
      <input
        id={`${id}inputBorderColor`}
        type="color"
        list="true"
        value={inputBorderColor}
        onChange={handleInputBorderColor}
      />

      <input
        id={`${id}inputBorderColorT`}
        type="Text"
        min="0"
        value={inputBorderColor}
        onChange={handleInputBorderColor}
      ></input>
    </div>
  );
}
