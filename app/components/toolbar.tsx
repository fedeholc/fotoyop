import { useState, useRef, useContext } from "react";
import toolbar from "./toolbar.module.css";
import {
  ArrowLeft,
  Check,
  X,
  Pencil,
  Undo,
  FilePlus,
  Download,
} from "lucide-react";
import { ToolbarContext } from "../providers/ToolbarProvider";
import { BorderContext } from "../providers/BorderProvider";

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
  const iconSize = 16;
  /* const iconColor = "rgb(216, 155, 0)"; */
  const iconColor = window
    .getComputedStyle(document.body)
    .getPropertyValue("--buttonIconColor");

  const [toolbarDisplay, setToolbarDisplay] = useState({
    mainMenu: true,
    transform: false,
    border: false,
    borderPx: false,
    borderPc: false,
  });

  const inputBorderPixelsRef = useRef<HTMLInputElement | null>(null);
  const inputBorderPercentRef = useRef<HTMLInputElement | null>(null);
  const {
    inputBorderColor,
    inputBorderPixels,
    inputBorderPercent,
    handleInputBorderColor,
    handleInputBorderPixelsRange,
    handleInputBorderPixelsRangeMouseUp,
    handleInputBorderPixelsText,
    handleInputBorderPercentRange,
    handleInputBorderPercentRangeMouseUp,
    handleInputBorderPercentText,
    handleApplyBorder,
    handleDiscardBorder,
  } = useContext(BorderContext);

  const { handleDownload, handleNewImage, handleUndo } =
    useContext(ToolbarContext);

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
                borderPc: false,
              })
            }
            className={toolbar.buttonOnlyIcon}
          >
            <ArrowLeft size={iconSize} color="rgb(0, 183, 255)"></ArrowLeft>
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
            ></input>{" "}
            <div className="toolbar_row__units">px</div>{" "}
          </div>
          <button
            className={toolbar.buttonWithIcon}
            type="button"
            id="btnApplyBorder"
            onClick={handleApplyBorder}
          >
            <Check size={iconSize}></Check>
          </button>
          <button
            className={toolbar.buttonWithIcon}
            type="button"
            id="btnDiscardBorder"
            onClick={handleDiscardBorder}
          >
            <X size={iconSize}></X>
          </button>
        </ToolbarRow>
      )}

      {toolbarDisplay.borderPc && (
        <ToolbarRow className={toolbar.border__row}>
          <button
            onClick={() =>
              setToolbarDisplay({
                mainMenu: true,
                border: true,
                transform: false,
                borderPx: false,
                borderPc: false,
              })
            }
            className={toolbar.buttonOnlyIcon}
          >
            <ArrowLeft size={iconSize} color="rgb(0, 183, 255)"></ArrowLeft>
          </button>

          <div className={toolbar.borderRanges}>
            <input
              type="range"
              id="inputBorderPercent"
              name="inputBorderPercent"
              min="0"
              ref={inputBorderPercentRef}
              value={inputBorderPercent}
              onChange={handleInputBorderPercentRange}
              onMouseUp={handleInputBorderPercentRangeMouseUp}
              onTouchEnd={handleInputBorderPercentRangeMouseUp}
            ></input>
            <input
              type="number"
              id="inputBorderPercentN"
              name="inputBorderPercentN"
              min="0"
              value={inputBorderPercent}
              onKeyUp={handleInputBorderPercentText}
              onChange={handleInputBorderPercentText}
            ></input>
            <div className="toolbar_row__units">px</div>
          </div>
          <button
            className={toolbar.buttonWithIcon}
            type="button"
            id="btnApplyBorder"
            onClick={handleApplyBorder}
          >
            <Check size={iconSize}></Check>
          </button>
          <button
            className={toolbar.buttonWithIcon}
            type="button"
            id="btnDiscardBorder"
            onClick={handleDiscardBorder}
          >
            <X size={iconSize}></X>
          </button>
        </ToolbarRow>
      )}

      {toolbarDisplay.border && (
        <ToolbarRow className={toolbar.border__row}>
          <button
            className={toolbar.buttonWithIcon}
            onClick={() =>
              setToolbarDisplay({
                mainMenu: true,
                border: false,
                transform: true,
                borderPx: false,
                borderPc: false,
              })
            }
          >
            <ArrowLeft size={iconSize} color="rgb(0, 183, 255)"></ArrowLeft>
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
          <button
            className={toolbar.buttonOnlyIcon}
            onClick={() =>
              setToolbarDisplay({
                mainMenu: true,
                border: false,
                transform: false,
                borderPx: false,
                borderPc: true,
              })
            }
          >
            %
          </button>
          <button
            className={toolbar.buttonOnlyIcon}
            onClick={() =>
              setToolbarDisplay({
                mainMenu: true,
                border: false,
                transform: false,
                borderPx: true,
                borderPc: false,
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
            className={toolbar.buttonText}
            onClick={() =>
              setToolbarDisplay({
                mainMenu: true,
                border: true,
                transform: false,
                borderPx: false,
                borderPc: false,
              })
            }
          >
            Border
          </button>
          <button className={toolbar.buttonText}>GrayScale</button>
        </ToolbarRow>
      )}
      {toolbarDisplay.mainMenu && (
        <ToolbarRow>
          <button className={toolbar.buttonWithIcon} onClick={handleDownload}>
            <Download size={iconSize} color={iconColor}></Download>Download
          </button>
          <button className={toolbar.buttonWithIcon} onClick={handleNewImage}>
            <FilePlus size={iconSize} color={iconColor}></FilePlus>New
          </button>
          <button className={toolbar.buttonWithIcon} onClick={handleUndo}>
            <Undo size={iconSize} color={iconColor}></Undo>Undo
          </button>
          <button
            className={toolbar.buttonWithIcon}
            onClick={() =>
              setToolbarDisplay({
                border: false,
                mainMenu: true,
                transform: true,
                borderPx: false,
                borderPc: false,
              })
            }
          >
            <Pencil size={iconSize} color={iconColor}></Pencil>
            Edit
          </button>
        </ToolbarRow>
      )}
    </>
  );
}
