import React from "react";
import { useContext, useId } from "react";
import toolbar from "../BottomToolbar.module.css";
import { BorderContext } from "@/app/providers/BorderProvider";

export default function BtAspectRatioPresets() {
  const id = useId();
  const { selectAspectRatio, handleSelectAspectRatio } =
    useContext(BorderContext);

  return (
    <div className={toolbar.canvasInputs}>
      <label htmlFor={`${id}inputAspectRatioPresets`}>
        Aspect
        <br />
        Ratio
      </label>
      <select
        className={toolbar.aspectRatioInput}
        value={selectAspectRatio}
        id={`${id}inputAspectRatioPresets`}
        onChange={handleSelectAspectRatio}
      >
        <option value="1:1">1:1</option>
        <option value="16:9">16:9</option>
        <option value="5:4">5:4</option>
        <option value="4:3">4:3</option>
        <option value="3:2">3:2</option>
        <option value="2:3">2:3</option>
        <option value="3:4">3:4</option>
        <option value="4:5">4:5</option>
        <option value="9:16">9:16</option>
        <option value="">Custom</option>
      </select>
    </div>
  );
}
