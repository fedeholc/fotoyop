import { useContext, useState, useEffect } from "react";
import { ImageContext } from "../../providers/ImageProvider";
import { CollageContext } from "../../providers/CollageProvider";
import { ProcessContext } from "../../providers/ProcessProvider";
import { Orientation } from "../../types";
import { createCollage, getCollageData } from "../../imageProcessing";
import sideToolbar from "./sideToolbar.module.css";
import ToolbarGroup from "./ToolbarGroup";
import { appConfig } from "../../App";
import CollageOrientationInputs from "./CollageOrientationInputs";

export default function TbCollageOptions() {
  const {
    previewOrientation,
    inputGapColor,
    setInputGapColor,
    gapPixels,
    setGapPixels,
    setPreviewOrientation,
    collageData,
    setCollageData,
    handleGapColor,
    handleGapPixels,
    handleOrientation,
  } = useContext(CollageContext);

  const { collageImages } = useContext(ImageContext);

  useEffect(() => {
    if (collageImages) {
      setCollageData(getCollageData(collageImages, 200));
    }
  }, [collageImages, previewOrientation]);

  return (
    <ToolbarGroup closedRendering={false} groupTitle="Collage Options">
      <div className={`${sideToolbar.toolbarRow}`}>
        <div className={sideToolbar.rowTitle}>Orientation</div>
        <div className={sideToolbar.collageOrientationRow}>
          <CollageOrientationInputs />
        </div>
      </div>
      <div className={`${sideToolbar.toolbarRow}`}>
        <div className={sideToolbar.rowTitle}>Gap Color</div>
        <div className={sideToolbar.borderColorRow}>
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
      </div>

      <div className={`${sideToolbar.toolbarRow}`}>
        <div className={sideToolbar.rowTitle}>Gap Size</div>

        <div className={sideToolbar.borderRangesRow}>
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
        </div>
      </div>
    </ToolbarGroup>
  );
}
