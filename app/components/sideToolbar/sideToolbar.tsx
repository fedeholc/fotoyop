import { useRef, useContext, useState, useId, useEffect } from "react";
import { ImageContext } from "../../providers/ImageProvider";
import { ProcessContext } from "../../providers/ProcessProvider";
import { ToolbarContext } from "../../providers/ToolbarProvider";
import { CollageContext } from "../../providers/CollageProvider";
import {
  imageDataToBase64,
  imageB64ToImageData,
  drawImageB64OnCanvas,
  getCollageGapPx,
  getCollageData,
} from "../../imageProcessing";
import { BorderContext } from "../../providers/BorderProvider";
import sideToolbar from "./sideToolbar.module.css";
import ButtonUndo from "../buttons/buttonUndo";
import ButtonNew from "../buttons/buttonNew";
import ButtonDownload from "../buttons/buttonDownload";
import ButtonApply from "../buttons/buttonApply";
import ButtonDiscard from "../buttons/buttonDiscard";
import ButtonGrayscale from "../buttons/buttonGrayscale";
import toolbar from "../BottomToolbar.module.css";
import { Orientation } from "../../types";
import useWindowsSize from "../hooks/useWindowsSize";
import { mainCanvasConfig } from "../../App";
import { calcResizeToWindow } from "../../imageProcessing";
import { createCollage } from "../../imageProcessing";
import collage from "../CollageCanvas.module.css";

export function SideToolbar() {
  const { originalImg } = useContext(ImageContext);

  return (
    <>
      <div className={sideToolbar.toolbar__top}>
        <ButtonUndo></ButtonUndo>
        <ButtonNew></ButtonNew>
        <ButtonDownload></ButtonDownload>
      </div>
      {originalImg && (
        <div className={sideToolbar.groupContainer}>
          <TbImageInfo></TbImageInfo>
          <TbBorders></TbBorders>
          <TbCanvas></TbCanvas>
          <TbGrayScale></TbGrayScale>
          <TbChangesHistory></TbChangesHistory>
        </div>
      )}
      <div className={sideToolbar.groupContainer}>
        <TbCollageImages></TbCollageImages>
        <TbCollageOptions></TbCollageOptions>
      </div>
      <br />
    </>
  );
}

