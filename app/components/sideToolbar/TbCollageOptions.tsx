import React, { useContext, useEffect } from "react";
import { ImageContext } from "../../providers/ImageProvider";
import { CollageContext } from "../../providers/CollageProvider";
import { ProcessContext } from "../../providers/ProcessProvider";
import { Orientation } from "../../types";
import { createCollage, getCollageData } from "../../imageProcessing";
import useWindowsSize from "../hooks/useWindowsSize";
import sideToolbar from "./sideToolbar.module.css";
import ToolbarGroup from "./ToolbarGroup";
import {
  drawImageB64OnCanvas,
  imageB64ToImageData,
} from "../../imageProcessing";
import { calcResizeToWindow } from "../../imageProcessing";
import { mainCanvasConfig } from "../../App";

export default function TbCollageOptions() {
  const {
    setOriginalImg,
    smallCanvasRef,
    collageCanvasRef,
    displays,
    setDisplays,
    mobileToolbarRef,
  } = useContext(ImageContext);

  const windowDimensions = useWindowsSize(displays, mobileToolbarRef);
  const { setUndoImageList } = useContext(ProcessContext);

  function handleOrientation(orientation: Orientation) {
    if (!collageImages || !collageCanvasRef.current) {
      return;
    }

    let resizedGap = 0;
    if (orientation === Orientation.vertical) {
      resizedGap =
        (gapPixels * collageData.ivHeightSum) / collageData.imagesHeightsSum;
    } else {
      resizedGap =
        (gapPixels * collageData.ihWidthSum) / collageData.imagesWidthsSum;
    }

    createCollage(
      collageCanvasRef.current,
      orientation,
      collageImages,
      200, //TODO: ojo, se toman los datos de collagedata que fueron calculados en el render inicial del componente con un valor de maxsize 200, si se cambia aca hay que recalcular, o habria que guardar el 200 en el state y tomarlo de ahi
      resizedGap,
      inputGapColor
    );
  }

  function handleGapColor(gapColor: string) {
    if (collageImages && collageCanvasRef.current) {
      createCollage(
        collageCanvasRef.current,
        previewOrientation,
        collageImages,
        200,
        gapPixels,
        gapColor
      );
    }
  }

  function handleGapPixels(gapPx: number) {
    setGapPixels(gapPx);
    if (collageImages && collageCanvasRef.current) {
      let resizedGap = 0;

      if (previewOrientation === Orientation.vertical) {
        resizedGap =
          (gapPx * collageData.ivHeightSum) / collageData.imagesHeightsSum;
      } else {
        resizedGap =
          (gapPx * collageData.ihWidthSum) / collageData.imagesWidthsSum;
      }
      createCollage(
        collageCanvasRef.current,
        previewOrientation,
        collageImages,
        200, //TODO: ojo, se toman los datos de collagedata que fueron calculados en el render inicial del componente con un valor de maxsize 200, si se cambia aca hay que recalcular, o habria que guardar el 200 en el state y tomarlo de ahi
        resizedGap,
        inputGapColor
      );
      //la cuenta para el gap en modo vertical
      // tendria que ser GapPx * collageData.ivHeight / sumaHeightsImages
    }
  }

  function handlePreview() {
    if (collageImages && collageCanvasRef.current) {
      createCollage(
        collageCanvasRef.current,
        previewOrientation,
        collageImages,
        200,
        gapPixels,
        inputGapColor
      );
    }
  }

  async function handleProbar() {
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
      //pasa la imagen al smallCanvas para trabajar en modo edición
      loadB64Procedure(
        collageCanvasRef.current.toDataURL("image/jpeg", 1) as string
      );
    }
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
    previewOrientation,
    inputGapColor,
    setInputGapColor,
    gapPixels,
    setGapPixels,
    setPreviewOrientation,
    collageData,
    setCollageData,
  } = useContext(CollageContext);

  const { collageImages } = useContext(ImageContext);

  useEffect(() => {
    if (collageImages) {
      setCollageData(getCollageData(collageImages, 200));
    }
  }, [collageImages, previewOrientation]);

  return (
    <ToolbarGroup closedRendering={false} groupTitle="Collage Options">
      <div className={`${sideToolbar.toolbarRow}`}>
        <input
          type="radio"
          name="collage"
          value="vertical"
          onChange={() => {
            setPreviewOrientation(Orientation.vertical);
            handleOrientation(Orientation.vertical);
          }}
          checked={previewOrientation === Orientation.vertical}
        />
        <label>Vertical</label>
        <input
          type="radio"
          name="collage"
          value="horizontal"
          onChange={() => {
            setPreviewOrientation(Orientation.horizontal);
            handleOrientation(Orientation.horizontal);
          }}
          checked={previewOrientation === Orientation.horizontal}
        />
        <label>Horizontal</label>
        <div className={sideToolbar.borderColorRow}>
          <input
            id="inputGapColor"
            type="color"
            list="true"
            value={inputGapColor}
            onChange={(e) => {
              setInputGapColor((e.target as HTMLInputElement).value);
              handleGapColor((e.target as HTMLInputElement).value);
            }}
          />

          <input
            id="inputGapColorT"
            type="Text"
            min="0"
            onChange={(e) => {
              setInputGapColor((e.target as HTMLInputElement).value);
              handleGapColor((e.target as HTMLInputElement).value);
            }}
            value={inputGapColor}
          ></input>
        </div>

        <button onClick={handleProbar}>probar</button>
        <button onClick={handlePreview}>preview</button>
      </div>

      <div className={sideToolbar.borderRangesRow}>
        <input
          type="number"
          id="inputGapPixelsN"
          min="0"
          value={gapPixels}
          onChange={(e) => {
            if (e.currentTarget.value === "") {
              setGapPixels(0);
              handleGapPixels(0);
            } else {
              setGapPixels(parseInt(e.currentTarget.value));
              handleGapPixels(parseInt(e.currentTarget.value));
            }
          }}
        ></input>
        <div>px</div>
        <input
          type="range"
          id="inputGapPixels"
          min="0"
          max={
            previewOrientation === Orientation.vertical
              ? collageData.imagesHeightsSum
              : collageData.imagesWidthsSum
          }
          value={gapPixels}
          onTouchEnd={(e) => {
            setGapPixels(parseInt((e.target as HTMLInputElement).value));
            handleGapPixels(parseInt((e.target as HTMLInputElement).value));
          }}
          onChange={(e) => setGapPixels(parseInt(e.target.value))}
          onMouseUp={(e) => {
            setGapPixels(parseInt((e.target as HTMLInputElement).value));
            handleGapPixels(parseInt((e.target as HTMLInputElement).value));
          }}
        ></input>
      </div>
    </ToolbarGroup>
  );
}
