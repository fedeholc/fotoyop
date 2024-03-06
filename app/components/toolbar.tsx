import { useState, useRef, useContext, use } from "react";
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
import { ImageContext } from "../providers/ImageProvider";
import { useEffect } from "react";

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

  //FIXME: da error incluso si pongo el use client, tal vez haya que hacer que lo lea en useeffect.

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

  const { originalImg } = useContext(ImageContext);
  const { handleDownload, handleNewImage, handleUndo } =
    useContext(ToolbarContext);

  // hace que el selector de ancho de borde tenga como máximo la mitad del tamaño de la imagen
  useEffect(() => {
    if (originalImg && inputBorderPixelsRef.current) {
      if (originalImg.width > originalImg.height) {
        inputBorderPixelsRef.current!.max = (originalImg.width / 2).toString();
      } else {
        inputBorderPixelsRef.current!.max = (originalImg.width / 2).toString();
      }
    }
  }, [originalImg, inputBorderPixelsRef.current]);

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
            <ArrowLeft size={iconSize}></ArrowLeft>
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
            className={toolbar.buttonOnlyIcon}
            type="button"
            id="btnApplyBorder"
            onClick={handleApplyBorder}
          >
            <Check size={iconSize}></Check>
          </button>
          <button
            className={toolbar.buttonOnlyIcon}
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
            <ArrowLeft size={iconSize}></ArrowLeft>
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
            className={toolbar.buttonOnlyIcon}
            type="button"
            id="btnApplyBorder"
            onClick={handleApplyBorder}
          >
            <Check size={iconSize}></Check>
          </button>
          <button
            className={toolbar.buttonOnlyIcon}
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
            className={toolbar.buttonOnlyIcon}
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
            <ArrowLeft size={iconSize}></ArrowLeft>
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
            <Download size={iconSize}></Download>
            <span>Download</span>
          </button>
          <button className={toolbar.buttonWithIcon} onClick={handleNewImage}>
            <FilePlus size={iconSize}></FilePlus>
            <span>New</span>
          </button>
          <button className={toolbar.buttonWithIcon} onClick={handleUndo}>
            <Undo size={iconSize}></Undo>
            <span>Undo</span>
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
            <Pencil size={iconSize}></Pencil>
            <span>Edit</span>
          </button>
        </ToolbarRow>
      )}
    </>
  );
}
