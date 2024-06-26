"use client";
import { useState, useContext, useId } from "react";
import toolbar from "./BottomToolbar.module.css";
import { BorderContext } from "../providers/BorderProvider";
import { ImageContext } from "../providers/ImageProvider";
import { ToolbarContext } from "../providers/ToolbarProvider";
import { toolbarRow } from "../types";
import ButtonEdit from "./buttons/buttonEdit";
import ButtonNew from "./buttons/buttonNew";
import ButtonDownload from "./buttons/buttonDownload";
import ButtonBack from "./buttons/buttonBack";
import ButtonApply from "./buttons/buttonApply";
import ButtonBorder from "./buttons/buttonBorder";
import ButtonGrayscale from "./buttons/buttonGrayscale";
import ButtonCanvas from "./buttons/buttonCanvas";
import ButtonMenu from "./buttons/buttonMenu";
import ButtonSaveToEdit from "./buttons/buttonSaveToEdit";
import ButtonUndoIcon from "./buttons/buttonUndoIcon";
import ButtonDownloadFromCollage from "./buttons/buttonDownloadFromCollage";
import BtBorderPixelInputs from "./bottomToolbar/BtBorderPixelInput";
import BtBorderPercentInput from "./bottomToolbar/BtBorderPercentInput";
import BtCanvasColorInputs from "./bottomToolbar/BtCanvasColorInputs";
import BtBorderColorInputs from "./bottomToolbar/BtBorderColorInputs";
import BtAspectRatioPresets from "./bottomToolbar/BtAspectRatioPresets";
import BtAspectRatioInputs from "./bottomToolbar/BtAspectRatioInputs";
import BtCollageOptions from "./bottomToolbar/BtCollageOptions";
import TbCollageImages from "./sideToolbar/TbCollageImages";
import BtCollageImages from "./bottomToolbar/BbCollageImages";
import ButtonArrangeImages from "./buttons/buttonArrangeImages";
import { useEffect } from "react";
import { ProcessContext } from "../providers/ProcessProvider";
import { appConfig } from "../App";
import { calcResizeToWindow } from "../imageProcessing";
import useWindowsSize from "./hooks/useWindowsSize";

