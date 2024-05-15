import sideToolbar from "./sideToolbar.module.css";
import { BorderContext } from "@/app/providers/BorderProvider";
import { useContext } from "react";
import toolbar from "../BottomToolbar.module.css";

export default function AspectRatioInputs() {
  const {
    inputAspectRatioX,
    inputAspectRatioY,
    handleInputAspectRatioX,
    handleInputAspectRatioY,

    selectAspectRatio,
    handleSelectAspectRatio,
  } = useContext(BorderContext);
  return (
    <>
      <div className={sideToolbar.canvasCustomInputs}>
        <label htmlFor="aspectRatioPresets">Presets</label>
        <select
          className={toolbar.aspectRatioInput}
          value={selectAspectRatio}
          id="aspectRatioPresets"
          name="aspectRatioPresets"
          onChange={handleSelectAspectRatio}
        >
          <option value="1:1">1:1</option>
          <option value="16:9">16:9</option>
          <option value="4:3">4:3</option>
          <option value="3:4">3:4</option>
          <option value="9:16">9:16</option>
          <option value="">Custom</option>
        </select>
      </div>
      <div className={sideToolbar.canvasCustomInputs}>
        <label>Custom</label>
        <input
          className={toolbar.aspectRatioInput}
          type="number"
          name="inputAspectRatioX"
          min="0"
          value={inputAspectRatioX}
          onKeyUp={handleInputAspectRatioX}
          onChange={handleInputAspectRatioX}
        ></input>
        <span>: </span>
        <input
          className={toolbar.aspectRatioInput}
          type="number"
          name="inputAspectRatioY"
          min="0"
          value={inputAspectRatioY}
          onKeyUp={handleInputAspectRatioY}
          onChange={handleInputAspectRatioY}
        ></input>
      </div>
    </>
  );
}
