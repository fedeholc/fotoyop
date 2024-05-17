"use client";
import { useState, useContext, useId } from "react";
import toolbar from "./BottomToolbar.module.css";
import { BorderContext } from "../providers/BorderProvider";
import { ImageContext } from "../providers/ImageProvider";
import { ToolbarContext } from "../providers/ToolbarProvider";
import { toolbarRow } from "../types";
import ButtonUndo from "./buttons/buttonUndo";
import ButtonEdit from "./buttons/buttonEdit";
import ButtonNew from "./buttons/buttonNew";
import ButtonDownload from "./buttons/buttonDownload";
import ButtonBack from "./buttons/buttonBack";
import ButtonApply from "./buttons/buttonApply";
import ButtonDiscard from "./buttons/buttonDiscard";
import ButtonBorder from "./buttons/buttonBorder";
import ButtonBorderPx from "./buttons/buttonBorderPx";
import ButtonBorderPc from "./buttons/buttonBorderPc";
import ButtonGrayscale from "./buttons/buttonGrayscale";
import ButtonCanvas from "./buttons/buttonCanvas";
import ButtonCollage from "./buttons/buttonCollage";
import ButtonSaveToEdit from "./buttons/buttonSaveToEdit";
import ButtonDownloadFromCollage from "./buttons/buttonDownloadFromCollage";
import BtBorderPixelInputs from "./bottomToolbar/BtBorderPixelInput";
import BtBorderPercentInput from "./bottomToolbar/BtBorderPercentInput";
import BtCanvasColorInputs from "./bottomToolbar/BtCanvasColorInputs";
import BtBorderColorInputs from "./bottomToolbar/BtBorderColorInputs";
import BtAspectRatioPresets from "./bottomToolbar/BtAspectRatioPresets";
import BtAspectRatioInputs from "./bottomToolbar/BtAspectRatioInputs";
import BtCollageOptions from "./bottomToolbar/BtCollageOptions";

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
  const { setDisplays } = useContext(ImageContext);
  const { collageImages } = useContext(ImageContext);

  function showToolbarRow(row: toolbarRow) {
    let toolbar = {
      mainMenu: true,
      edit: false,
      border: false,
      borderPx: false,
      borderPc: false,
      canvas: false,
      collage: false,
    };
    // funciona como toggle, si se vuelve a hacer click en el mismo boton, se oculta (por ahora solo para Edit)
    toolbar[row] = toolbarDisplay[row] === true ? false : true;
    setToolbarDisplay(toolbar);
    setDisplays((prev) => {
      return {
        canvas: prev.canvas,
        form: prev.form,
        resizeTrigger: !prev.resizeTrigger,
        collage: prev.collage,
      };
    });
  }

  const [toolbarDisplay, setToolbarDisplay] = useState({
    mainMenu: true,
    edit: false,
    border: false,
    borderPx: false,
    borderPc: false,
    canvas: false,
    collage: false,
  });

  const {
    handleApplyBorder,
    handleDiscardBorder,
    handleApplyCanvas,
    handleDiscardCanvas,
  } = useContext(BorderContext);

  const { originalImg } = useContext(ImageContext);

  const { handleToGrayscale } = useContext(ToolbarContext);

  const { mobileToolbarRef } = useContext(ImageContext);

  return (
    <div ref={mobileToolbarRef}>
      {toolbarDisplay.borderPx && originalImg?.src && (
        <ToolbarRow className={toolbar.border__row}>
          <ButtonBack
            onClick={() => showToolbarRow(toolbarRow.border)}
          ></ButtonBack>
          <BtBorderPixelInputs maxRange={(originalImg.width / 2).toString()} />
          <ButtonApply onClick={handleApplyBorder}></ButtonApply>
          <ButtonDiscard onClick={handleDiscardBorder}></ButtonDiscard>
        </ToolbarRow>
      )}
      {toolbarDisplay.borderPc && originalImg?.src && (
        <ToolbarRow className={toolbar.border__row}>
          <ButtonBack onClick={() => showToolbarRow(toolbarRow.border)} />
          <BtBorderPercentInput maxRange="100" />
          <ButtonApply
            onClick={() => {
              handleApplyBorder();
            }}
          />
          <ButtonDiscard onClick={handleDiscardBorder} />
        </ToolbarRow>
      )}
      {toolbarDisplay.border && originalImg?.src && (
        <ToolbarRow className={toolbar.border__row}>
          <ButtonBack
            onClick={() => showToolbarRow(toolbarRow.edit)}
          ></ButtonBack>
          <BtBorderColorInputs />
          <ButtonBorderPc
            onClick={() => showToolbarRow(toolbarRow.borderPc)}
          ></ButtonBorderPc>
          <ButtonBorderPx
            onClick={() => showToolbarRow(toolbarRow.borderPx)}
          ></ButtonBorderPx>
        </ToolbarRow>
      )}
      {toolbarDisplay.canvas && originalImg?.src && (
        <ToolbarRow className={toolbar.border__row}>
          <ButtonBack
            onClick={() => showToolbarRow(toolbarRow.edit)}
          ></ButtonBack>
          <span></span>

          <BtCanvasColorInputs />
          <BtAspectRatioPresets />
          <BtAspectRatioInputs />
          <ButtonApply
            onClick={() => {
              handleApplyCanvas();
            }}
          ></ButtonApply>
          <ButtonDiscard onClick={handleDiscardCanvas}></ButtonDiscard>
        </ToolbarRow>
      )}
      {toolbarDisplay.collage && originalImg?.src && (
        <ToolbarRow className={toolbar.border__row}>
          <ButtonBack
            onClick={() => showToolbarRow(toolbarRow.edit)}
          ></ButtonBack>
          <span></span>
          {/* el span es un separador para generar gap */}

          <ButtonApply
            onClick={() => {
              //handleApplyCanvas();
            }}
          ></ButtonApply>
          <ButtonDiscard
            onClick={
              () => {}
              //handleDiscardCanvas
            }
          ></ButtonDiscard>
        </ToolbarRow>
      )}
      {toolbarDisplay.edit && originalImg?.src && (
        <ToolbarRow>
          <ButtonBorder
            onClick={() => showToolbarRow(toolbarRow.border)}
          ></ButtonBorder>

          <ButtonGrayscale onClick={handleToGrayscale}></ButtonGrayscale>
          <ButtonCanvas
            onClick={() => showToolbarRow(toolbarRow.canvas)}
          ></ButtonCanvas>
          {/*  <ButtonCollage
            onClick={() => {
              showToolbarRow(toolbarRow.collage);
              setDisplays((prev) => {
                return {
                  canvas: false,
                  form: false,
                  resizeTrigger: !prev.resizeTrigger,
                  collage: true,
                };
              });
            }}
          ></ButtonCollage> */}
        </ToolbarRow>
      )}
      {toolbarDisplay.mainMenu && originalImg?.src && (
        <ToolbarRow className={toolbar.mainMenu}>
          <ButtonDownload></ButtonDownload>
          <ButtonNew></ButtonNew>
          <ButtonUndo></ButtonUndo>
          <ButtonEdit
            onClick={() => showToolbarRow(toolbarRow.edit)}
          ></ButtonEdit>
        </ToolbarRow>
      )}
      {/*   TODO: ojo, hay que cambiar los botones porque acá hacen otra cosa
       */}
      {toolbarDisplay.mainMenu && collageImages && (
        <ToolbarRow className={toolbar.border__row}>
          <BtCollageOptions></BtCollageOptions>
        </ToolbarRow>
      )}

      {toolbarDisplay.mainMenu && collageImages && (
        <ToolbarRow className={toolbar.mainMenu}>
          {/* <ButtonDownload></ButtonDownload> */}
          <ButtonNew></ButtonNew>
          <ButtonSaveToEdit></ButtonSaveToEdit>
          <ButtonDownloadFromCollage></ButtonDownloadFromCollage>
          {/*           <ButtonUndo></ButtonUndo>
           */}{" "}
          {/*  <ButtonEdit
            onClick={() => showToolbarRow(toolbarRow.edit)}
          ></ButtonEdit> */}
        </ToolbarRow>
      )}
    </div>
  );
}
