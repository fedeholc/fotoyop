import { useRef, useContext } from "react";
import { ImageContext } from "../providers/ImageProvider";
import { ProcessContext } from "../providers/ProcessProvider";
import { ToolbarContext } from "../providers/ToolbarProvider";
import { imageDataToBase64 } from "../imageProcessing";
import { BorderContext } from "../providers/BorderProvider";
import sideToolbar from "./sideToolbar.module.css";
import ButtonUndo from "./buttons/buttonUndo";
import ButtonNew from "./buttons/buttonNew";
import ButtonDownload from "./buttons/buttonDownload";
import ButtonApply from "./buttons/buttonApply";
import ButtonDiscard from "./buttons/buttonDiscard";
import ButtonBorder from "./buttons/buttonBorder";
import ButtonGrayscale from "./buttons/buttonGrayscale";
import toolbar from "./toolbar.module.css";

export function SideToolbar() {
  const inputBorderPixelsRef = useRef<HTMLInputElement | null>(null);

  const {
    inputBorderColor,
    BorderPixels,
    BorderPercent,
    inputAspectRatioX,
    inputAspectRatioY,
    handleInputAspectRatioX,
    handleInputAspectRatioY,
    handleInputBorderColor,
    handleInputBorderPixelsRange,
    handleInputBorderPixelsRangeMouseUp,
    handleInputBorderPixelsText,
    handleInputBorderPercentText,
    handleInputBorderPercent,
    handleInputBorderPercentRangeMouseUp,
    handleApplyBorder,
    handleDiscardBorder,
    handleApplyCanvas,
    handleDiscardCanvas,
    selectAspectRatio,
    handleSelectAspectRatio,
  } = useContext(BorderContext);

  const { originalFile, originalImg, imagenPreviewRef } =
    useContext(ImageContext);

  const { undoImageList } = useContext(ProcessContext);

  const { handleToGrayscale } = useContext(ToolbarContext);

  return (
    <>
      <div className={sideToolbar.toolbar__top}>
        <ButtonUndo></ButtonUndo>
        <ButtonNew></ButtonNew>
        <ButtonDownload></ButtonDownload>
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
                  value={BorderPercent}
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
                  value={BorderPercent} /* cambiar al pasar a */
                  onChange={handleInputBorderPercent}
                  onMouseUp={() =>
                    handleInputBorderPercentRangeMouseUp(BorderPercent)
                  }
                  onTouchEnd={() =>
                    handleInputBorderPercentRangeMouseUp(BorderPercent)
                  }
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
                  value={BorderPixels}
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
                  value={BorderPixels}
                  onChange={handleInputBorderPixelsRange}
                  onMouseUp={() =>
                    handleInputBorderPixelsRangeMouseUp(BorderPixels)
                  }
                  onTouchEnd={() =>
                    handleInputBorderPixelsRangeMouseUp(BorderPixels)
                  }
                ></input>
              </div>
            </div>
            <div className={sideToolbar.toolbarRow}>
              <div className={sideToolbar.rowButtons}>
                <ButtonApply onClick={handleApplyBorder}></ButtonApply>
                <ButtonDiscard onClick={handleDiscardBorder}></ButtonDiscard>
              </div>
            </div>
          </div>
        </details>
        <details>
          <summary>Canvas</summary>
          <div className={sideToolbar.bordersGroup}>
            <div className={sideToolbar.toolbarRow}>
              <div className={sideToolbar.rowTitle}>Color</div>
              <div className={sideToolbar.borderColorRow}>
                <input
                  id="inputBorderColor2"
                  type="color"
                  list="true"
                  value={inputBorderColor}
                  onChange={handleInputBorderColor}
                />

                <input
                  id="inputBorderColorText2"
                  type="Text"
                  min="0"
                  value={inputBorderColor}
                  onChange={handleInputBorderColor}
                ></input>
              </div>
            </div>

            <div className={sideToolbar.toolbarRow}>
              <div className={sideToolbar.rowTitle}>Aspect Raio</div>
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
            </div>
            <div className={sideToolbar.toolbarRow}>
              <div className={sideToolbar.rowButtons}>
                <ButtonApply
                  onClick={() => {
                    handleApplyCanvas();
                  }}
                ></ButtonApply>
                <ButtonDiscard onClick={handleDiscardCanvas}></ButtonDiscard>
              </div>
            </div>
          </div>
        </details>
        <details>
          <summary>Grayscale</summary>
          <div className={sideToolbar.toolbarRow}>
            <div className={sideToolbar.rowButtons}>
              <ButtonGrayscale onClick={handleToGrayscale}></ButtonGrayscale>
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
