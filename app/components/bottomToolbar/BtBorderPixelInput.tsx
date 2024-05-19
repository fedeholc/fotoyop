import React, { useState, useId, useContext } from "react";
import toolbar from "../BottomToolbar.module.css";
import { BorderContext } from "@/app/providers/BorderProvider";

export default function BtBorderPixelInputs({
  maxRange,
}: {
  maxRange: string;
}) {
  const { BorderPixels, handleBorderPixelsRange, setBorderPixels } =
    useContext(BorderContext);
  const id = useId();
  return (
    <div className={toolbar.borderRanges}>
      <label htmlFor={`${id}inputBorderPixels}`}>
        <strong>Size (px)</strong>
      </label>
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
      ></input>{" "}
      <div className="toolbar_row__units">px</div>{" "}
    </div>
  );
}
