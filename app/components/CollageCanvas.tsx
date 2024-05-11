"use client";
import { ImageContext } from "../providers/ImageProvider";
import { ReactEventHandler, useContext, useRef, useState } from "react";
import {
  drawImageB64OnCanvas,
  imageB64ToImageData,
  imageB64ToImageDataWithOrientation,
} from "../imageProcessing";

import { ProcessContext } from "../providers/ProcessProvider";
import useWindowsSize from "./hooks/useWindowsSize";
import { mainCanvasConfig } from "../App";
import { calcResizeToWindow } from "../imageProcessing";

export default function CollageCanvas() {
  //VER si queremos una miniatura con las distintas opciones de collage a elegir, en ese caso habría que tener canvas pequeños en pantalla, y luego pasar la imagen grande según lo elegido a edición
  async function handleProbar() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (collageImages) {
      //para collage vertical
      let width = Math.min(collageImages[0].width, collageImages[1].width);
      const imgd = await imageB64ToImageData(
        collageImages[0].src,
        width,
        collageImages[0].height
      );
      const imgd2 = await imageB64ToImageData(
        collageImages[1].src,
        width,
        collageImages[1].height
      );

      let gap = (imgd.height + imgd2.height) * 0.05;
      let maxWidth = Math.min(imgd.width, imgd2.width);
      let maxHeight = imgd.height + imgd2.height + gap;

      canvas.width = maxWidth;
      canvas.height = maxHeight;

      ctx?.createImageData(maxWidth, maxHeight);
      ctx!.fillStyle = "white";
      ctx!.fillRect(0, 0, maxWidth, maxHeight);

      ctx?.putImageData(imgd as ImageData, 0, 0);
      ctx?.putImageData(imgd2 as ImageData, 0, imgd.height + gap);

      //pasa la imagen al smallCanvas
      loadB64Procedure(canvas.toDataURL("image/jpeg", 1) as string);
    }
  }

  async function createPreview(orientation: CollageOrientation) {
    const canvas = document.getElementById(
      "collage__canvas"
    ) as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!collageImages) {
      return;
    }
    //para collage vertical

    if (orientation === CollageOrientation.vertical) {
      let width = Math.min(collageImages[0].width, collageImages[1].width);
      const imgd = await imageB64ToImageData(
        collageImages[0].src,
        200,
        collageImages[0].height
      );
      const imgd2 = await imageB64ToImageData(
        collageImages[1].src,
        200,
        collageImages[1].height
      );

      let gap = (imgd.height + imgd2.height) * 0.05;
      let maxWidth = Math.min(imgd.width, imgd2.width);
      let maxHeight = imgd.height + imgd2.height + gap;

      canvas.width = maxWidth;
      canvas.height = maxHeight;

      ctx?.createImageData(maxWidth, maxHeight);
      ctx!.fillStyle = "white";
      ctx!.fillRect(0, 0, maxWidth, maxHeight);

      ctx?.putImageData(imgd as ImageData, 0, 0);
      ctx?.putImageData(imgd2 as ImageData, 0, imgd.height + gap);
    }
    if (orientation === CollageOrientation.horizontal) {
      let height = Math.min(collageImages[0].height, collageImages[1].height);
      const imgd = await imageB64ToImageDataWithOrientation(
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

      let gap = (imgd.width + imgd2.width) * 0.05;
      let maxHeight = Math.min(imgd.height, imgd2.height);
      let maxWidth = imgd.width + imgd2.width + gap;

      console.log("maxWidth", maxWidth);
      console.log("maxHeight", maxHeight);

      canvas.width = maxWidth;
      canvas.height = maxHeight;

      ctx?.createImageData(maxWidth, maxHeight);
      ctx!.fillStyle = "white";
      ctx!.fillRect(0, 0, maxWidth, maxHeight);

      ctx?.putImageData(imgd as ImageData, 0, 0);
      ctx?.putImageData(imgd2 as ImageData, imgd.width + gap, 0);
    }
    // loadB64Procedure(canvas.toDataURL("image/jpeg", 1) as string);
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
        mainCanvasConfig
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
        mainCanvasConfig.maxWidth,
        mainCanvasConfig.maxHeight
      )) as ImageData,
    ]);
  }

  const {
    setOriginalImg,
    smallCanvasRef,
    displays,
    setDisplays,
    mobileToolbarRef,
    collageImages,
  } = useContext(ImageContext);

  const windowDimensions = useWindowsSize(displays, mobileToolbarRef);

  const { setUndoImageList } = useContext(ProcessContext);

  const CollageCanvasRef = useRef<HTMLCanvasElement>(null);

  enum CollageOrientation {
    vertical,
    horizontal,
  }
  const [previewOrientation, setPreviewOrientation] =
    useState<CollageOrientation>(CollageOrientation.vertical);

  function handleOrientation(orientation: CollageOrientation) {
    createPreview(orientation);
  }
  function handlePreview() {
    createPreview(previewOrientation);
  }

  return (
    <div>
      <p>hola</p>
      {collageImages &&
        collageImages.map((image) => {
          return (
            <img
              id="imagen1"
              style={{ maxWidth: "200px", maxHeight: "200px" }}
              src={image.src}
            ></img>
          );
        })}

      <input
        type="radio"
        name="collage"
        value="vertical"
        onChange={() => {
          setPreviewOrientation(CollageOrientation.vertical);
          handleOrientation(CollageOrientation.vertical);
        }}
        checked={previewOrientation === CollageOrientation.vertical}
      />
      <label>Vertical</label>
      <input
        type="radio"
        name="collage"
        value="horizontal"
        onChange={() => {
          setPreviewOrientation(CollageOrientation.horizontal);
          handleOrientation(CollageOrientation.horizontal);
        }}
        checked={previewOrientation === CollageOrientation.horizontal}
      />
      <label>Horizontal</label>

      <button onClick={handleProbar}>probar</button>
      <button onClick={handlePreview}>preview</button>
      <div className="collage__container">
        <canvas
          width={200}
          height={200}
          id="collage__canvas"
          ref={CollageCanvasRef}
        ></canvas>
      </div>
    </div>
  );
}
