import React, { useState, useId, useContext } from "react";
import toolbar from "../BottomToolbar.module.css";
import { BorderContext } from "@/app/providers/BorderProvider";

export default function BorderPercentInputs({
  maxRange,
}: {
  maxRange: string;
}) {
  const id = useId();
  const { BorderPercent, handleBorderPercentRange } = useContext(BorderContext);
  const [inputBorderPercent, setInputBorderPercent] = useState(BorderPercent);
  return (
    <div className={toolbar.borderRanges}>
      <input
        type="range"
        id={`${id}inputBorderPercent}`}
        max={maxRange}
        min="0"
        value={inputBorderPercent}
        onChange={(e) => {
          setInputBorderPercent(e.target.value);
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
        value={inputBorderPercent}
        onKeyUp={(e) => {
          setInputBorderPercent((e.target as HTMLInputElement).value);
          handleBorderPercentRange((e.target as HTMLInputElement).value);
        }}
        onChange={(e) => {
          setInputBorderPercent(e.target.value);
          handleBorderPercentRange((e.target as HTMLInputElement).value);
        }}
      ></input>
      <div className="toolbar_row__units">%</div>
    </div>
  );
}
