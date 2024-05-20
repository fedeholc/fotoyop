import React, { useState, useId, useContext } from "react";
import toolbar from "../BottomToolbar.module.css";
import { BorderContext } from "@/app/providers/BorderProvider";

export default function BorderPercentInputs({
  maxRange,
}: {
  maxRange: string;
}) {
  const id = useId();
  const { BorderPercent, handleBorderPercentRange, setBorderPercent } =
    useContext(BorderContext);
  const [inputBorderPercent, setInputBorderPercent] = useState(BorderPercent);
  return (
    <div className={toolbar.borderRanges}>
      <label htmlFor={`${id}inputBorderPercent}`}>
        <strong>Size (%)</strong>
      </label>
      <input
        type="range"
        id={`${id}inputBorderPercent}`}
        max="100"
        min="0"
        value={BorderPercent}
        onChange={(e) => {
          setBorderPercent(e.target.value);
        }}
        onMouseUp={(e) =>
          handleBorderPercentRange((e.target as HTMLInputElement).value)
        }
        onTouchEnd={(e) =>
          handleBorderPercentRange((e.target as HTMLInputElement).value)
        }
      ></input>
      <input
        type="number"
        id={`${id}inputBorderPercentN}`}
        min="0"
        max="100"
        value={BorderPercent}
        onKeyUp={(e) => {
          setBorderPercent((e.target as HTMLInputElement).value);
          handleBorderPercentRange((e.target as HTMLInputElement).value);
        }}
        onChange={(e) => {
          setBorderPercent(e.target.value);

          handleBorderPercentRange((e.target as HTMLInputElement).value);
        }}
      ></input>
      <div className="toolbar_row__units">%</div>
    </div>
  );
}