function ToolbarGroup({
  className = "",
  groupTitle = "",
  closedRendering = true,
  children,
}: {
  className?: string;
  groupTitle?: string;
  closedRendering?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const classes = `${sideToolbar.bordersGroup} ${className}`;

  /* el closeRendering está principalmente por el componente Changes History que cada vez que se hacía un cambio volvía a renderizar toda la undolist y se hacía muy lento. De esta forma cuando el details está cerrado no hace ese renderizado. 
  FIXME: de todos modos sigue siendo lento cuando se lo quiere ver por lo que habria que buscar alguna forma de reducir ese tiempo */

  if (closedRendering === true) {
    return (
      <details>
        <summary onClick={handleToggle}>{groupTitle}</summary>

        <div className={classes}>{children}</div>
      </details>
    );
  }

  if (closedRendering === false) {
    return (
      <details>
        <summary onClick={handleToggle}>{groupTitle}</summary>

        {isOpen && <div className={classes}>{children}</div>}
      </details>
    );
  }
}

function TbCollageOptions() {
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
    let resizedGap = 0;

    if (orientation === Orientation.vertical) {
      resizedGap =
        (gapPixels * collageData.ivHeightSum) / collageData.imagesHeightsSum;
    } else {
      resizedGap =
        (gapPixels * collageData.ihWidthSum) / collageData.imagesWidthsSum;
    }
    if (collageImages && collageCanvasRef.current) {
      createCollage(
        collageCanvasRef.current,
        orientation,
        collageImages,
        200, //TODO: ojo, se toman los datos de collagedata que fueron calculados en el render inicial del componente con un valor de maxsize 200, si se cambia aca hay que recalcular, o habria que guardar el 200 en el state y tomarlo de ahi
        resizedGap,
        inputGapColor
      );
    }
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
    if (!collageImages) {
      return;
    }

    let data = getCollageData(collageImages, 200);
    if (data) {
      setCollageData(data);
      console.log("collage data", data);
      console.log("prev: ", previewOrientation);
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

function TbCollageImages() {
  const { collageImages } = useContext(ImageContext);
  return (
    <ToolbarGroup closedRendering={false} groupTitle="Collage Images">
      <div className={`${collage.imagesGroup} ${sideToolbar.toolbarRow}`}>
        <div className={collage.imagesList}>
          {collageImages &&
            collageImages.map((image) => {
              return (
                <span key={image.src}>
                  <img src={image.src}></img>
                </span>
              );
            })}
        </div>
      </div>
    </ToolbarGroup>
  );
}

function TbImageInfo() {
  const { originalFile, originalImg } = useContext(ImageContext);

  return (
    <ToolbarGroup groupTitle="Image Information">
      <div className={sideToolbar.toolbarRow}>
        <div className={sideToolbar.imageInfoGroup}>
          <div>
            <strong>{originalFile?.name}</strong>
          </div>
          {originalFile && (
            <div>
              {originalImg?.width} x {originalImg?.height} pixels
            </div>
          )}
          {originalFile && (
            <div>{Math.floor(originalFile.size / 1000).toString()} Kbytes</div>
          )}
          <img
            id="imagenPreview"
            style={{ maxWidth: "200px", maxHeight: "200px" }}
            src={originalImg?.src}
          ></img>
        </div>
      </div>
    </ToolbarGroup>
  );
}

function TbBorders() {
  const { handleApplyBorder, handleDiscardBorder } = useContext(BorderContext);
  const { originalImg } = useContext(ImageContext);

  return (
    <ToolbarGroup groupTitle="Borders">
      <div className={sideToolbar.toolbarRow}>
        <div className={sideToolbar.rowTitle}>Color</div>
        <BorderColorInputs />
      </div>
      <div className={sideToolbar.toolbarRow}>
        <div className={sideToolbar.rowTitle}>Border in percent</div>
        <BorderPercentInputs maxRange="100" />
      </div>
      <div className={sideToolbar.toolbarRow}>
        <div className={sideToolbar.rowTitle}>Border in pixels</div>
        {originalImg?.src && (
          <BorderPixelInputs maxRange={(originalImg.width / 2).toString()} />
        )}
      </div>
      <div className={sideToolbar.toolbarRow}>
        <div className={sideToolbar.rowButtons}>
          <ButtonApply onClick={handleApplyBorder}></ButtonApply>
          <ButtonDiscard onClick={handleDiscardBorder}></ButtonDiscard>
        </div>
      </div>
    </ToolbarGroup>
  );
}

function TbCanvas() {
  const { handleApplyCanvas, handleDiscardCanvas } = useContext(BorderContext);
  return (
    <ToolbarGroup groupTitle="Canvas">
      <div className={sideToolbar.toolbarRow}>
        <div className={sideToolbar.rowTitle}>Color</div>
        <BorderColorInputs />
      </div>

      <div className={sideToolbar.toolbarRow}>
        <div className={sideToolbar.rowTitle}>Aspect Ratio</div>
        <AspectRatioInputs />
      </div>
      <div className={sideToolbar.toolbarRow}>
        <div className={sideToolbar.rowButtons}>
          <ButtonApply onClick={handleApplyCanvas}></ButtonApply>
          <ButtonDiscard onClick={handleDiscardCanvas}></ButtonDiscard>
        </div>
      </div>
    </ToolbarGroup>
  );
}

function TbChangesHistory() {
  const { undoImageList } = useContext(ProcessContext);
  return (
    <ToolbarGroup closedRendering={false} groupTitle="Changes History">
      <div className={`${sideToolbar.changesGroup} ${sideToolbar.toolbarRow}`}>
        {undoImageList && (
          <div className={sideToolbar.changesList}>
            {undoImageList.toReversed().map((img, index) => {
              return (
                <span key={index}>
                  <img src={`${imageDataToBase64(img)}`.toString()} />
                </span>
              );
            })}
          </div>
        )}
      </div>
    </ToolbarGroup>
  );
}

function TbGrayScale() {
  const { handleToGrayscale } = useContext(ToolbarContext);

  return (
    <ToolbarGroup groupTitle="GrayScale">
      <div className={sideToolbar.toolbarRow}>
        <div className={sideToolbar.rowButtons}>
          <ButtonGrayscale onClick={handleToGrayscale}></ButtonGrayscale>
        </div>
      </div>
    </ToolbarGroup>
  );
}

function BorderColorInputs() {
  const {
    inputBorderColor,

    handleInputBorderColor,
  } = useContext(BorderContext);
  const id = useId();
  return (
    <div className={sideToolbar.borderColorRow}>
      <input
        id={`${id}inputBorderColor`}
        type="color"
        list="true"
        value={inputBorderColor}
        onChange={handleInputBorderColor}
      />

      <input
        id={`${id}inputBorderColorT`}
        type="Text"
        min="0"
        value={inputBorderColor}
        onChange={handleInputBorderColor}
      ></input>
    </div>
  );
}

function AspectRatioInputs() {
  const {
    inputAspectRatioX,
    inputAspectRatioY,
    handleInputAspectRatioX,
    handleInputAspectRatioY,

    selectAspectRatio,
    handleSelectAspectRatio,
  } = useContext(BorderContext);
  return (
    <>
      <div className={sideToolbar.canvasCustomInputs}>
        <label htmlFor="aspectRatioPresets">Presets</label>
        <select
          className={toolbar.aspectRatioInput}
          value={selectAspectRatio}
          id="aspectRatioPresets"
          name="aspectRatioPresets"
          onChange={handleSelectAspectRatio}
        >
          <option value="1:1">1:1</option>
          <option value="16:9">16:9</option>
          <option value="4:3">4:3</option>
          <option value="3:4">3:4</option>
          <option value="9:16">9:16</option>
          <option value="">Custom</option>
        </select>
      </div>
      <div className={sideToolbar.canvasCustomInputs}>
        <label>Custom</label>
        <input
          className={toolbar.aspectRatioInput}
          type="number"
          name="inputAspectRatioX"
          min="0"
          value={inputAspectRatioX}
          onKeyUp={handleInputAspectRatioX}
          onChange={handleInputAspectRatioX}
        ></input>
        <span>: </span>
        <input
          className={toolbar.aspectRatioInput}
          type="number"
          name="inputAspectRatioY"
          min="0"
          value={inputAspectRatioY}
          onKeyUp={handleInputAspectRatioY}
          onChange={handleInputAspectRatioY}
        ></input>
      </div>
    </>
  );
}

function BorderPixelInputs({ maxRange }: { maxRange: string }) {
  const id = useId();
  const { BorderPixels, handleBorderPixelsRange, handleInputBorderColor } =
    useContext(BorderContext);
  const [inputBorderPixels, setInputBorderPixels] = useState(BorderPixels);
  return (
    <div className={sideToolbar.borderRangesRow}>
      <input
        type="number"
        id={`${id}inputBorderPixelsN}`}
        min="0"
        value={inputBorderPixels}
        onKeyUp={(e) => {
          setInputBorderPixels((e.target as HTMLInputElement).value);
          if (e.key === "Enter") {
            handleBorderPixelsRange((e.target as HTMLInputElement).value);
          }
        }}
        onChange={(e) => {
          setInputBorderPixels(e.target.value);
        }}
      ></input>
      <div>px</div>
      <input
        type="range"
        id={`${id}inputBorderPixels}`}
        min="0"
        max={maxRange}
        value={inputBorderPixels}
        onChange={(e) => setInputBorderPixels(e.target.value)}
        onMouseUp={(e) =>
          handleBorderPixelsRange((e.target as HTMLInputElement).value)
        }
        onTouchEnd={(e) =>
          handleBorderPixelsRange((e.target as HTMLInputElement).value)
        }
      ></input>
    </div>
  );
}

function BorderPercentInputs({ maxRange }: { maxRange: string }) {
  const id = useId();
  const { BorderPercent, handleBorderPercentRange } = useContext(BorderContext);
  const [inputBorderPercent, setInputBorderPercent] = useState(BorderPercent);
  return (
    <div className={sideToolbar.borderRangesRow}>
      <input
        type="number"
        id={`${id}inputBorderPercentN}`}
        min="0"
        value={inputBorderPercent}
        onKeyUp={(e) => {
          setInputBorderPercent((e.target as HTMLInputElement).value);
          if (e.key === "Enter") {
            handleBorderPercentRange((e.target as HTMLInputElement).value);
          }
        }}
        onChange={(e) => {
          setInputBorderPercent(e.target.value);
        }}
      ></input>
      <div>%</div>
      <input
        type="range"
        id={`${id}inputBorderPercent}`}
        min="0"
        max={maxRange}
        value={inputBorderPercent}
        onChange={(e) => setInputBorderPercent(e.target.value)}
        onMouseUp={(e) =>
          handleBorderPercentRange((e.target as HTMLInputElement).value)
        }
        onTouchEnd={(e) =>
          handleBorderPercentRange((e.target as HTMLInputElement).value)
        }
      ></input>
    </div>
  );
}
