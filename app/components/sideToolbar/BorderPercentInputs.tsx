import React, { useContext, useId, useState } from "react";
import { BorderContext } from "../../providers/BorderProvider";
import sideToolbar from "./sideToolbar.module.css";

export default function BorderPercentInputs({ maxRange }: { maxRange: string }) {
  const id = useId();
  const { BorderPercent, handleBorderPercentRange } = useContext(BorderContext);
  const [inputBorderPercent, setInputBorderPercent] = useState(BorderPercent);
  return (
    <div className={sideToolbar.borderRangesRow}>
      <input
        type="number"
        id={`${id}inputBorderPercentN}`}
        min="0"
        value={inputBorderPercent}
        onKeyUp={(e) => {
          setInputBorderPercent((e.target as HTMLInputElement).value);
          if (e.key === "Enter") {
            handleBorderPercentRange((e.target as HTMLInputElement).value);
          }
        }}
        onChange={(e) => {
          setInputBorderPercent(e.target.value);
        }}
      ></input>
      <div>%</div>
      <input
        type="range"
        id={`${id}inputBorderPercent}`}
        min="0"
        max={maxRange}
        value={inputBorderPercent}
        onChange={(e) => setInputBorderPercent(e.target.value)}
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
