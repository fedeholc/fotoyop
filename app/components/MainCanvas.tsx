"use client";
import { ImageContext } from "../providers/ImageProvider";
import { useContext, useEffect, useRef } from "react";
import useWindowsSize from "./hooks/useWindowsSize";
import { appConfig } from "../App";
import { ProcessContext } from "../providers/ProcessProvider";
import { calcResizeToWindow } from "../imageProcessing";

export default function MainCanvas() {
  const {
    originalImg,
    smallCanvasRef,
    displays,
    mobileToolbarRef,
    bottomToolbarDisplay,
  } = useContext(ImageContext);
  const windowDimensions = useWindowsSize(displays, mobileToolbarRef);
  const { undoImageList } = useContext(ProcessContext);
  const containerRef = useRef<HTMLDivElement>(null);

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
        appConfig,
        mobileToolbarRef
      );

      if (containerRef.current) {
        containerRef.current.style.width = `${newWidth}px`;
        containerRef.current.style.height = `${newHeight}px`;
      }
    }
  }, [windowDimensions, undoImageList]);

  return (
    <div className="canvas__container" ref={containerRef}>
      <canvas id="canvas-small" ref={smallCanvasRef}></canvas>
    </div>
  );
}
