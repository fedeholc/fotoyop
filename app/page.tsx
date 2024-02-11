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
    maxWidth: 400,
    maxHeight: 400,
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
    console.log("holiX");
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

  function handleDiscardBorder() {
    const newUndoImageList = [...undoImageList];
    if (currentProcess === ImageProcess.Border && undoImageList.length > 1) {
      newUndoImageList.pop();
      setUndoImageList(newUndoImageList);

      //setUndoImageList(newUndoImageList);
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
    //? en lugar de trabajar todo esto del undo con la lista de imagenes, el canvas, etc., tal vez mejor tener otro canvas para  mostrar las modificaciones de borde (tal vez con un dialog?) y que luego se plique al canvas principal???
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
    console.log(processList);
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
   * Simula el click en el input de tipo file para abrir el explorador de archivos.
   */
  function handleUploadFormClick() {
    inputUploadRef.current?.click();
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

  function handleInputBorderPixelsRange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    console.log(event.target.value);
    setInputBorderPercent("0");
    setInputBorderPixels(event.target.value);
  }

  async function handleInputMouseUp() {
    //todo: un cambio de color del borde también debería venir acá?
    console.log("up:", inputBorderPixels);
    console.log("img original:", originalImg);
    console.log("Img0:", undoImageList[0]);

    let newBorderPixels = 0;
    if (parseInt(inputBorderPixels) > 0) {
      if (undoImageList[0].width > undoImageList[0].height) {
        newBorderPixels =
          (parseInt(inputBorderPixels) * 100) / originalImg!.width;
      } else {
        newBorderPixels =
          (parseInt(inputBorderPixels) * 100) / originalImg!.height;
      }
      console.log("newBorderPixels:", newBorderPixels);
    }

    if (currentProcess === ImageProcess.Border) {
      //handleBorde();

      const newUndoImageList = [...undoImageList];
      if (undoImageList.length > 1) {
        newUndoImageList.pop();
        //setUndoImageList(newUndoImageList);
        drawImageDataOnCanvas(
          newUndoImageList[newUndoImageList.length - 1],
          smallCanvasRef.current!
        );

        const tempProcessList = [...processList];
        tempProcessList.pop();
        //setProcessList(newProcessList);

        let newImageData = applyProcessFunction(
          smallCanvasRef.current,
          imgAddBorder,
          {
            BorderPercent: inputBorderPercent,
            BorderPixels: newBorderPixels.toString(),
            BorderColor: inputBorderColor,
          }
        );

        setUndoImageList([...newUndoImageList, newImageData]);

        let newProcessList: ProcessFunction[] = [
          ...tempProcessList,
          (imageData) =>
            imgAddBorder(imageData, {
              BorderPercent: inputBorderPercent,
              BorderPixels: inputBorderPixels,
              BorderColor: inputBorderColor,
            }),
        ];

        setProcessList(newProcessList);

        console.log("addingBorder, undoImageList1:", undoImageList);
        console.log("addingBorder, newimagelist:", newUndoImageList);
        console.log("new processList:", tempProcessList);
      } else {
        let newImageData = applyProcessFunction(
          smallCanvasRef.current,
          imgAddBorder,
          {
            BorderPercent: inputBorderPercent,
            BorderPixels: newBorderPixels.toString(),
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
      }
    } else if (currentProcess === null) {
      setCurrentProcess(ImageProcess.Border);
      let newImageData = applyProcessFunction(
        smallCanvasRef.current,
        imgAddBorder,
        {
          BorderPercent: inputBorderPercent,
          BorderPixels: newBorderPixels.toString(),
          BorderColor: inputBorderColor,
        }
      );

      let newUndoImageList = [...undoImageList, newImageData];
      setUndoImageList(newUndoImageList);

      let newProcessList: ProcessFunction[] = [
        ...processList,
        (imageData) =>
          imgAddBorder(imageData, {
            BorderPercent: inputBorderPercent,
            BorderPixels: inputBorderPixels,
            BorderColor: inputBorderColor,
          }),
      ];
      setProcessList(newProcessList);
      console.log("addingBorder, undoImageList2:", undoImageList);
      console.log("addingBorder, newundoImageList:", newUndoImageList);
      console.log("process list:", processList);
      console.log("new processList:", newProcessList);
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

  function handleInputBorderPercent(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setInputBorderPixels("0");
    setInputBorderPercent(event.target.value);
  }

  function handleInputBorderColor(event: React.ChangeEvent<HTMLInputElement>) {
    setInputBorderColor(event.target.value);
  }

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

  function handleInputBorderPixelsRangeMouseUp() {
    setInputBorderPercent("0");
    handleBorderChange({
      BorderColor: inputBorderColor,
      BorderPixels: inputBorderPixels,
      BorderPercent: "0",
    });
  }
  function handleInputBorderPercentRangeMouseUp() {
    setInputBorderPixels("0");
    handleBorderChange({
      BorderColor: inputBorderColor,
      BorderPixels: "0",
      BorderPercent: inputBorderPercent,
    });
  }

  function handleBorderChange(borderOptions: ProcessOptionsType) {
    console.log("options", borderOptions);
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
    console.log("smallCanvasBorderOptions:", smallCanvasBorderOptions);
    if (currentProcess === ImageProcess.Border) {
      const newUndoImageList = [...undoImageList];
      if (undoImageList.length > 1) {
        newUndoImageList.pop();
        drawImageDataOnCanvas(
          newUndoImageList[newUndoImageList.length - 1],
          smallCanvasRef.current!
        );

        const tempProcessList = [...processList];
        tempProcessList.pop();

        let newImageData = applyProcessFunction(
          smallCanvasRef.current,
          imgAddBorder,
          smallCanvasBorderOptions
        );

        setUndoImageList([...newUndoImageList, newImageData]);

        let newProcessList: ProcessFunction[] = [
          ...tempProcessList,
          (imageData) => imgAddBorder(imageData, borderOptions),
        ];

        setProcessList(newProcessList);
      } else {
        let newImageData = applyProcessFunction(
          smallCanvasRef.current,
          imgAddBorder,
          smallCanvasBorderOptions
        );

        setUndoImageList([...newUndoImageList, newImageData]);

        setProcessList([
          ...processList,
          (imageData) => imgAddBorder(imageData, borderOptions),
        ]);
      }
    } else if (currentProcess === null) {
      setCurrentProcess(ImageProcess.Border);
      let newImageData = applyProcessFunction(
        smallCanvasRef.current,
        imgAddBorder,
        smallCanvasBorderOptions
      );

      let newUndoImageList = [...undoImageList, newImageData];
      setUndoImageList(newUndoImageList);

      let newProcessList: ProcessFunction[] = [
        ...processList,
        (imageData) => imgAddBorder(imageData, borderOptions),
      ];
      setProcessList(newProcessList);
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
          <div className="toolbar__borders">
            <div className="flex-col">
              <div>Border in percent</div>

              <div className="flex-row gap05">
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

                <input
                  type="number"
                  id="inputBorderPercentN"
                  name="inputBorderPercentN"
                  min="0"
                  value={inputBorderPercent}
                  onKeyUp={handleInputBorderPercentText}
                  onChange={handleInputBorderPercentText}
                ></input>
                <div>
                  {inputBorderPercent}%{" "}
                  {originalImg &&
                    (originalImg!.width / 100) * parseInt(inputBorderPercent)}
                  px
                </div>
              </div>
            </div>
            <div className="flex-col">
              <div>Border in pixels</div>
              <div className="flex-row gap05">
                <input
                  type="range"
                  id="inputBorderPixels"
                  name="inputBorderPixels"
                  min="0"
                  max="1920"
                  value={inputBorderPixels}
                  onChange={handleInputBorderPixelsRange}
                  onMouseUp={handleInputBorderPixelsRangeMouseUp}
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
                <div>px</div>
              </div>
            </div>
            <div>
              <input
                type="color"
                list="true"
                value={inputBorderColor}
                onChange={handleInputBorderColor}
              />
              {inputBorderColor}
              {/*  <datalist id="colors">
                <option>#ff0000</option>
                <option>#0000ff</option>
                <option>#00ff00</option>
                <option>#ffff00</option>
                <option>#00ffff</option>
              </datalist> */}
            </div>
            <div>
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
