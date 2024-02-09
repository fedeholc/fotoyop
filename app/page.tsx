"use client";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import { CanvasConfig, ProcessFunction, DisplaySections } from "./types";
import {
  imgToBW,
  imgAddBorder,
  getImageFromFile,
  drawImageB64OnCanvas,
  applyProcessFunction,
  processImgToCanvas,
} from "./imageProcessing";

export default function Home() {
  const [displays, setDisplays] = useState<DisplaySections>({
    canvas: false,
    form: true,
  });

  const mainCanvasConfig: CanvasConfig = {
    maxWidth: 800,
    maxHeight: 800,
  };

  const [inputBorderPixels, setInputBorderPixels] = useState<string>("0");
  const [inputBorderPercent, setInputBorderPercent] = useState<string>("0");
  const [inputBorderColor, setInputBorderColor] = useState<string>("#ffffff");

  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalImg, setOriginalImg] = useState<HTMLImageElement | null>(null);
  const [processList, setProcessList] = useState<ProcessFunction[]>([]);

  const inputUploadRef = useRef<HTMLInputElement | null>(null);
  const smallCanvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagenPreviewRef = useRef<HTMLImageElement | null>(null);
  const smallCanvasRef = useRef<HTMLCanvasElement | null>(null);

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
    }
  }

  async function handleUploadFormInput(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    const file = (event.target as HTMLFormElement).files[0];
    loadFileProcedure(file as File);
  }

  function handleToBN() {
    applyProcessFunction(smallCanvasRef.current, imgToBW);
    setProcessList([...processList, imgToBW]);
  }

  function handleBorde() {
    /* Para pasar la función imgAddBorder con el objeto de opciones como segundo parámetro a processImage, se usa una arrow function para crear una nueva función que tome un solo argumento ImageData y llame a imgAddBorder con ese argumento y el objeto de opciones. 
    En este código, (imageData) => imgAddBorder(imageData, options) crea una nueva función que toma un solo argumento ImageData y llama a imgAddBorder con ese argumento y el objeto de opciones. Esta nueva función se pasa como segundo argumento a processImage.
    De esta manera, cuando processImage llama a la función que le pasaste, esa función a su vez llama a imgAddBorder con el ImageData y el objeto de opciones.*/
    applyProcessFunction(smallCanvasRef.current, (imageData) =>
      imgAddBorder(imageData, {
        BorderPercent: inputBorderPercent,
        BorderPixels: inputBorderPixels,
        BorderColor: inputBorderColor,
      })
    );

    setProcessList([
      ...processList,
      (imageData) =>
        imgAddBorder(imageData, {
          BorderPercent: inputBorderPercent,
          BorderPixels: inputBorderPixels,
          BorderColor: inputBorderColor,
        }),
    ]);
  }

  /**
   * Procedimiento para generar la imagen procesada y enviarla como descarga.
   */
  function handleDownload() {
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
   * Cuando se suelta un archivo en el area de drop, se llama al procedimiento de carga de archivo.
   * @param event 
   */
  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
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
   * Simula el click en el input de tipo file para abrir el explorador de archivos.
   */
  function handleUploadFormClick() {
    inputUploadRef.current?.click();
  }

  /**
   * Cambia el CSS del area de drop cuando el mouse sobre ellos.
   * @param event
   */
  function handleDragOver(event: React.DragEvent<HTMLLabelElement>) {
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
  function handleDragLeave(event: React.DragEvent<HTMLLabelElement>) {
    let dropTitles = document.querySelectorAll(".drop-title");
    dropTitles.forEach((title) => {
      title.classList.remove("drop-title-dragover");
    });
    let dropContainer = document.querySelector(".drop-container");
    dropContainer?.classList.remove("drop-container-dragover");
  }

  return (
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
            <label
              htmlFor="imagenInput"
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
            </label>
          </form>
        )}

        <div>
          <div>
            <div>Original image.</div>
            <div>Name: {originalFile?.name} </div>
            <div>Size: {originalFile?.size} bytes.</div>
            <div>
              Size: {originalImg?.width} x {originalImg?.height} px.
            </div>
          </div>
          <img
            id="imagenPreview"
            style={{ maxWidth: "300px", maxHeight: "300px" }}
            ref={imagenPreviewRef}
          ></img>
        </div>
      </section>

      <section id="section__toolbar">
        <div className="toolbar">
          <button type="button" id="btnToBN" onClick={() => handleToBN()}>
            a BN
          </button>
          <button
            type="button"
            id="btnDescargar"
            onClick={() => handleDownload()}
          >
            descargar
          </button>
        </div>
        <details className="toolbar__details">
          <summary className="toolbar__summary">Borders</summary>
          <button type="button" id="btnBorde" onClick={() => handleBorde()}>
            borde
          </button>
          <input
            type="range"
            id="inputBorderPercent"
            name="inputBorderPercent"
            min="0"
            max="100"
            value={inputBorderPercent}
            onChange={(e) => setInputBorderPercent(e.target.value)}
          ></input>
          {inputBorderPercent}%
          <input
            type="range"
            id="inputBorderPixels"
            name="inputBorderPixels"
            min="0"
            max="100"
            value={inputBorderPixels}
            onChange={(e) => setInputBorderPixels(e.target.value)}
          ></input>
          {inputBorderPixels}px
          <input
            type="color"
            list="true"
            value={inputBorderColor}
            onChange={(e) => setInputBorderColor(e.target.value)}
          />
          {inputBorderColor}
          {/*  <datalist id="colors">
            <option>#ff0000</option>
            <option>#0000ff</option>
            <option>#00ff00</option>
            <option>#ffff00</option>
            <option>#00ffff</option>
          </datalist> */}
        </details>
        {/*<canvas id="canvas2" hidden ref={offScreenCanvasRef}></canvas>*/}
      </section>
    </main>
  );
}
