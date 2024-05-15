"use client";
import { ImageContext } from "../providers/ImageProvider";
import { useContext, useEffect } from "react";
import useWindowsSize from "./hooks/useWindowsSize";
import { appConfig } from "../App";
import { ProcessContext } from "../providers/ProcessProvider";
import { calcResizeToWindow } from "../imageProcessing";

export default function MainCanvas() {
  const { originalImg, smallCanvasRef, displays, mobileToolbarRef } =
    useContext(ImageContext);
  const windowDimensions = useWindowsSize(displays, mobileToolbarRef);
  const { undoImageList } = useContext(ProcessContext);

  useEffect(() => {
    if (!smallCanvasRef.current) {
      return;
    }
    smallCanvasRef.current.getContext("2d", {
      willReadFrequently: true,
    });
  }, [smallCanvasRef]);

  useEffect(() => {
    if (smallCanvasRef.current && originalImg && undoImageList.length > 0) {
      const { newWidth, newHeight } = calcResizeToWindow(
        undoImageList[undoImageList.length - 1].width,
        undoImageList[undoImageList.length - 1].height,
        windowDimensions,
        appConfig
      );

      document
        .querySelector(".canvas__container")
        ?.setAttribute("style", `width: ${newWidth}px; height: ${newHeight}px`); //todo: usar una ref?
    }
  }, [windowDimensions, undoImageList]);

  return (
    <div className="canvas__container">
      <canvas id="canvas-small" ref={smallCanvasRef}></canvas>
    </div>
  );
}
