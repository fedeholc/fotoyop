import React, { useState, useId, useContext } from "react";
import toolbar from "../BottomToolbar.module.css";
import { BorderContext } from "@/app/providers/BorderProvider";

export default function BtBorderPixelInputs({
  maxRange,
}: {
  maxRange: string;
}) {
  const { BorderPixels, handleBorderPixelsRange } = useContext(BorderContext);
  const id = useId();
  const [inputBorderPixels, setInputBorderPixels] = useState(BorderPixels);
  return (
    <div className={toolbar.borderRanges}>
      <input
        type="range"
        id={`${id}inputBorderPixels}`}
        min="0"
        max={maxRange}
        value={inputBorderPixels}
        onChange={(e) => setInputBorderPixels(e.target.value)}
        onMouseUp={(e) =>
          handleBorderPixelsRange((e.target as HTMLInputElement).value)
        }
        onTouchEnd={(e) =>
          handleBorderPixelsRange((e.target as HTMLInputElement).value)
        }
      ></input>
      <input
        type="number"
        id={`${id}inputBorderPixelsN}`}
        min="0"
        value={inputBorderPixels}
        onKeyUp={(e) => {
          setInputBorderPixels((e.target as HTMLInputElement).value);
          handleBorderPixelsRange((e.target as HTMLInputElement).value);
        }}
        onChange={(e) => {
          setInputBorderPixels(e.target.value);
          handleBorderPixelsRange((e.target as HTMLInputElement).value);
        }}
      ></input>{" "}
      <div className="toolbar_row__units">px</div>{" "}
    </div>
  );
}
