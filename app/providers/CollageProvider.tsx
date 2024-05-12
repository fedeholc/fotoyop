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
  createPreview: (() => {}) as (orientation: Orientation) => void,
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

  async function createPreview(orientation: Orientation) {
    console.log("collageImages", collageImages);
    const canvas = collageCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!collageImages || !canvas || !ctx) {
      return;
    }

    //para collage vertical
    if (orientation === Orientation.vertical) {
      const imgd1 = await imageB64ToImageDataWithOrientation(
        collageImages[0].src,
        200,
        collageImages[0].height,
        2
      );
      const imgd2 = await imageB64ToImageDataWithOrientation(
        collageImages[1].src,
        200,
        collageImages[1].height,
        2
      );

      let gap = (imgd1.height + imgd2.height) * 0.05;
      let maxWidth = Math.min(imgd1.width, imgd2.width);
      let maxHeight = imgd1.height + imgd2.height + gap;

      canvas.width = maxWidth;
      canvas.height = maxHeight;

      ctx?.createImageData(maxWidth, maxHeight);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, maxWidth, maxHeight);

      ctx.putImageData(imgd1 as ImageData, 0, 0);
      ctx.putImageData(imgd2 as ImageData, 0, imgd1.height + gap);
    }

    //para collage horizontal
    if (orientation === Orientation.horizontal) {
      const imgd1 = await imageB64ToImageDataWithOrientation(
        collageImages[0].src,
        collageImages[0].width,
        200,
        0
      );
      const imgd2 = await imageB64ToImageDataWithOrientation(
        collageImages[1].src,
        collageImages[1].width,
        200,
        0
      );

      let gap = (imgd1.width + imgd2.width) * 0.05;
      let maxHeight = Math.min(imgd1.height, imgd2.height);
      let maxWidth = imgd1.width + imgd2.width + gap;

      canvas.width = maxWidth;
      canvas.height = maxHeight;

      ctx?.createImageData(maxWidth, maxHeight);
      ctx!.fillStyle = "white";
      ctx!.fillRect(0, 0, maxWidth, maxHeight);

      ctx?.putImageData(imgd1 as ImageData, 0, 0);
      ctx?.putImageData(imgd2 as ImageData, imgd1.width + gap, 0);
    }
  }

  return (
    <CollageContext.Provider
      value={{
        previewOrientation,
        setPreviewOrientation,
        createPreview,
       }}
    >
      {children}
    </CollageContext.Provider>
  );
}
