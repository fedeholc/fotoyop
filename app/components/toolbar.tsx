import { useState, useRef, useContext, useEffect } from "react";
import toolbar from "./toolbar.module.css";
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
  function showToolbarRow(row: toolbarRow) {
    let toolbar = {
      mainMenu: true,
      transform: false,
      border: false,
      borderPx: false,
      borderPc: false,
    };
    // funciona como toggle, si se vuelve a hacer click en el mismo boton, se oculta (por ahora solo para Edit)
    toolbar[row] = toolbarDisplay[row] === true ? false : true;
    setToolbarDisplay(toolbar);
  }

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
    setInputBorderPercent,
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

  const { originalFile, originalImg, imagenPreviewRef } =
    useContext(ImageContext);

  const { handleToGrayscale } = useContext(ToolbarContext);

  // hace que el selector de ancho de borde tenga como máximo la mitad del tamaño de la imagenn
  useEffect(() => {
    if (originalImg && inputBorderPixelsRef.current) {
      if (originalImg.width > originalImg.height) {
        inputBorderPixelsRef.current!.max = (originalImg.width / 2).toString();
      } else {
        inputBorderPixelsRef.current!.max = (originalImg.width / 2).toString();
      }
    }
  }, [originalImg, inputBorderPixelsRef.current]);

  //TODO: esto lo tenía como componente pero no funcionaba bien, al mover el slider no dejaba deslizarlo mas que un punto, y tampoco funcionaba el touchEnd, creo yo que por el re-renderizado del componente al actualizar el inputBorderPixels que viene del provider.
  //FIXME: habría que buscar en el curso de josh, que había una explicación para evitar ese re-renderizado, creo que era con memo o algo así, o sino ver si es necesario que el valor venga del provider, o si se puede manejar localmente y pasar el valor a la funcion que hace el cambio de borde.
  const BorderPixelInputs = (
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
  );

  const BorderPercentInputs = (
    <div className={toolbar.borderRanges}>
      <input
        type="range"
        id="inputBorderPercent"
        name="inputBorderPercent"
        min="0"
        ref={inputBorderPercentRef}
        value={inputBorderPercent}
        onMouseUp={handleInputBorderPercentRangeMouseUp}
        onChange={handleInputBorderPercentRange}
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
      <div className="toolbar_row__units">%</div>
    </div>
  );

  const BorderColorInputs = (
    <>
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
        value={inputBorderColor}
        onChange={handleInputBorderColor}
      />
    </>
  );

  return (
    <>
      {toolbarDisplay.borderPx && originalImg?.src && (
        <ToolbarRow className={toolbar.border__row}>
          <ButtonBack
            onClick={() => showToolbarRow(toolbarRow.border)}
          ></ButtonBack>
          {BorderPixelInputs}
          <ButtonApply onClick={handleApplyBorder}></ButtonApply>
          <ButtonDiscard onClick={handleDiscardBorder}></ButtonDiscard>
        </ToolbarRow>
      )}

      {toolbarDisplay.borderPc && originalImg?.src && (
        <ToolbarRow className={toolbar.border__row}>
          <ButtonBack
            onClick={() => showToolbarRow(toolbarRow.border)}
          ></ButtonBack>

          {BorderPercentInputs}

          <ButtonApply
            onClick={() => {
              handleInputBorderPercentRangeMouseUp();
              handleApplyBorder();
            }}
          ></ButtonApply>
          <ButtonDiscard onClick={handleDiscardBorder}></ButtonDiscard>
        </ToolbarRow>
      )}

      {toolbarDisplay.border && originalImg?.src && (
        <ToolbarRow className={toolbar.border__row}>
          <ButtonBack
            onClick={() => showToolbarRow(toolbarRow.transform)}
          ></ButtonBack>
          {BorderColorInputs}
          <ButtonBorderPc
            onClick={() => showToolbarRow(toolbarRow.borderPc)}
          ></ButtonBorderPc>
          <ButtonBorderPx
            onClick={() => showToolbarRow(toolbarRow.borderPx)}
          ></ButtonBorderPx>
        </ToolbarRow>
      )}
      {toolbarDisplay.transform && originalImg?.src && (
        <ToolbarRow>
          <ButtonBorder
            onClick={() => showToolbarRow(toolbarRow.border)}
          ></ButtonBorder>

          <ButtonGrayscale onClick={handleToGrayscale}></ButtonGrayscale>
        </ToolbarRow>
      )}

      {toolbarDisplay.mainMenu && originalImg?.src && (
        <ToolbarRow className={toolbar.mainMenu}>
          <ButtonDownload></ButtonDownload>
          <ButtonNew></ButtonNew>
          <ButtonUndo></ButtonUndo>
          <ButtonEdit
            onClick={() => showToolbarRow(toolbarRow.transform)}
          ></ButtonEdit>

          {/* TODO: no funciona la ubicacion del popover justo arriba del boton */}
          {/* @ts-ignore */}
          {/*  <button className={toolbar.popoverButton} popovertarget="my-popover">
            Open Popover
          </button> */}
          {/* @ts-ignore */}
          {/* <div id="my-popover" className={toolbar.popoverInfo} popover="auto">
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
                  style={{ maxWidth: "150px", maxHeight: "150px" }}
                  ref={imagenPreviewRef}
                ></img>
              </div>
            </div>
          </div> */}

          {/* TODO: barra de info, hacerla popover */}
          {/*  {originalFile && (
            <div className={toolbar.imageInfo}>
              <span>
                {originalImg?.width} x {originalImg?.height} px
              </span>
              <span>{Math.floor(originalFile.size / 1000).toString()} Kb</span>
              <span>{originalFile?.name}</span>
            </div>
          )} */}
        </ToolbarRow>
      )}
    </>
  );
}
