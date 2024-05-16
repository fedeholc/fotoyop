import React from "react";
import { useContext, useId } from "react";
import toolbar from "../BottomToolbar.module.css";
import { BorderContext } from "@/app/providers/BorderProvider";

export default function BtAspectRatioInputs() {
  const {
    inputAspectRatioX,
    handleInputAspectRatioX,
    inputAspectRatioY,
    handleInputAspectRatioY,
  } = useContext(BorderContext);
  const id = useId();

  return (
    <div className={toolbar.canvasInputs}>
      <label>Custom</label>
      <input
        className={toolbar.aspectRatioInput}
        type="number"
        id={`${id}inputAspectRatioX`}
        min="0"
        value={inputAspectRatioX}
        onKeyUp={handleInputAspectRatioX}
        onChange={handleInputAspectRatioX}
      ></input>
      <span>: </span>
      <input
        className={toolbar.aspectRatioInput}
        type="number"
        id={`${id}inputAspectRatioY`}
        min="0"
        value={inputAspectRatioY}
        onKeyUp={handleInputAspectRatioY}
        onChange={handleInputAspectRatioY}
      ></input>
    </div>
  );
}
