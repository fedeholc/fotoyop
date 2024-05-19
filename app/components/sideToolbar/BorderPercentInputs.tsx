import React, { useContext, useId, useState } from "react";
import { BorderContext } from "../../providers/BorderProvider";
import sideToolbar from "./sideToolbar.module.css";

export default function BorderPercentInputs({
  maxRange,
}: {
  maxRange: string;
}) {
  const id = useId();
  const { BorderPercent, setBorderPercent, handleBorderPercentRange } =
    useContext(BorderContext);
  const [inputBorderPercent, setInputBorderPercent] = useState(BorderPercent);
  return (
    <div className={sideToolbar.borderRangesRow}>
      <input
        type="number"
        id={`${id}inputBorderPercentN}`}
        min="0"
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
      <div>%</div>
      <input
        type="range"
        id={`${id}inputBorderPercent}`}
        min="0"
        max={maxRange}
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
    </div>
  );
}
