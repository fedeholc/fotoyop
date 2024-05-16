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
import { appConfig } from "../App";
import { ImageProcess } from "../types";
import {
  applyProcessFunction,
  putImageDataOnCanvas,
  imgAddBorder,
  getResizedGap,
  imgAddCanvas,
  getCollageData,
  createCollage,
} from "../imageProcessing";
import { createRef, useRef } from "react";

export const CollageContext = createContext({
  previewOrientation: Orientation.vertical,
  setPreviewOrientation: (() => {}) as Dispatch<Orientation>,
  gapPixels: 0,
  setGapPixels: (() => {}) as Dispatch<number>,
  handleGapColor: (() => {}) as Dispatch<string>,
  handleGapPixels: (() => {}) as Dispatch<number>,

  inputGapColor: "#ffffff",
  setInputGapColor: (() => {}) as Dispatch<string>,
  collageData: {
    ivHeightSum: 0,
    ivWidth: 0,
    ihHeight: 0,
    ihWidthSum: 0,
    imagesHeightsSum: 0,
    imagesWidthsSum: 0,
  },
  setCollageData: (() => {}) as Dispatch<{
    ivHeightSum: number;
    ivWidth: number;
    ihHeight: number;
    ihWidthSum: number;
    imagesHeightsSum: number;
    imagesWidthsSum: number;
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

  const [collageData, setCollageData] = useState<{
    ivHeightSum: number;
    ivWidth: number;
    ihHeight: number;
    ihWidthSum: number;
    imagesHeightsSum: number;
    imagesWidthsSum: number;
  }>({
    ivHeightSum: 0,
    ivWidth: 0,
    ihHeight: 0,
    ihWidthSum: 0,
    imagesHeightsSum: 0,
    imagesWidthsSum: 0,
  });

  const [gapPixels, setGapPixels] = useState<number>(0);
  const [inputGapColor, setInputGapColor] = useState<string>("#ffffff");
  const { collageImages } = useContext(ImageContext);
  const { collageCanvasRef } = useContext(ImageContext);

  function handleGapPixels(gapPx: number) {
    if (!collageImages || !collageCanvasRef.current) {
      return;
    }
    setGapPixels(gapPx);
    createCollage(
      collageCanvasRef.current,
      previewOrientation,
      collageImages,
      appConfig.collagePreviewSize,
      getResizedGap(
        gapPx,
        previewOrientation,
        collageImages,
        appConfig.collagePreviewSize
      ),
      inputGapColor
    );
  }

  function handleGapColor(gapColor: string) {
    if (!collageImages || !collageCanvasRef.current) {
      return;
    }
    createCollage(
      collageCanvasRef.current,
      previewOrientation,
      collageImages,
      appConfig.collagePreviewSize,
      getResizedGap(
        gapPixels,
        previewOrientation,
        collageImages,
        appConfig.collagePreviewSize
      ),
      gapColor
    );
  }

  return (
    <CollageContext.Provider
      value={{
        previewOrientation,
        setPreviewOrientation,
        handleGapColor,
        handleGapPixels,
        gapPixels,
        setGapPixels,
        inputGapColor,
        setInputGapColor,
        collageData,
        setCollageData,
      }}
    >
      {children}
    </CollageContext.Provider>
  );
}
