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
    maxWidth: 800,
    maxHeight: 800,
  };

  const [inputBorderPixels, setInputBorderPixels] = useState<string>("0");
  const [inputBorderPercent, setInputBorderPercent] = useState<string>("0");
  const [inputBorderColor, setInputBorderColor] = useState<string>("#ffffff");

  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalImg, setOriginalImg] = useState<HTMLImageElement | null>(null);
  const [processList, setProcessList] = useState<ProcessFunction[]>([]);

  const [undoImageList, setUndoImageList] = useState<ImageData[]>([]);

  const [addingBorder, setAddingBorder] = useState<boolean>(false);

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
  function handleToBN() {
    applyProcessFunction(smallCanvasRef.current, imgToBW);
    setProcessList([...processList, imgToBW]);

    let newImageData = processToNewImageData(smallCanvasRef.current, imgToBW);

    let newUndoImageList = [...undoImageList, newImageData];
    setUndoImageList(newUndoImageList);
    console.log("addingBorder, undoImageList en BN:", undoImageList);
    console.log("addingBorder, newundoImageList:", newUndoImageList);
  }

  /**
   * Handler del click en agregar borde.
   */
  function handleBorde() {
    /* let newImageData = applyProcessFunction(
      smallCanvasRef.current,
      imgAddBorder,
      {
        BorderPercent: inputBorderPercent,
        BorderPixels: inputBorderPixels,
        BorderColor: inputBorderColor,
      }
    );

    setUndoImageList([...undoImageList, newImageData]);

    setProcessList([
      ...processList,
      (imageData) =>
        imgAddBorder(imageData, {
          BorderPercent: inputBorderPercent,
          BorderPixels: inputBorderPixels,
          BorderColor: inputBorderColor,
        }),
    ]); */

    setAddingBorder(false);
    //todo FIXME: ojo, si se sale de la parte de edición de borde para hacer otra cosa también hay que hacer el set addingBorder a false
    //todo tal vez mejor que en lugar de tener un addingborder, es decir, una variable por cada proceso, se podría tener una que diga cuál se está aplicando, ejemplo: processInAction: "border", de modo que cuando cambia a otro, ya está listo el anterior.
    //FIXME: //todo: otro problema, cuando se aplica el border pixel, ej 100px, le pone 100 al small canvas y luego le pone 100 a la imagen final, esto último está bien pero al small debería ser proporcional.
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

  function handleInputBorderPixels(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    setInputBorderPixels(event.target.value);
    /*    applyProcessFunction(smallCanvasRef.current, imgAddBorder, {
      BorderPercent: inputBorderPercent,
      BorderPixels: inputBorderPixels,
      BorderColor: inputBorderColor,
    }); */
    /*  setProcessList([
      ...processList,
      (imageData) =>
        imgAddBorder(imageData, {
          BorderPercent: inputBorderPercent,
          BorderPixels: inputBorderPixels,
          BorderColor: inputBorderColor,
        }),
    ]); */
  }
  async function handleInputMouseUp(event: React.MouseEvent<HTMLInputElement>) {
    //todo: un cambio de color del borde también debería venir acá?
    console.log("up:", inputBorderPixels);
    if (addingBorder === true) {
      //handleBorde();

      const newUndoImageList = [...undoImageList];
      if (undoImageList.length > 1) {
        newUndoImageList.pop();
        setUndoImageList(newUndoImageList);
        drawImageDataOnCanvas(
          newUndoImageList[newUndoImageList.length - 1],
          smallCanvasRef.current!
        );

        const newProcessList = [...processList];
        newProcessList.pop();
        setProcessList(newProcessList);
        console.log("addingBorder, undoImageList1:", undoImageList);
        console.log("addingBorder, newimagelist:", newUndoImageList);
      }

      let newImageData = applyProcessFunction(
        smallCanvasRef.current,
        imgAddBorder,
        {
          BorderPercent: inputBorderPercent,
          BorderPixels: inputBorderPixels,
          BorderColor: inputBorderColor,
        }
      );

      setUndoImageList([...newUndoImageList, newImageData]);

      setProcessList([
        ...processList,
        (imageData) =>
          imgAddBorder(imageData, {
            BorderPercent: inputBorderPercent,
            BorderPixels: inputBorderPixels,
            BorderColor: inputBorderColor,
          }),
      ]);
    } else if (addingBorder === false) {
      setAddingBorder(true);
      let newImageData = applyProcessFunction(
        smallCanvasRef.current,
        imgAddBorder,
        {
          BorderPercent: inputBorderPercent,
          BorderPixels: inputBorderPixels,
          BorderColor: inputBorderColor,
        }
      );

      let newUndoImageList = [...undoImageList, newImageData];
      setUndoImageList(newUndoImageList);
      console.log("addingBorder, undoImageList2:", undoImageList);
      console.log("addingBorder, newundoImageList:", newUndoImageList);

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

    //handleBorde();
  }

  function handleUndo() {
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
      console.log("en undo, undoimagelist:", undoImageList);
      console.log("en undo, undoimagelist:", newUndoImageList);
    }
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
          <button id="btnUndo" onClick={handleUndo}>
            Undo
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
            onChange={handleInputBorderPixels}
            onMouseUp={handleInputMouseUp}
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
        <div className="undoList">
          {undoImageList.map((img, index) => {
            return (
              <span key={index}>
                <img width={150} src={`${imageDataToBase64(img)}`.toString()} />
                <span>
                  ̣{img.width}-{img.height}
                </span>
              </span>
            );
          })}
        </div>
      </section>
    </main>
  );
}
