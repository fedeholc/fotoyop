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
import ButtonGrayscale from "./buttons/buttonGrayscale";
import toolbar from "./BottomToolbar.module.css";

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
