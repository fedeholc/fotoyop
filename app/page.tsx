"use client";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import {
  CanvasConfig,
  ProcessFunction,
  DisplaySections,
  ImageProcess,
  ProcessOptionsType,
} from "./types";
import {
  imgToBW,
  imgAddBorder,
  getImageFromFile,
  drawImageB64OnCanvas,
  applyProcessFunction,
  processImgToCanvas,
  processToNewImageData,
  drawImageDataOnCanvas,
  imageB64ToImageData,
  imageDataToBase64,
} from "./imageProcessing";

export default function Home() {
  const [displays, setDisplays] = useState<DisplaySections>({
    canvas: false,
    form: true,
  });

  const mainCanvasConfig: CanvasConfig = {
    maxWidth: 600,
    maxHeight: 600,
  };

  const [inputBorderPixels, setInputBorderPixels] = useState<string>("0");
  const [inputBorderPercent, setInputBorderPercent] = useState<string>("0");
  const [inputBorderColor, setInputBorderColor] = useState<string>("#ffffff");

  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalImg, setOriginalImg] = useState<HTMLImageElement | null>(null);
  const [processList, setProcessList] = useState<ProcessFunction[]>([]);

  const [undoImageList, setUndoImageList] = useState<ImageData[]>([]);

  const [currentProcess, setCurrentProcess] = useState<ImageProcess | null>(
    null
  );

  const inputUploadRef = useRef<HTMLInputElement | null>(null);
  const smallCanvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagenPreviewRef = useRef<HTMLImageElement | null>(null);
  const smallCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputBorderPixelsRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setOriginalImg(new window.Image() as HTMLImageElement);
    if (smallCanvasRef.current) {
      smallCanvasCtxRef.current = smallCanvasRef.current.getContext("2d", {
        willReadFrequently: true,
      });
      if (smallCanvasCtxRef.current) {
        smallCanvasCtxRef.current.imageSmoothingEnabled = false;
      }
    }
  }, [displays]);
  //el useEffect depende de displays porque oculta/muestra el canvas

  /**
   * Pasos a seguir cuando se carga un archivo de imagen.
   * @param file - archivo de imagen
   * @returns
   */
  async function loadFileProcedure(file: File) {
    setDisplays((prev) => {
      return { ...prev, canvas: true, form: false };
    });

    let originalImageB64: string;

    try {
      originalImageB64 = (await getImageFromFile(file as File)) as string;
    } catch (error) {
      console.log("Error:", error);
      return;
    }

    if (originalImageB64) {
      setOriginalFile(file);

      const newImageElement = new window.Image();
      newImageElement.src = originalImageB64;
      newImageElement.onload = () => {
        if (newImageElement.width > newImageElement.height) {
          inputBorderPixelsRef.current!.max = newImageElement.width.toString();
        } else {
          inputBorderPixelsRef.current!.max = newImageElement.height.toString();
        }
      };
      setOriginalImg(newImageElement);

      drawImageB64OnCanvas(
        originalImageB64,
        smallCanvasRef.current as HTMLCanvasElement,
        mainCanvasConfig.maxWidth,
        mainCanvasConfig.maxHeight
      );

      if (imagenPreviewRef.current) {
        imagenPreviewRef.current.src = originalImageB64;
      }

      undoImageList.push(
        await imageB64ToImageData(
          originalImageB64,
          mainCanvasConfig.maxWidth,
          mainCanvasConfig.maxHeight
        )
      );
    }
  }

  /**
   * Handler del input cuando se sube un archivo.
   * @param event
   */
  async function handleUploadFormInput(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    const file = (event.target as HTMLFormElement).files[0];
    loadFileProcedure(file as File);
  }

  /**
   * Handler del click en convertir a blanco y negro.
   */
  function handleToGrayscale() {
    if (!originalFile) {
      return;
    }

    if (currentProcess === ImageProcess.Border) {
      handleApplyBorder();
      setCurrentProcess(null);
    }

    applyProcessFunction(smallCanvasRef.current, imgToBW);
    setProcessList([...processList, imgToBW]);

    let newImageData = processToNewImageData(smallCanvasRef.current, imgToBW);

    let newUndoImageList = [...undoImageList, newImageData];
    setUndoImageList(newUndoImageList);
  }

  /**
   * Handler del botón descartar borde. Descarta las últimas modificaciones recuperando el snapshot anterior.
   */
  function handleDiscardBorder() {
    const newUndoImageList = [...undoImageList];
    if (currentProcess === ImageProcess.Border && undoImageList.length > 1) {
      newUndoImageList.pop();
      setUndoImageList(newUndoImageList);

      drawImageDataOnCanvas(
        newUndoImageList[newUndoImageList.length - 1],
        smallCanvasRef.current!
      );

      const newProcessList = [...processList];
      newProcessList.pop();

      setProcessList(newProcessList);
    }

    setInputBorderColor("#ffffff");
    setInputBorderPercent("0");
    setInputBorderPixels("0");
    setCurrentProcess(null);
  }

  /**
   * Handler del click en aplicar borde.
   */
  function handleApplyBorder() {
    setInputBorderColor("#ffffff");
    setInputBorderPercent("0");
    setInputBorderPixels("0");
    setCurrentProcess(null);
  }

  /**
   * Procedimiento para generar la imagen procesada y enviarla como descarga.
   */
  function handleDownload() {
    if (!originalFile) {
      return;
    }
    let downloadDataURL = processImgToCanvas(
      originalImg!,
      processList
    ).toDataURL("image/jpeg", 1);
    const enlaceDescarga = document.createElement("a");
    enlaceDescarga.href = downloadDataURL || "";
    enlaceDescarga.download = "image.jpg";

    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);
  }

  /**
   * Simula el click en el input de tipo file para abrir el explorador de archivos.
   */
  function handleUploadFormClick() {
    inputUploadRef.current?.click();
  }

  /**
   * Cuando se suelta un archivo en el area de drop, se llama al procedimiento de carga de archivo.
   * @param event
   */
  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const files: File[] = [];

    if (event.dataTransfer.items) {
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        if (event.dataTransfer.items[i].kind === "file") {
          const file = event.dataTransfer.items[i].getAsFile();
          if (file) {
            files.push(file);
          }
        }
      }
    }

    loadFileProcedure(files[0]);
  }

  /**
   * Cambia el CSS del area de drop cuando el mouse sobre ellos.
   * @param event
   */
  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    let dropTitles = document.querySelectorAll(".drop-title");
    dropTitles.forEach((title) => {
      title.classList.add("drop-title-dragover");
    });

    let dropContainer = document.querySelector(".drop-container");
    dropContainer?.classList.add("drop-container-dragover");
  }

  /**
   * Cambia el CSS del area de drop (vuelve al estado inicial) cuando el mouse sale de allí.
   * @param event
   */
  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    let dropTitles = document.querySelectorAll(".drop-title");
    dropTitles.forEach((title) => {
      title.classList.remove("drop-title-dragover");
    });
    let dropContainer = document.querySelector(".drop-container");
    dropContainer?.classList.remove("drop-container-dragover");
  }

  /**
   *
   * @param event - evento del input de rango de borde en pixels
   */
  function handleInputBorderPixelsRange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setInputBorderPercent("0");
    setInputBorderPixels(event.target.value);
  }

  /**
   * Handler del botón Undo. Deshace la última modificación.
   */
  function handleUndo() {
    if (!originalFile) {
      return;
    }
    if (undoImageList.length > 1) {
      const newUndoImageList = [...undoImageList];
      newUndoImageList.pop();
      setUndoImageList(newUndoImageList);
      drawImageDataOnCanvas(
        newUndoImageList[newUndoImageList.length - 1],
        smallCanvasRef.current!
      );

      const newProcessList = [...processList];
      newProcessList.pop();
      setProcessList(newProcessList);
    }
  }

  /**
   *
   * @param event - evento del input de rango de borde en porcentaje
   */
  function handleInputBorderPercent(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setInputBorderPixels("0");
    setInputBorderPercent(event.target.value);
  }

  /**
   *
   * @param event - evento del input de color de borde
   */
  function handleInputBorderColor(event: React.ChangeEvent<HTMLInputElement>) {
    setInputBorderColor(event.target.value);
  }

  /**
   *
   * @param event - evento del input box de borde en pixels
   */
  function handleInputBorderPixelsText(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) {
    setInputBorderPercent("0");
    setInputBorderPixels((event.target as HTMLInputElement).value);
    handleBorderChange({
      BorderColor: inputBorderColor,
      BorderPixels: (event.target as HTMLInputElement).value,
      BorderPercent: "0",
    });
  }

  /**
   *
   * @param event - evento del input box de borde en porcentaje
   */
  function handleInputBorderPercentText(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) {
    setInputBorderPixels("0");
    setInputBorderPercent((event.target as HTMLInputElement).value);
    handleBorderChange({
      BorderColor: inputBorderColor,
      BorderPixels: "0",
      BorderPercent: (event.target as HTMLInputElement).value,
    });
  }

  /**
   * Handler del Mouse Up del input de rango de borde en pixels.
   * Al mover el range, cuando se suelta el botón del mouse, se aplica el borde.
   */
  function handleInputBorderPixelsRangeMouseUp() {
    setInputBorderPercent("0");
    handleBorderChange({
      BorderColor: inputBorderColor,
      BorderPixels: inputBorderPixels,
      BorderPercent: "0",
    });
  }

  /**
   * Handler del Mouse Up del input de rango de borde en porcentaje.
   *
   */
  function handleInputBorderPercentRangeMouseUp() {
    setInputBorderPixels("0");
    handleBorderChange({
      BorderColor: inputBorderColor,
      BorderPixels: "0",
      BorderPercent: inputBorderPercent,
    });
  }

  /**
   * Procedimiento para aplicar el borde a la imagen.
   * @param borderOptions - opciones de borde
   */
  function handleBorderChange(borderOptions: ProcessOptionsType) {
    if (!originalFile) {
      return;
    }
    // El borderOptions como viene lo uso para guardar en processList, ya que el borde en pixels se aplica tal cual a la imagen final con la resolución original. Pero para el small canvas, que es el que se muestra, el borde en pixels se tiene que ajustar a la resolución del canvas.
    let smallCanvasBorderOptions = { ...borderOptions };
    let newBorderPixels = 0;
    if (parseInt(inputBorderPixels) > 0) {
      if (undoImageList[0].width > undoImageList[0].height) {
        newBorderPixels =
          (parseInt(inputBorderPixels) * mainCanvasConfig.maxWidth) /
          originalImg!.width;
      } else {
        newBorderPixels =
          (parseInt(inputBorderPixels) * mainCanvasConfig.maxHeight) /
          originalImg!.height;
      }
    }
    smallCanvasBorderOptions.BorderPixels = newBorderPixels.toString();

    // Puede pasar que el cambio de borde se haga por primera vez o que ya se esté trabajando en eso y no sea la primera modificación. La idea es que si ya se hicieron modificaciones y se vuelve a modificar, se descarta la última modificación y se agrega la nueva, de forma tal que no se acumulen bordes. Por ejemplo, si se aplica un borde de 10 pixel y luego se mueve el rango a 20, se descarta el de 10 y se aplica el de 20. Todo esto hasta que se haga click en Apply.

    // Si es primera modificación del borde, se agrega el proceso a processList y se guarda el snapshot de la imagen en undoImageList.
    if (currentProcess === null || undoImageList.length <= 1) {
      setCurrentProcess(ImageProcess.Border);
      let newImageData = applyProcessFunction(
        smallCanvasRef.current,
        imgAddBorder,
        smallCanvasBorderOptions
      );
      setUndoImageList([...undoImageList, newImageData]);
      setProcessList([
        ...processList,
        (imageData) => imgAddBorder(imageData, borderOptions),
      ]);
    }

    // Si ya se vienen haciendo modificaciones al borde (aún no aplicadas) se descarta la última modificación y se agrega la nueva.
    if (currentProcess === ImageProcess.Border && undoImageList.length > 1) {
      const newUndoImageList = [...undoImageList];
      newUndoImageList.pop();
      drawImageDataOnCanvas(
        newUndoImageList[newUndoImageList.length - 1],
        smallCanvasRef.current!
      );

      let newImageData = applyProcessFunction(
        smallCanvasRef.current,
        imgAddBorder,
        smallCanvasBorderOptions
      );
      setUndoImageList([...newUndoImageList, newImageData]);

      const tempProcessList = [...processList];
      tempProcessList.pop();
      setProcessList([
        ...tempProcessList,
        (imageData) => imgAddBorder(imageData, borderOptions),
      ]);
    }
  }

  /**
   * Handler del botón New Image. Vuelve al estado inicial.
   */
  function handleNewImage() {
    console.log("New Image");
    setDisplays((prev) => {
      return { ...prev, canvas: false, form: true };
    });
    setOriginalFile(null);
    setOriginalImg(null);
    setProcessList([]);
    setUndoImageList([]);
    setCurrentProcess(null);
    setInputBorderPixels("0");
    setInputBorderPercent("0");
    setInputBorderColor("#ffffff");
    imagenPreviewRef.current!.src = "";
  }

  return (
    <div className="app-wrapper">
      <main id="app" className={styles.main}>
        <section id="section__image">
          {displays.canvas && (
            <div className="canvas__container">
              <canvas id="canvas-small" ref={smallCanvasRef}></canvas>
            </div>
          )}
          {displays.form && (
            <form
              onClick={handleUploadFormClick}
              onInput={handleUploadFormInput}
              id="form-upload"
            >
              <div
                className="drop-container"
                id="dropcontainer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="drop-title-group">
                  <span className="drop-title">Drop files here</span>
                  <br />
                  <br />
                  <span className="drop-title">or</span>
                  <br />
                  <br />
                  <span className="drop-title">click / tap to upload</span>
                  <br />
                </div>
                <input
                  type="file"
                  id="input-upload"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={inputUploadRef}
                ></input>
              </div>
            </form>
          )}
        </section>
        <section id="section__toolbar">
          <div className="toolbar__top">
            <button id="btnUndo" onClick={handleUndo}>
              Undo
            </button>
            <button onClick={handleNewImage}>New Image</button>

            <button type="button" id="btnDescargar" onClick={handleDownload}>
              Download
            </button>
          </div>
          <div className="toolbar__group-container">
            <details className="toolbar__details">
              <summary className="toolbar__summary">Image Information</summary>
              <div className="toolbar-row">
                <div className="toolbar__image-info">
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
            <details className="toolbar__details">
              <summary className="toolbar__summary">Grayscale</summary>
              <div className="toolbar-row">
                <div className="toolbar-row__buttons">
                  <button
                    type="button"
                    id="btnToBN"
                    onClick={() => handleToGrayscale()}
                  >
                    Convert to Grayscale
                  </button>
                </div>
              </div>
            </details>
            <details className="toolbar__details">
              <summary className="toolbar__summary">Borders</summary>
              <div className="toolbar__borders">
                <div className="toolbar-row ">
                  <div className="toolbar-row__title">Color</div>
                  <div className="toolbar-row__border-color">
                    <input
                      id="inputBorderColor"
                      type="color"
                      list="true"
                      value={inputBorderColor}
                      onChange={handleInputBorderColor}
                    />
                    {/*  <datalist id="colors">
                        <option>#ff0000</option>
                        <option>#0000ff</option>
                        <option>#00ff00</option>
                        <option>#ffff00</option>
                        <option>#00ffff</option>
                      </datalist> */}
                    <input
                      id="inputBorderColorText"
                      type="Text"
                      min="0"
                      value={inputBorderColor}
                      onChange={handleInputBorderColor}
                    ></input>
                  </div>
                </div>
                <div className="toolbar-row ">
                  <div className="toolbar-row__title">Border in percent</div>
                  <div className="toolbar-row__border-ranges">
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
                    <input
                      type="range"
                      id="inputBorderPercent"
                      name="inputBorderPercent"
                      min="0"
                      max="100"
                      value={inputBorderPercent}
                      onChange={handleInputBorderPercent}
                      onMouseUp={handleInputBorderPercentRangeMouseUp}
                    ></input>
                  </div>
                </div>
                <div className="toolbar-row">
                  <div className="toolbar-row__title">Border in pixels</div>
                  <div className="toolbar-row__border-ranges">
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
                    <input
                      type="range"
                      id="inputBorderPixels"
                      name="inputBorderPixels"
                      min="0"
                      ref={inputBorderPixelsRef}
                      value={inputBorderPixels}
                      onChange={handleInputBorderPixelsRange}
                      onMouseUp={handleInputBorderPixelsRangeMouseUp}
                    ></input>
                  </div>
                </div>
                <div className="toolbar-row">
                  <div className="toolbar-row__buttons">
                    <button
                      type="button"
                      id="btnApplyBorder"
                      onClick={handleApplyBorder}
                    >
                      Apply
                    </button>
                    <button
                      type="button"
                      id="btnDiscardBorder"
                      onClick={handleDiscardBorder}
                    >
                      Discard
                    </button>
                  </div>
                </div>
              </div>
            </details>
            <details className="toolbar__details">
              <summary className="toolbar__summary">Changes history</summary>
              <div className="toolbar-row toolbar-undo-list">
                {undoImageList && (
                  <div className="undo-list">
                    {undoImageList.toReversed().map((img, index) => {
                      return (
                        <span key={index}>
                          <img src={`${imageDataToBase64(img)}`.toString()} />
                          {/*  <span>
                          ̣{img.width}-{img.height}
                        </span> */}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </details>
          </div>

          <br />
        </section>
      </main>
    </div>
  );
}
