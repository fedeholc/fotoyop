import React, { useState, useId, useContext } from "react";
import toolbar from "../BottomToolbar.module.css";
import { BorderContext } from "@/app/providers/BorderProvider";
import { CollageContext } from "@/app/providers/CollageProvider";
import { Orientation } from "@/app/types";
import sideToolbar from "../sideToolbar/sideToolbar.module.css";
import CollageOrientationInputs from "../sideToolbar/CollageOrientationInputs";

export default function BtCollageOptions() {
  const {
    previewOrientation,
    setPreviewOrientation,
    handleOrientation,
    handleGapColor,
    handleGapPixels,
    setGapPixels,
    setInputGapColor,
    gapPixels,
    inputGapColor,
    collageData,
  } = useContext(CollageContext);

  return (
    <div className={toolbar.collageOptions__container}>
      <div className={`${toolbar.collageOptions__row} ${toolbar.canvasInputs}`}>
        <label>
          <strong>Collage: </strong>
        </label>
        <input
          type="radio"
          name="collage"
          value="vertical"
          id="vertical"
          onChange={() => {
            setPreviewOrientation(Orientation.vertical);
            handleOrientation(Orientation.vertical);
          }}
          checked={previewOrientation === Orientation.vertical}
        />
        <label htmlFor="vertical">Vertical</label>
        <input
          type="radio"
          name="collage"
          value="horizontal"
          id="horizontal"
          onChange={() => {
            setPreviewOrientation(Orientation.horizontal);
            handleOrientation(Orientation.horizontal);
          }}
          checked={previewOrientation === Orientation.horizontal}
        />
        <label htmlFor="horizontal">Horizontal</label>
      </div>
      <div className={`${toolbar.collageOptions__row} ${toolbar.canvasInputs}`}>
        <label htmlFor="inputGapColor">
          <strong>Gap Color</strong>
        </label>
        <input
          id="inputGapColor"
          type="color"
          list="true"
          value={inputGapColor}
          onChange={(e) => {
            setInputGapColor((e.target as HTMLInputElement).value);
            handleGapColor((e.target as HTMLInputElement).value);
          }}
        />

        <input
          id="inputGapColorT"
          type="Text"
          min="0"
          onChange={(e) => {
            setInputGapColor((e.target as HTMLInputElement).value);
            handleGapColor((e.target as HTMLInputElement).value);
          }}
          value={inputGapColor}
        ></input>
      </div>

      <div className={`${toolbar.collageOptions__row} ${toolbar.canvasInputs}`}>
        <label htmlFor="inputGapPixelsN">
          <strong>Gap Size</strong>
        </label>
        <input
          type="range"
          id="inputGapPixels"
          min="0"
          max={
            previewOrientation === Orientation.vertical
              ? collageData.imagesHeightsSum
              : collageData.imagesWidthsSum
          }
          value={gapPixels}
          onTouchEnd={(e) => {
            setGapPixels(parseInt((e.target as HTMLInputElement).value));
            handleGapPixels(parseInt((e.target as HTMLInputElement).value));
          }}
          onChange={(e) => setGapPixels(parseInt(e.target.value))}
          onMouseUp={(e) => {
            setGapPixels(parseInt((e.target as HTMLInputElement).value));
            handleGapPixels(parseInt((e.target as HTMLInputElement).value));
          }}
        ></input>
        <input
          type="number"
          id="inputGapPixelsN"
          min="0"
          value={gapPixels}
          onChange={(e) => {
            if (e.currentTarget.value === "") {
              setGapPixels(0);
              handleGapPixels(0);
            } else {
              setGapPixels(parseInt(e.currentTarget.value));
              handleGapPixels(parseInt(e.currentTarget.value));
            }
          }}
        ></input>
        <div>px</div>
      </div>
    </div>
  );
}
