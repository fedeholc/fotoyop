import { useRef, useContext } from "react";
import { ImageContext } from "../providers/ImageProvider";
import { ProcessContext } from "../providers/ProcessProvider";
import { ToolbarContext } from "../providers/ToolbarProvider";
import { imageDataToBase64 } from "../imageProcessing";
import { BorderContext } from "../providers/BorderProvider";
import sideToolbar from "./sideToolbar.module.css";

export function SideToolbar() {
  const inputBorderPixelsRef = useRef<HTMLInputElement | null>(null);

  const {
    inputBorderColor,
    inputBorderPixels,
    inputBorderPercent,
    handleInputBorderColor,
    handleInputBorderPixelsRange,
    handleInputBorderPixelsRangeMouseUp,
    handleInputBorderPixelsText,
    handleInputBorderPercentText,
    handleInputBorderPercent,
    handleInputBorderPercentRangeMouseUp,
    handleApplyBorder,
    handleDiscardBorder,
  } = useContext(BorderContext);

  const { originalFile, originalImg, imagenPreviewRef } =
    useContext(ImageContext);

  const { undoImageList } = useContext(ProcessContext);

  const { handleDownload, handleUndo, handleNewImage, handleToGrayscale } =
    useContext(ToolbarContext);

  return (
    <>
      <div className={sideToolbar.toolbar__top}>
        <button id="btnUndo" onClick={handleUndo}>
          Undo
        </button>
        <button onClick={handleNewImage}>New Image</button>

        <button type="button" id="btnDescargar" onClick={handleDownload}>
          Download
        </button>
      </div>
      <div className={sideToolbar.groupContainer}>
        <details>
          <summary>Image Information</summary>
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
        <details>
          <summary>Grayscale</summary>
          <div className={sideToolbar.toolbarRow}>
            <div className={sideToolbar.rowButtons}>
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
        <details>
          <summary>Borders</summary>
          <div className={sideToolbar.bordersGroup}>
            <div className={sideToolbar.toolbarRow}>
              <div className={sideToolbar.rowTitle}>Color</div>
              <div className={sideToolbar.borderColorRow}>
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
            <div className={sideToolbar.toolbarRow}>
              <div className={sideToolbar.rowTitle}>Border in percent</div>
              <div className={sideToolbar.borderRangesRow}>
                <input
                  type="number"
                  id="inputBorderPercentN"
                  name="inputBorderPercentN"
                  min="0"
                  value={inputBorderPercent}
                  onKeyUp={handleInputBorderPercentText}
                  onChange={handleInputBorderPercentText}
                ></input>
                <div>%</div>
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
            <div className={sideToolbar.toolbarRow}>
              <div className={sideToolbar.rowTitle}>Border in pixels</div>
              <div className={sideToolbar.borderRangesRow}>
                <input
                  type="number"
                  id="inputBorderPixelsN"
                  name="inputBorderPixelsN"
                  min="0"
                  value={inputBorderPixels}
                  onKeyUp={handleInputBorderPixelsText}
                  onChange={handleInputBorderPixelsText}
                ></input>
                <div>px</div>
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
            <div className={sideToolbar.toolbarRow}>
              <div className={sideToolbar.rowButtons}>
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
        <details>
          <summary>Changes history</summary>
          <div
            className={`${sideToolbar.changesGroup} ${sideToolbar.toolbarRow}`}
          >
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
        </details>
      </div>

      <br />
    </>
  );
}
