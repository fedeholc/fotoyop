import { useRef, useContext, useState, useId } from "react";
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

function ToolbarGroup({
  className = "",
  groupTitle = "",
  children,
}: {
  className?: string;
  groupTitle?: string;
  children: React.ReactNode;
}) {
  const classes = `${sideToolbar.bordersGroup} ${className}`;
  return (
    <details>
      <summary>{groupTitle}</summary>

      <div className={classes}>{children}</div>
    </details>
  );
}

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

  function BorderPixelInputs({ maxRange }: { maxRange: string }) {
    const id = useId();
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
              handleInputBorderPixelsRangeMouseUp(
                (e.target as HTMLInputElement).value
              );
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
            handleInputBorderPixelsRangeMouseUp(
              (e.target as HTMLInputElement).value
            )
          }
          onTouchEnd={(e) =>
            handleInputBorderPixelsRangeMouseUp(
              (e.target as HTMLInputElement).value
            )
          }
        ></input>
      </div>
    );
  }

  function BorderPercentInputs({ maxRange }: { maxRange: string }) {
    const id = useId();
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
              handleInputBorderPercentRangeMouseUp(
                (e.target as HTMLInputElement).value
              );
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
            handleInputBorderPercentRangeMouseUp(
              (e.target as HTMLInputElement).value
            )
          }
          onTouchEnd={(e) =>
            handleInputBorderPercentRangeMouseUp(
              (e.target as HTMLInputElement).value
            )
          }
        ></input>
      </div>
    );
  }

  function BorderColorInputs() {
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

  function ImageInfo() {
    return (
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
          ref={imagenPreviewRef}
        ></img>
      </div>
    );
  }
  function ChangesHistory() {
    return (
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
    );
  }

  function AspectRatioInputs() {
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

  return (
    <>
      <div className={sideToolbar.toolbar__top}>
        <ButtonUndo></ButtonUndo>
        <ButtonNew></ButtonNew>
        <ButtonDownload></ButtonDownload>
      </div>
      <div className={sideToolbar.groupContainer}>
        <ToolbarGroup groupTitle="Image Information">
          <div className={sideToolbar.toolbarRow}>
            <ImageInfo />
          </div>
        </ToolbarGroup>

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
              <BorderPixelInputs
                maxRange={(originalImg.width / 2).toString()}
              />
            )}
          </div>
          <div className={sideToolbar.toolbarRow}>
            <div className={sideToolbar.rowButtons}>
              <ButtonApply onClick={handleApplyBorder}></ButtonApply>
              <ButtonDiscard onClick={handleDiscardBorder}></ButtonDiscard>
            </div>
          </div>
        </ToolbarGroup>
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
              <ButtonApply
                onClick={() => {
                  handleApplyCanvas();
                }}
              ></ButtonApply>
              <ButtonDiscard onClick={handleDiscardCanvas}></ButtonDiscard>
            </div>
          </div>
        </ToolbarGroup>
        <ToolbarGroup groupTitle="GrayScale">
          <div className={sideToolbar.toolbarRow}>
            <div className={sideToolbar.rowButtons}>
              <ButtonGrayscale onClick={handleToGrayscale}></ButtonGrayscale>
            </div>
          </div>
        </ToolbarGroup>
        <ToolbarGroup groupTitle="Changes History">
          <ChangesHistory />
        </ToolbarGroup>
      </div>

      <br />
    </>
  );
}
