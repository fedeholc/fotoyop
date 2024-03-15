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
import ButtonCanvas from "./buttons/buttonCanvas";

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
      canvas: false,
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
    canvas: false,
  });

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
    handleInputBorderPercentRange,
    handleInputBorderPercentRangeMouseUp,
    handleInputBorderPercentText,
    handleApplyBorder,
    handleDiscardBorder,
    handleApplyCanvas,
    handleDiscardCanvas,
    selectAspectRatio,
    handleSelectAspectRatio,
  } = useContext(BorderContext);

  //todo: pasar lo que es de canvas a un canvas context

  const { originalImg } = useContext(ImageContext);

  const { handleToGrayscale } = useContext(ToolbarContext);

  //!sería bueno poder ponerlo en componente para poder armarlo con una label y usando useId, de modo de no repetir el id en el html (no en este caso que creo que no se repite pero en el input de color sí... aunque habría que ver si el input de color no debería modificar un state distinto según donde se use)

  function BorderPixelInputs({ maxRange }: { maxRange: string }) {
    const [inputBorderPixels, setInputBorderPixelsTest] =
      useState(BorderPixels);
    return (
      <div className={toolbar.borderRanges}>
        <input
          type="range"
          id="inputBorderPixels"
          name="inputBorderPixels"
          min="0"
          max={maxRange}
          value={inputBorderPixels}
          onChange={(e) => setInputBorderPixelsTest(e.target.value)}
          onMouseUp={() =>
            handleInputBorderPixelsRangeMouseUp(inputBorderPixels)
          }
          onTouchEnd={() =>
            handleInputBorderPixelsRangeMouseUp(inputBorderPixels)
          }
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
  }

  //!TODO: ahora que funciona esto componentizado podría hacer lo de las labels en componente con useID
  //!   y hacer lo mismo con la side toolbar
  function BorderPercentInputs() {
    const [inputBorderPercent, setInputBorderPercentTest] =
      useState(BorderPercent);
    return (
      <div className={toolbar.borderRanges}>
        <input
          type="range"
          id="inputBorderPercent"
          min="0"
          value={inputBorderPercent}
          onMouseUp={() =>
            handleInputBorderPercentRangeMouseUp(inputBorderPercent)
          }
          onTouchEnd={() =>
            handleInputBorderPercentRangeMouseUp(inputBorderPercent)
          }
          onChange={(e) => setInputBorderPercentTest(e.target.value)}
        ></input>
        <input
          type="number"
          id="inputBorderPercentN"
          min="0"
          value={inputBorderPercent}
          onKeyUp={handleInputBorderPercentText}
          onChange={handleInputBorderPercentText}
        ></input>
        <div className="toolbar_row__units">%</div>
      </div>
    );
  }

  const AspectRatioInputs = (
    <div className={toolbar.canvasInputs}>
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
  );
  const AspectRatioPresets = (
    <div className={toolbar.canvasInputs}>
      <label htmlFor="aspectRatioPresets">
        Aspect
        <br />
        Ratio
      </label>
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
  );

  const BorderColorInputs = (
    <>
      <input
        type="Text"
        min="0"
        value={inputBorderColor}
        onChange={handleInputBorderColor}
      />
      <input
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
          {/*  {BorderPixelInputs} */}
          <BorderPixelInputs maxRange={(originalImg.width / 2).toString()} />
          <ButtonApply onClick={handleApplyBorder}></ButtonApply>
          <ButtonDiscard onClick={handleDiscardBorder}></ButtonDiscard>
        </ToolbarRow>
      )}

      {toolbarDisplay.borderPc && originalImg?.src && (
        <ToolbarRow className={toolbar.border__row}>
          <ButtonBack onClick={() => showToolbarRow(toolbarRow.border)} />
          <BorderPercentInputs />
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
      {toolbarDisplay.canvas && originalImg?.src && (
        <ToolbarRow className={toolbar.border__row}>
          <ButtonBack
            onClick={() => showToolbarRow(toolbarRow.transform)}
          ></ButtonBack>
          <span></span>
          {/* separador para generar gap */}

          {BorderColorInputs}
          {AspectRatioPresets}
          {AspectRatioInputs}

          <ButtonApply
            onClick={() => {
              handleApplyCanvas();
            }}
          ></ButtonApply>
          <ButtonDiscard onClick={handleDiscardCanvas}></ButtonDiscard>
        
        </ToolbarRow>
      )}

      {toolbarDisplay.transform && originalImg?.src && (
        <ToolbarRow>
          <ButtonBorder
            onClick={() => showToolbarRow(toolbarRow.border)}
          ></ButtonBorder>

          <ButtonGrayscale onClick={handleToGrayscale}></ButtonGrayscale>
          <ButtonCanvas
            onClick={() => showToolbarRow(toolbarRow.canvas)}
          ></ButtonCanvas>
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
