import { useState, useRef, useContext } from "react";
import toolbar from "./toolbar.module.css";
import { ArrowLeft } from "lucide-react";
import { ImageContext } from "../ImageProvider";
import { ProcessContext } from "../ProcessProvider";
import { ToolbarContext } from "../ToolbarProvider";
import { ProcessOptionsType } from "../types";
import { mainCanvasConfig } from "../App";
import { ImageProcess } from "../types";
import {
  applyProcessFunction,
  drawImageDataOnCanvas,
  imgAddBorder,
  imageDataToBase64,
  processImgToCanvas,
  processToNewImageData,
  imgToBW,
} from "../imageProcessing";
import { BorderContext } from "../BorderProvider";

export function ToolbarRow({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const classes = `${toolbar.row} ${className}`;
  return <div className={classes}>{children}</div>;
}

export function BottomToolbar() {
  const [toolbarDisplay, setToolbarDisplay] = useState({
    mainMenu: true,
    transform: false,
    border: false,
    borderPx: false,
  });

  const inputBorderPixelsRef = useRef<HTMLInputElement | null>(null);

  const {
    inputBorderColor,
    setInputBorderColor,
    inputBorderPixels,
    setInputBorderPixels,
    inputBorderPercent,
    setInputBorderPercent,
    handleInputBorderColor,
    handleInputBorderPixelsRange,
    handleBorderChange,
    handleInputBorderPixelsRangeMouseUp,
    handleInputBorderPixelsText,
  } = useContext(BorderContext);

  const { originalFile, originalImg, setOriginalFile, setOriginalImg } =
    useContext(ImageContext);

  const {
    processList,
    setProcessList,
    undoImageList,
    setUndoImageList,
    currentProcess,
    setCurrentProcess,
  } = useContext(ProcessContext);

  const { handleDownload } = useContext(ToolbarContext);

  return (
    <>
      {toolbarDisplay.borderPx && (
        <ToolbarRow className={toolbar.border__row}>
          <button
            onClick={() =>
              setToolbarDisplay({
                mainMenu: true,
                border: true,
                transform: false,
                borderPx: false,
              })
            }
            className={toolbar.buttonWithIcon}
          >
            <ArrowLeft size={20} color="rgb(0, 183, 255)"></ArrowLeft>
          </button>

          <div className={toolbar.borderRanges}>
            <input
              type="range"
              id="inputBorderPixels"
              name="inputBorderPixels"
              min="0"
              ref={inputBorderPixelsRef}
              value={inputBorderPixels}
              onChange={handleInputBorderPixelsRange}
              onMouseUp={handleInputBorderPixelsRangeMouseUp}
              onTouchEnd={handleInputBorderPixelsRangeMouseUp}
            ></input>
            <input
              type="number"
              id="inputBorderPixelsN"
              name="inputBorderPixelsN"
              min="0"
              value={inputBorderPixels}
              onKeyUp={handleInputBorderPixelsText}
              onChange={handleInputBorderPixelsText}
            ></input>
            <div className="toolbar_row__units">px</div>
          </div>
        </ToolbarRow>
      )}

      {toolbarDisplay.border && (
        <ToolbarRow className={toolbar.border__row}>
          <button
            onClick={() =>
              setToolbarDisplay({
                mainMenu: true,
                border: false,
                transform: true,
                borderPx: false,
              })
            }
            className={toolbar.buttonWithIcon}
          >
            <ArrowLeft size={20} color="rgb(0, 183, 255)"></ArrowLeft>
          </button>
          <input
            id="inputBorderColorText"
            type="Text"
            min="0"
            value={inputBorderColor}
            onChange={handleInputBorderColor}
          />
          <input
            id="inputBorderColor"
            type="color"
            list="true"
            value={
              inputBorderColor
            } /* FIXME: ojo, cambiar el color via texto no afecta al selector de color, viceversa si */
            onChange={handleInputBorderColor}
          />
          <button>%</button>
          <button
            onClick={() =>
              setToolbarDisplay({
                mainMenu: true,
                border: false,
                transform: false,
                borderPx: true,
              })
            }
          >
            px
          </button>
        </ToolbarRow>
      )}
      {toolbarDisplay.transform && (
        <ToolbarRow>
          <button
            onClick={() =>
              setToolbarDisplay({
                mainMenu: true,
                border: true,
                transform: false,
                borderPx: false,
              })
            }
          >
            Border
          </button>
          <button>GrayScale</button>
        </ToolbarRow>
      )}
      {toolbarDisplay.mainMenu && (
        <ToolbarRow>
          <button onClick={handleDownload}>Download</button>
          <button>New Image</button>
          <button>Undo</button>
          <button
            onClick={() =>
              setToolbarDisplay({
                border: false,
                mainMenu: true,
                transform: true,
                borderPx: false,
              })
            }
          >
            Transform
          </button>
        </ToolbarRow>
      )}
    </>
  );
}

export function SideToolbar() {
  const inputBorderPixelsRef = useRef<HTMLInputElement | null>(null);

  const {
    inputBorderColor,
    setInputBorderColor,
    inputBorderPixels,
    setInputBorderPixels,
    inputBorderPercent,
    setInputBorderPercent,
    handleInputBorderColor,
    handleInputBorderPixelsRange,
    handleBorderChange,
    handleInputBorderPixelsRangeMouseUp,
    handleInputBorderPixelsText,
    handleInputBorderPercentText,
    handleInputBorderPercent,
    handleInputBorderPercentRangeMouseUp,
    handleApplyBorder,
    handleDiscardBorder,
  } = useContext(BorderContext);

  const {
    originalFile,
    originalImg,
    setOriginalFile,
    setOriginalImg,
    imagenPreviewRef,
    displays,
    setDisplays,
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

  const { handleDownload, handleUndo } = useContext(ToolbarContext);
  /**
   * Handler del botón New Image. Vuelve al estado inicial.
   */
  function handleNewImage() {
    setDisplays((prev) => {
      return { canvas: false, form: true };
    });
    setOriginalFile(null);
    setOriginalImg(null);
    setProcessList([]);
    setUndoImageList([]);
    setCurrentProcess(null);
    setInputBorderPixels("0");
    setInputBorderPercent("0");
    setInputBorderColor("#ffffff");
    imagenPreviewRef.current!.src = "";
  }

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

  return (
    <>
      <div className="toolbar__top">
        <button id="btnUndo" onClick={handleUndo}>
          Undo
        </button>
        <button onClick={handleNewImage}>New Image</button>

        <button type="button" id="btnDescargar" onClick={handleDownload}>
          Download
        </button>
      </div>
      <div className="toolbar__group-container">
        <details className="toolbar__details">
          <summary className="toolbar__summary">Image Information</summary>
          <div className="toolbar-row">
            <div className="toolbar__image-info">
              <div>
                <strong>{originalFile?.name}</strong>
              </div>
              {originalFile && (
                <div>
                  {originalImg?.width} x {originalImg?.height} pixels
                </div>
              )}
              {originalFile && (
                <div>
                  {Math.floor(originalFile.size / 1000).toString()} Kbytes
                </div>
              )}
              <img
                id="imagenPreview"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
                ref={imagenPreviewRef}
              ></img>
            </div>
          </div>
        </details>
        <details className="toolbar__details">
          <summary className="toolbar__summary">Grayscale</summary>
          <div className="toolbar-row">
            <div className="toolbar-row__buttons">
              <button
                type="button"
                id="btnToBN"
                onClick={() => handleToGrayscale()}
              >
                Convert to Grayscale
              </button>
            </div>
          </div>
        </details>
        <details className="toolbar__details">
          <summary className="toolbar__summary">Borders</summary>
          <div className="toolbar__borders">
            <div className="toolbar-row ">
              <div className="toolbar-row__title">Color</div>
              <div className="toolbar-row__border-color">
                <input
                  id="inputBorderColor"
                  type="color"
                  list="true"
                  value={inputBorderColor}
                  onChange={handleInputBorderColor}
                />

                <input
                  id="inputBorderColorText"
                  type="Text"
                  min="0"
                  value={inputBorderColor}
                  onChange={handleInputBorderColor}
                ></input>
              </div>
            </div>
            <div className="toolbar-row ">
              <div className="toolbar-row__title">Border in percent</div>
              <div className="toolbar-row__border-ranges">
                <input
                  type="number"
                  id="inputBorderPercentN"
                  name="inputBorderPercentN"
                  min="0"
                  value={inputBorderPercent}
                  onKeyUp={handleInputBorderPercentText}
                  onChange={handleInputBorderPercentText}
                ></input>
                <div className="toolbar_row__units">%</div>
                <input
                  type="range"
                  id="inputBorderPercent"
                  name="inputBorderPercent"
                  min="0"
                  max="100"
                  value={inputBorderPercent}
                  onChange={handleInputBorderPercent}
                  onMouseUp={handleInputBorderPercentRangeMouseUp}
                  onTouchEnd={handleInputBorderPercentRangeMouseUp}
                ></input>
              </div>
            </div>
            <div className="toolbar-row">
              <div className="toolbar-row__title">Border in pixels</div>
              <div className="toolbar-row__border-ranges">
                <input
                  type="number"
                  id="inputBorderPixelsN"
                  name="inputBorderPixelsN"
                  min="0"
                  value={inputBorderPixels}
                  onKeyUp={handleInputBorderPixelsText}
                  onChange={handleInputBorderPixelsText}
                ></input>
                <div className="toolbar_row__units">px</div>
                <input
                  type="range"
                  id="inputBorderPixels"
                  name="inputBorderPixels"
                  min="0"
                  ref={inputBorderPixelsRef}
                  value={inputBorderPixels}
                  onChange={handleInputBorderPixelsRange}
                  onMouseUp={handleInputBorderPixelsRangeMouseUp}
                  onTouchEnd={handleInputBorderPixelsRangeMouseUp}
                ></input>
              </div>
            </div>
            <div className="toolbar-row">
              <div className="toolbar-row__buttons">
                <button
                  type="button"
                  id="btnApplyBorder"
                  onClick={handleApplyBorder}
                >
                  Apply
                </button>
                <button
                  type="button"
                  id="btnDiscardBorder"
                  onClick={handleDiscardBorder}
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        </details>
        <details className="toolbar__details">
          <summary className="toolbar__summary">Changes history</summary>
          <div className="toolbar-row toolbar-undo-list">
            {undoImageList && (
              <div className="undo-list">
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
        </details>
      </div>

      <br />
    </>
  );
}
