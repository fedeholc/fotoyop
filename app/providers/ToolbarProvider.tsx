import { createContext, useContext } from "react";
import { ImageContext } from "./ImageProvider";
import { ProcessContext } from "./ProcessProvider";
import { BorderContext } from "./BorderProvider";
import { CollageContext } from "./CollageProvider";

import { ImageProcess } from "../types";
import {
  applyProcessFunction,
  putImageDataOnCanvas,
  imgToBW,
  processToNewImageData,
  processImgToCanvas,
} from "../imageProcessing";
import CollageCanvas from "../components/CollageCanvas";

export const ToolbarContext = createContext({
  handleDownload: () => {},
  handleUndo: () => {},
  handleNewImage: () => {},
  handleToGrayscale: () => {},
});

export default function ToolbarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    originalImg,
    setOriginalFile,
    setOriginalImg,
    smallCanvasRef,
    setDisplays,
    setCollageFiles,
    setCollageImages,
    getDownloadFileName,
  } = useContext(ImageContext);

  const { setGapPixels, setInputGapColor } = useContext(CollageContext);

  const {
    processList,
    setProcessList,
    undoImageList,
    setUndoImageList,
    currentProcess,
    setCurrentProcess,
  } = useContext(ProcessContext);

  const {
    setInputBorderColor,
    setBorderPixels,
    setBorderPercent,
    handleApplyBorder,
  } = useContext(BorderContext);

  /**
   * Handler del click en convertir a blanco y negro.
   */
  function handleToGrayscale() {
    if (!originalImg) {
      return;
    }

    if (currentProcess === ImageProcess.Border) {
      handleApplyBorder();
      setCurrentProcess(null);
    }

    applyProcessFunction(smallCanvasRef.current, imgToBW);
    setProcessList([...processList, imgToBW]);

    let newImageData = processToNewImageData(smallCanvasRef.current, imgToBW);

    let newUndoImageList = [...undoImageList, newImageData];
    setUndoImageList(newUndoImageList);
  }

  /**
   * Handler del botón New Image. Vuelve al estado inicial.
   */
  function handleNewImage() {
    setDisplays((prev) => {
      return {
        canvas: false,
        form: true,
        resizeTrigger: false,
        collage: false,
      };
    });

    setOriginalFile(null);
    setOriginalImg(null);

    setProcessList([]);
    setUndoImageList([]);
    setCurrentProcess(null);
    setBorderPixels("0");
    setBorderPercent("0");
    setInputBorderColor("#ffffff");

    setGapPixels(0);
    setInputGapColor("#ffffff");
    setCollageFiles([]);
    setCollageImages([]);
  }

  /**
   * Procedimiento para generar la imagen procesada y enviarla como descarga.
   */
  function handleDownload() {
    if (!originalImg) {
      return;
    }
    let downloadDataURL = processImgToCanvas(
      originalImg!,
      processList
    ).toDataURL("image/jpeg", 1);
    const enlaceDescarga = document.createElement("a");
    enlaceDescarga.href = downloadDataURL || "";
    enlaceDescarga.download = getDownloadFileName();

    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);
  }

  /**
   * Handler del botón Undo. Deshace la última modificación.
   */
  function handleUndo() {
    if (!originalImg) {
      return;
    }
    if (undoImageList.length > 1) {
      const newUndoImageList = [...undoImageList];
      newUndoImageList.pop();
      setUndoImageList(newUndoImageList);
      putImageDataOnCanvas(
        newUndoImageList[newUndoImageList.length - 1],
        smallCanvasRef.current!
      );

      const newProcessList = [...processList];
      newProcessList.pop();
      setProcessList(newProcessList);
    }
  }

  return (
    <ToolbarContext.Provider
      value={{ handleDownload, handleUndo, handleNewImage, handleToGrayscale }}
    >
      {children}
    </ToolbarContext.Provider>
  );
}
