import { createContext, useContext } from "react";
import { ImageContext } from "./ImageProvider";
import { ProcessContext } from "./ProcessProvider";
import { BorderContext } from "./BorderProvider";

import { ImageProcess } from "../types";
import {
  applyProcessFunction,
  drawImageDataOnCanvas,
  imgToBW,
  processToNewImageData,
  processImgToCanvas,
} from "../imageProcessing";

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
    originalFile,
    originalImg,
    setOriginalFile,
    setOriginalImg,
    smallCanvasRef,
    imagenPreviewRef,
    setDisplays,
  } = useContext(ImageContext);

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
    if (!originalFile) {
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
      return { canvas: false, form: true, resizeTrigger: false };
    });

    setOriginalFile(null);
    setOriginalImg(null);
    /*  setOriginalImg(new window.Image() as HTMLImageElement); */

    setProcessList([]);
    setUndoImageList([]);
    setCurrentProcess(null);
    setBorderPixels("0");
    setBorderPercent("0");
    setInputBorderColor("#ffffff");
    imagenPreviewRef.current!.src = "";
  }

  /**
   * Procedimiento para generar la imagen procesada y enviarla como descarga.
   */
  function handleDownload() {
    if (!originalFile) {
      return;
    }
    let downloadDataURL = processImgToCanvas(
      originalImg!,
      processList
    ).toDataURL("image/jpeg", 1);
    const enlaceDescarga = document.createElement("a");
    enlaceDescarga.href = downloadDataURL || "";
    enlaceDescarga.download = "image.jpg";

    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);
  }

  /**
   * Handler del botón Undo. Deshace la última modificación.
   */
  function handleUndo() {
    if (!originalFile) {
      return;
    }
    if (undoImageList.length > 1) {
      const newUndoImageList = [...undoImageList];
      newUndoImageList.pop();
      setUndoImageList(newUndoImageList);
      drawImageDataOnCanvas(
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
