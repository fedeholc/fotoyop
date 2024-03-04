import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { ImageContext } from "./ImageProvider";
import { ProcessContext } from "./ProcessProvider";
import { ProcessOptionsType } from "./types";
import { mainCanvasConfig } from "./App";
import { ImageProcess } from "./types";
import {
  applyProcessFunction,
  drawImageDataOnCanvas,
  imgAddBorder,
  processImgToCanvas,
} from "./imageProcessing";

export const ToolbarContext = createContext({
  handleDownload: () => {},
  handleUndo: () => {},
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
  } = useContext(ImageContext);

  const {
    processList,
    setProcessList,
    undoImageList,
    setUndoImageList,
    currentProcess,
    setCurrentProcess,
  } = useContext(ProcessContext);

  
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
    <ToolbarContext.Provider value={{ handleDownload, handleUndo }}>
      {children}
    </ToolbarContext.Provider>
  );
}
