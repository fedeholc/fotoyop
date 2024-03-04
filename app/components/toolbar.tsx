import { useState, useRef, useContext } from "react";
import toolbar from "./toolbar.module.css";
import { ArrowLeft } from "lucide-react";
import { ImageContext } from "../ImageProvider";
import { ProcessContext } from "../ProcessProvider";
import { ProcessOptionsType } from "../types";
import { mainCanvasConfig } from "../App";
import { ImageProcess } from "../types";
import {
  applyProcessFunction,
  drawImageDataOnCanvas,
  imgAddBorder,
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

export function BottomToolbar({
  smallCanvasRef,
}: {
  smallCanvasRef: React.RefObject<HTMLCanvasElement>;
}) {
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
          <button>Download</button>
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

export function SideToolbar() {}
