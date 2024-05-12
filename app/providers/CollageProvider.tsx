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
  });

export default function CollageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [previewOrientation, setPreviewOrientation] = useState<Orientation>(
    Orientation.vertical
  );
  const {collageCanvasRef } = useContext(ImageContext);

  const { collageImages } = useContext(ImageContext);
 

  return (
    <CollageContext.Provider
      value={{
        previewOrientation,
        setPreviewOrientation,
        }}
    >
      {children}
    </CollageContext.Provider>
  );
}
