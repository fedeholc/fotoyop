import React, { useContext, useId, useState } from "react";
import { BorderContext } from "../../providers/BorderProvider";
import sideToolbar from "./sideToolbar.module.css";

export default function BorderPixelInputs({ maxRange }: { maxRange: string }) {
  const id = useId();
  const { BorderPixels, handleBorderPixelsRange, handleInputBorderColor } =
    useContext(BorderContext);
  const [inputBorderPixels, setInputBorderPixels] = useState(BorderPixels);
  return (
    <div className={sideToolbar.borderRangesRow}>
      <input
        type="number"
        id={`${id}inputBorderPixelsN}`}
        min="0"
        value={inputBorderPixels}
        onKeyUp={(e) => {
          setInputBorderPixels((e.target as HTMLInputElement).value);
          handleBorderPixelsRange((e.target as HTMLInputElement).value);
          /*           if (e.key === "Enter") {
          } */
          /* TODO así como quité eso de acá hay que hacerlo en los demás componentes */
        }}
        onChange={(e) => {
          setInputBorderPixels(e.target.value);
          /* TODO: y se agrega la siguiente linea también */
          handleBorderPixelsRange((e.target as HTMLInputElement).value);
        }}
      ></input>
      <div>px</div>
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
    </div>
  );
}
