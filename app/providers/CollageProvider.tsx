import { createContext, useState, Dispatch, useContext } from "react";
import { ImageContext } from "./ImageProvider";
import { ProcessContext } from "./ProcessProvider";
import { Orientation } from "../types";
import {
  drawImageB64OnCanvas,
  imageB64ToImageData,
  calcResizeToWindow,
} from "../imageProcessing";
import { appConfig } from "../App";
import useWindowsSize from "../components/hooks/useWindowsSize";

import { getResizedGap, createCollage } from "../imageProcessing";

export const CollageContext = createContext({
  previewOrientation: Orientation.vertical,
  handleDownloadFromCollage: () => {},
  handleSaveToEdit: () => {},
  setPreviewOrientation: (() => {}) as Dispatch<Orientation>,
  gapPixels: 0,
  setGapPixels: (() => {}) as Dispatch<number>,
  handleGapColor: (() => {}) as Dispatch<string>,
  handleGapPixels: (() => {}) as Dispatch<number>,
  handleOrientation: (() => {}) as Dispatch<Orientation>,

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
  const {
    collageImages,
    containerRef,
    setCollageImages,

    setDisplays,
    setOriginalImg,
    displays,
    mobileToolbarRef,
  } = useContext(ImageContext);
  const { setUndoImageList } = useContext(ProcessContext);
  const windowDimensions = useWindowsSize(displays, mobileToolbarRef);

  const { collageCanvasRef, smallCanvasRef } = useContext(ImageContext);

  async function handleDownloadFromCollage() {
    if (collageImages && collageCanvasRef.current) {
      //  hay que ocultar el canvas para que no se vea que se está creando el collage en grande
      collageCanvasRef.current.style.display = "none";

      await createCollage(
        collageCanvasRef.current,
        previewOrientation,
        collageImages,
        0,
        gapPixels,
        inputGapColor
      );

      let downloadDataURL = collageCanvasRef.current.toDataURL(
        "image/jpeg",
        1
      ) as string;
      const enlaceDescarga = document.createElement("a");
      enlaceDescarga.href = downloadDataURL || "";
      enlaceDescarga.download = "image.jpg";

      document.body.appendChild(enlaceDescarga);
      enlaceDescarga.click();
      document.body.removeChild(enlaceDescarga);
      collageCanvasRef.current.style.display = "block";
    }
  }
  async function handleSaveToEdit() {
    if (collageImages && collageCanvasRef.current) {
      //  hay que ocultar el canvas para que no se vea que se está creando el collage en grande
      collageCanvasRef.current.style.display = "none";

      await createCollage(
        collageCanvasRef.current,
        previewOrientation,
        collageImages,
        0,
        gapPixels,
        inputGapColor
      );

      setCollageImages(null);

      //pasa la imagen al smallCanvas para trabajar en modo edición
      await loadB64Procedure(
        collageCanvasRef.current.toDataURL("image/jpeg", 1) as string
      );
    }

    async function loadB64Procedure(originalImageB64: string) {
      setDisplays((prev) => {
        return {
          canvas: true,
          form: false,
          resizeTrigger: !prev.resizeTrigger,
          collage: false,
        };
      });

      const newImageElement = new window.Image();
      newImageElement.src = originalImageB64;
      newImageElement.onload = () => {
        const { newWidth, newHeight } = calcResizeToWindow(
          newImageElement.width,
          newImageElement.height,
          windowDimensions,
          appConfig
        );

        drawImageB64OnCanvas(
          originalImageB64,
          smallCanvasRef.current as HTMLCanvasElement,
          newWidth,
          newHeight
        );
      };
      setOriginalImg(newImageElement);
      setUndoImageList([
        (await imageB64ToImageData(
          originalImageB64,
          appConfig.canvasMaxWidth,
          appConfig.canvasMaxHeight
        )) as ImageData,
      ]);
    }
  }

  async function handleGapPixels(gapPx: number) {
    if (!collageImages || !collageCanvasRef.current) {
      return;
    }
    setGapPixels(gapPx);
    await createCollage(
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

    resizeToWindow();
  }

  function resizeToWindow() {
    if (collageCanvasRef.current) {
      const { newWidth, newHeight } = calcResizeToWindow(
        collageCanvasRef.current.width,
        collageCanvasRef.current.height,
        windowDimensions,
        appConfig
      );

      if (containerRef.current) {
        containerRef.current.style.width = `${newWidth}px`;
        containerRef.current.style.height = `${newHeight}px`;
      }
    }
  }
  async function handleOrientation(orientation: Orientation) {
    if (!collageImages || !collageCanvasRef.current) {
      return;
    }
    await createCollage(
      collageCanvasRef.current,
      orientation,
      collageImages,
      appConfig.collagePreviewSize,
      getResizedGap(
        gapPixels,
        orientation,
        collageImages,
        appConfig.collagePreviewSize
      ),
      inputGapColor
    );
    resizeToWindow();
  }

  async function handleGapColor(gapColor: string) {
    if (!collageImages || !collageCanvasRef.current) {
      return;
    }
    await createCollage(
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
        handleSaveToEdit,
        setPreviewOrientation,
        handleGapColor,
        handleGapPixels,
        handleOrientation,
        gapPixels,
        setGapPixels,
        inputGapColor,
        setInputGapColor,
        collageData,
        setCollageData,
        handleDownloadFromCollage,
      }}
    >
      {children}
    </CollageContext.Provider>
  );
}