function ToolbarRow({
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
  const {
    collageImages,
    setDisplays,
    bottomToolbarDisplay,
    setBottomToolbarDisplay,
  } = useContext(ImageContext);

  function showToolbarRow(row: toolbarRow) {
    let toolbar = {
      mainMenu: false,
      edit: false,
      border: false,
      borderPx: false,
      borderPc: false,
      canvas: false,
      collage: false,
      flow: false,
      arrange: false,
    };
    // funciona como toggle, si se vuelve a hacer click en el mismo boton, se oculta (por ahora solo para Edit)
    toolbar[row] = bottomToolbarDisplay[row] === true ? false : true;
    setBottomToolbarDisplay(toolbar);
    setDisplays((prev) => {
      return {
        canvas: prev.canvas,
        form: prev.form,
        resizeTrigger: !prev.resizeTrigger,
        collage: prev.collage,
      };
    });
  }

  const {
    handleApplyBorder,
    handleDiscardBorder,
    handleApplyCanvas,
    handleDiscardCanvas,
  } = useContext(BorderContext);

  const { smallCanvasRef, displays } = useContext(ImageContext);
  const { undoImageList } = useContext(ProcessContext);

  const { originalImg, containerRef } = useContext(ImageContext);

  const { handleToGrayscale } = useContext(ToolbarContext);

  const { mobileToolbarRef } = useContext(ImageContext);
  const windowDimensions = useWindowsSize(displays, mobileToolbarRef);

  useEffect(() => {
    if (smallCanvasRef.current && originalImg && undoImageList.length > 0) {
      const { newWidth, newHeight } = calcResizeToWindow(
        undoImageList[undoImageList.length - 1].width,
        undoImageList[undoImageList.length - 1].height,
        windowDimensions,
        appConfig,
        mobileToolbarRef
      );

      if (containerRef.current) {
        containerRef.current.style.width = `${newWidth}px`;
        containerRef.current.style.height = `${newHeight}px`;
      }
    }
  }, [bottomToolbarDisplay, collageImages]);

  return (
    <div ref={mobileToolbarRef}>
      {bottomToolbarDisplay.flow && originalImg?.src && (
        <div className={toolbar.borderGroupFlow}>
          <ButtonBack
            onClick={() => {
              bottomToolbarDisplay.canvas ? handleApplyCanvas() : null;
              bottomToolbarDisplay.border ? handleApplyBorder() : null;
              setBottomToolbarDisplay((prev) => {
                return {
                  ...prev,
                  mainMenu: false,
                  border: false,
                  canvas: false,
                  edit: true,
                  flow: true,
                };
              });
            }}
          ></ButtonBack>
          <ButtonMenu
            onClick={() => showToolbarRow(toolbarRow.mainMenu)}
          ></ButtonMenu>
          <div className={toolbar.flowButtonsSeparator}>|</div>
          <ButtonUndoIcon></ButtonUndoIcon>
          {!bottomToolbarDisplay.mainMenu && !bottomToolbarDisplay.edit && (
            <ButtonApply
              onClick={() => {
                bottomToolbarDisplay.canvas ? handleApplyCanvas() : null;
                bottomToolbarDisplay.border ? handleApplyBorder() : null;
              }}
            ></ButtonApply>
          )}
        </div>
      )}

      {bottomToolbarDisplay.border && originalImg?.src && (
        <ToolbarRow className={toolbar.border__row}>
          <div className={toolbar.borderGroupEdit}>
            <BtBorderColorInputs />
            <BtBorderPercentInput maxRange="100" />
            <BtBorderPixelInputs
              maxRange={(originalImg.width / 2).toString()}
            />
          </div>
        </ToolbarRow>
      )}

      {bottomToolbarDisplay.canvas && originalImg?.src && (
        <ToolbarRow className={toolbar.border__row}>
          <div className={toolbar.borderGroupEdit}>
            <BtAspectRatioPresets />
            <BtCanvasColorInputs />
          </div>
        </ToolbarRow>
      )}

      {bottomToolbarDisplay.edit && originalImg?.src && (
        <ToolbarRow>
          <ButtonBorder
            onClick={() =>
              setBottomToolbarDisplay((prev) => {
                return {
                  ...prev,
                  border: true,
                  flow: true,
                  edit: false,
                };
              })
            }
          ></ButtonBorder>

          <ButtonGrayscale onClick={handleToGrayscale}></ButtonGrayscale>
          <ButtonCanvas
            onClick={() =>
              setBottomToolbarDisplay((prev) => {
                return {
                  ...prev,
                  canvas: true,
                  edit: false,
                  flow: true,
                };
              })
            }
          ></ButtonCanvas>
        </ToolbarRow>
      )}
      {bottomToolbarDisplay.mainMenu && originalImg?.src && (
        <ToolbarRow className={toolbar.mainMenu}>
          <ButtonDownload></ButtonDownload>
          <ButtonNew></ButtonNew>
          <ButtonEdit
            onClick={() =>
              setBottomToolbarDisplay((prev) => {
                return {
                  ...prev,
                  mainMenu: false,
                  edit: true,
                  flow: true,
                };
              })
            }
          ></ButtonEdit>
        </ToolbarRow>
      )}

      {bottomToolbarDisplay.arrange &&
        collageImages &&
        collageImages.length > 0 && (
          <ToolbarRow className={toolbar.border__row}>
            <BtCollageImages></BtCollageImages>
          </ToolbarRow>
        )}
      {bottomToolbarDisplay.mainMenu &&
        collageImages &&
        collageImages.length > 0 && (
          <ToolbarRow className={toolbar.border__row}>
            <BtCollageOptions></BtCollageOptions>
          </ToolbarRow>
        )}

      {bottomToolbarDisplay.mainMenu &&
        collageImages &&
        collageImages.length > 0 && (
          <ToolbarRow className={toolbar.mainMenu}>
            <ButtonNew></ButtonNew>
            <ButtonDownloadFromCollage></ButtonDownloadFromCollage>
            <ButtonSaveToEdit></ButtonSaveToEdit>
            <ButtonArrangeImages
              onClick={() => {
                setBottomToolbarDisplay((prev) => {
                  return {
                    ...prev,
                    mainMenu: true,
                    arrange: !prev.arrange,
                  };
                });
              }}
            />
          </ToolbarRow>
        )}
    </div>
  );
}
