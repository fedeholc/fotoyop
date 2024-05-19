import React, { useContext, useId, useState } from "react";
import { BorderContext } from "../../providers/BorderProvider";
import sideToolbar from "./sideToolbar.module.css";

export default function BorderPixelInputs({ maxRange }: { maxRange: string }) {
  const id = useId();
  const { BorderPixels, handleBorderPixelsRange, setBorderPixels } =
    useContext(BorderContext);
  const [inputBorderPixels, setInputBorderPixels] = useState(BorderPixels);
  return (
    <div className={sideToolbar.borderRangesRow}>
      <input
        type="number"
        id={`${id}inputBorderPixelsN}`}
        min="0"
        value={BorderPixels}
        onKeyUp={(e) => {
          setBorderPixels((e.target as HTMLInputElement).value);
          handleBorderPixelsRange((e.target as HTMLInputElement).value);
        }}
        onChange={(e) => {
          setBorderPixels(e.target.value);
          handleBorderPixelsRange((e.target as HTMLInputElement).value);
        }}
      ></input>
      <div>px</div>
      <input
        type="range"
        id={`${id}inputBorderPixels}`}
        min="0"
        max={maxRange}
        value={BorderPixels}
        onChange={(e) => setBorderPixels(e.target.value)}
        onMouseUp={(e) =>
          handleBorderPixelsRange((e.target as HTMLInputElement).value)
        }
        onTouchEnd={(e) =>
          handleBorderPixelsRange((e.target as HTMLInputElement).value)
        }
      ></input>
    </div>
  );
}
