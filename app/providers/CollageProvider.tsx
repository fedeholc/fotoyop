import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { ImageContext } from "./ImageProvider";
import { ProcessContext } from "./ProcessProvider";
import { BorderOptionsType, CanvasOptions, Orientation } from "../types";
import {
  drawImageB64OnCanvas,
  imageB64ToImageData,
  imageB64ToImageDataWithOrientation,
} from "../imageProcessing";
import { mainCanvasConfig } from "../App";
import { ImageProcess } from "../types";
import {
  applyProcessFunction,
  putImageDataOnCanvas,
  imgAddBorder,
  imgAddCanvas,
} from "../imageProcessing";
import { createRef, useRef } from "react";

export const CollageContext = createContext({
  previewOrientation: Orientation.vertical,
  setPreviewOrientation: (() => {}) as Dispatch<Orientation>,
  gapPixels: 0,
  setGapPixels: (() => {}) as Dispatch<number>,
  gapMax: 0,
  setGapMax: (() => {}) as Dispatch<number>,

  gapPercent: 0,
  setGapPercent: (() => {}) as Dispatch<number>,
  inputGapColor: "#ffffff",
  setInputGapColor: (() => {}) as Dispatch<string>,
  collageData: {
    ivHeightSum: 0,
    ivWidth: 0,
    ihHeight: 0,
    ihWidthSum: 0,
  },
  setCollageData: (() => {}) as Dispatch<{
    ivHeightSum: number;
    ivWidth: number;
    ihHeight: number;
    ihWidthSum: number;
  }>,
});

export default function CollageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [previewOrientation, setPreviewOrientation] = useState<Orientation>(
    Orientation.vertical
  );
  const [gapMax, setGapMax] = useState<number>(0);

  const [collageData, setCollageData] = useState<{
    ivHeightSum: number;
    ivWidth: number;
    ihHeight: number;
    ihWidthSum: number;
  }>({
    ivHeightSum: 0,
    ivWidth: 0,
    ihHeight: 0,
    ihWidthSum: 0,
  });
  const [gapPixels, setGapPixels] = useState<number>(0);
  const [gapPercent, setGapPercent] = useState<number>(0);
  const [inputGapColor, setInputGapColor] = useState<string>("#ffffff");

  return (
    <CollageContext.Provider
      value={{
        previewOrientation,
        setPreviewOrientation,
        gapPixels,
        setGapPixels,
        gapPercent,
        setGapPercent,
        inputGapColor,
        setInputGapColor,
        gapMax,
        setGapMax,
        collageData,
        setCollageData,
      }}
    >
      {children}
    </CollageContext.Provider>
  );
}
