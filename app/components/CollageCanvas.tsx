"use client";
import { ImageContext } from "../providers/ImageProvider";
import { useEffect, useContext, useRef, useState, useId } from "react";
import { createCollage, calcResizeToWindow } from "../imageProcessing";
import { Orientation } from "../types";
import { appConfig } from "../App";
import { getResizedGap } from "../imageProcessing";
import useWindowsSize from "./hooks/useWindowsSize";
import { CollageContext } from "../providers/CollageProvider";

export default function CollageCanvas() {
  const {
    collageImages,
    displays,
    mobileToolbarRef,
    collageCanvasRef,
    containerRef,
  } = useContext(ImageContext);
  const { gapPixels, inputGapColor, previewOrientation } =
    useContext(CollageContext);
  const windowDimensions = useWindowsSize(displays, mobileToolbarRef);

  useEffect(() => {
    if (!collageCanvasRef.current) {
      return;
    }
    collageCanvasRef.current.getContext("2d", {
      willReadFrequently: true,
    });
  }, [collageCanvasRef]);

  useEffect(() => {
    if (collageImages && collageCanvasRef.current) {
      let resizedGap = getResizedGap(
        gapPixels,
        previewOrientation,
        collageImages,
        appConfig.collagePreviewSize
      );
      createCollage(
        collageCanvasRef.current,
        previewOrientation,
        collageImages,
        appConfig.collagePreviewSize,
        resizedGap,
        inputGapColor
      );
    }
  }, [collageImages]);

  useEffect(() => {
    if (collageCanvasRef.current && collageImages) {
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
  }, [windowDimensions, previewOrientation, gapPixels, collageImages]);

  return (
    <div>
      <div className="canvas__container" ref={containerRef}>
        <canvas id="collage__canvas" ref={collageCanvasRef}></canvas>
      </div>
    </div>
  );
}
