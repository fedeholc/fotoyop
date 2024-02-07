"use client";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import {
  CanvasConfig,
  ProcessOptionsType,
  ProcessFunction,
  DisplaySections,
} from "./types";
import { imgToBW } from "./imageProcessing";
import { resolve } from "path";

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

  async function getImageFromFile(file: File) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("No file provided"));
      }
      if (!file.type.startsWith("image/")) {
        reject(new Error(`${file.name} is not an image.`));
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error("Error al leer el archivo"));
        }
      };
      reader.onerror = function () {
        reject(new Error("Error al leer el archivo"));
      };

      reader.readAsDataURL(file);
    });
  }

  async function loadFile(file: File) {
    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert(file.name + " is not an image.");
      return;
    }

    if (file) {
      const reader = new FileReader();
      const originalImage = new window.Image();

      const loadEventPromise = new Promise<Event>((resolve) => {
        reader.onload = resolve;
      });

      reader.readAsDataURL(file);
      await loadEventPromise;
      setOriginalFile(file);

      if (reader.result) {
        originalImage.onload = function () {
          setOriginalImg(originalImage);

          const { newWidth, newHeight } = calcularTamañoImagen(
            mainCanvasConfig,
            originalImage.width,
            originalImage.height
          );
          //todo: al hacer un resize de la ventana me cambia el tamaño del canvas? si es así tiene sentido? el max del config tiene que ser el max al que voy a mostrar el canvas?

          //adapta el tamaño del canvas al de la imagen (ojo, antes adapto el tamaño al max widht/height, de ahí salen los valores de newWidth y newHeight)
          if (smallCanvasRef.current) {
            smallCanvasRef.current.width = newWidth;
            smallCanvasRef.current.height = newHeight;
          }
          smallCanvasCtxRef.current?.drawImage(
            originalImage,
            0,
            0,
            newWidth,
            newHeight
          );
        };
        console.log("reader result:", reader.result);
        //reader.result tiene la imagen en formato base64
        originalImage.src = reader.result as string;

        if (imagenPreviewRef.current) {
          imagenPreviewRef.current.src = reader.result as string;
        }
      }
    }
  }
  async function handleFormInput(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    const file = (event.target as HTMLFormElement).files[0];

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

      const originalImageElement = new window.Image();

      originalImageElement.onload = function () {
        setOriginalImg(originalImageElement);

        const { newWidth, newHeight } = calcularTamañoImagen(
          mainCanvasConfig,
          originalImageElement.width,
          originalImageElement.height
        );

        //adapta el tamaño del canvas al de la imagen (ojo, antes adapto el tamaño al max widht/height, de ahí salen los valores de newWidth y newHeight)
        if (smallCanvasRef.current) {
          smallCanvasRef.current.width = newWidth;
          smallCanvasRef.current.height = newHeight;
        }
        smallCanvasCtxRef.current?.drawImage(
          originalImageElement,
          0,
          0,
          newWidth,
          newHeight
        );
      };

      originalImageElement.src = originalImageB64;

      console.log(originalImageB64, originalImageElement, smallCanvasRef);

      if (imagenPreviewRef.current) {
        imagenPreviewRef.current.src = originalImageB64;
      }
      //loadFile(file);
      //todo: juntar esto de acá con el handleDrop para no repetir código
    }
  }

  function calcularTamañoImagen(
    canvasData: CanvasConfig,
    imageWidth: number,
    imageHeight: number
  ): { newWidth: number; newHeight: number } {
    const aspectRatio = imageWidth / imageHeight;
    let newWidth = 0,
      newHeight = 0;

    //horizontal
    if (aspectRatio > 1) {
      newWidth = canvasData.maxWidth;
      newHeight = canvasData.maxWidth / aspectRatio;
    } else {
      newHeight = canvasData.maxHeight;
      newWidth = canvasData.maxHeight * aspectRatio;
    }
    return { newWidth, newHeight };
  }

  function handleToBN() {
    processImage(smallCanvasRef.current, imgToBW);

    setProcessList([...processList, imgToBW]);
  }

  function handleBorde() {
    /* Para pasar la función imgAddBorder con el objeto de opciones como segundo parámetro a processImage, puedes usar una función de flecha para crear una nueva función que tome un solo argumento ImageData y llame a imgAddBorder con ese argumento y el objeto de opciones. 
    En este código, (imageData) => imgAddBorder(imageData, options) crea una nueva función que toma un solo argumento ImageData y llama a imgAddBorder con ese argumento y el objeto de opciones. Esta nueva función se pasa como segundo argumento a processImage.
    De esta manera, cuando processImage llama a la función que le pasaste, esa función a su vez llama a imgAddBorder con el ImageData y el objeto de opciones.*/
    processImage(smallCanvasRef.current, (imageData) =>
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
   * Recibe una imagen en un canvas, y le aplica una transformación.
   * @param canvasRef - referencia al canvas que tiene la imagen que se quiere transformar
   * @param processFunction - función que toma un ImageData y devuelve otro ImageData transformado
   * @param keepMaxSize - si es true, mantiene el tamaño máximo del canvas (el ancho o la altura según cuál sea mayor), si es false, lo ajusta al tamaño de la imagen transformada. Es relevante para funciones de transformación que modifican el tamaño de la imágen, como puede ser agregar un borde.
   */
  function processImage(
    canvas: OffscreenCanvas | HTMLCanvasElement | null,
    processFunction: ProcessFunction
  ) {
    const ctx = canvas?.getContext("2d", {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;

    const imageData = ctx?.getImageData(
      0,
      0,
      canvas?.width || 0,
      canvas?.height || 0
    ) as ImageData;

    const newData = processFunction(imageData as ImageData);

    if (canvas) {
      canvas.width = newData.width;
      canvas.height = newData.height;
      ctx?.createImageData(newData.width, newData.height);
      ctx?.putImageData(newData, 0, 0);
    }
  }

  //
  //* Poner las options como ENUMS
  //todo: poner tamaño y color de borde como parámetros
  //! ojo que si el parámetro del borde es en pixels no es lo mismo 100px para la imagen pequeña que para la imagen final.
  //
  function imgAddBorder(
    imageData: ImageData,
    options?: ProcessOptionsType
  ): ImageData {
    let borderSize = 0,
      borderHeight = 0,
      borderWidth = 0;

    let borderColor = "#ffffff";

    if (options?.BorderPixels && parseInt(options?.BorderPixels) > 0) {
      borderSize = parseInt(options.BorderPixels) * 2;
      borderWidth = borderSize;
      borderHeight = borderSize;
    } else {
      if (options?.BorderPercent) {
        borderSize = parseInt(options.BorderPercent);
        borderWidth = (imageData.width * borderSize) / 100;
        borderHeight = (imageData.height * borderSize) / 100;
      }
    }

    if (options?.BorderColor) {
      borderColor = options.BorderColor;
    }

    const canvasTemp = new OffscreenCanvas(
      imageData.width + borderWidth,
      imageData.height + borderHeight
    );
    const ctxTemp = canvasTemp.getContext("2d", {
      willReadFrequently: true,
    }) as OffscreenCanvasRenderingContext2D;

    canvasTemp.width = imageData.width + borderWidth;
    canvasTemp.height = imageData.height + borderHeight;

    ctxTemp.fillStyle = borderColor;
    ctxTemp.fillRect(0, 0, canvasTemp.width, canvasTemp.height);

    ctxTemp.putImageData(imageData, borderWidth / 2, borderHeight / 2);

    const resultImageData = ctxTemp?.getImageData(
      0,
      0,
      imageData.width + borderWidth,
      imageData.height + borderHeight
    ) as ImageData;

    return resultImageData;
  }

  function processForDownload(
    canvas: OffscreenCanvas | HTMLCanvasElement | null
  ) {
    const ctx = canvas?.getContext("2d", {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;

    const imageData = ctx?.getImageData(
      0,
      0,
      canvas?.width || 0,
      canvas?.height || 0
    ) as ImageData;

    let newData = imageData as ImageData;
    processList.forEach((transform) => {
      newData = transform(newData as ImageData);
    });

    if (canvas) {
      canvas.width = newData.width;
      canvas.height = newData.height;
      ctx?.createImageData(newData.width, newData.height);
      ctx?.putImageData(newData, 0, 0);
    }
  }
  function handleDownload() {
    //offcanvas con la imagen original grande
    let newCanvas = new OffscreenCanvas(
      originalImg?.width || 0,
      originalImg?.height || 0
    );
    let newCtx = newCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    newCtx?.drawImage(
      originalImg as HTMLImageElement,
      0,
      0,
      originalImg?.width || 0,
      originalImg?.height || 0
    );
    processForDownload(newCanvas);

    //canvas comun para poner la imagen a exportar
    let canvas = document.createElement("canvas");
    if (newCanvas) {
      canvas.width = newCanvas?.width;
      canvas.height = newCanvas?.height;
    }
    let ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    let bigImageData = newCanvas
      ?.getContext("2d", {
        willReadFrequently: true,
      })
      ?.getImageData(0, 0, newCanvas?.width, newCanvas?.height);

    if (ctx && bigImageData) {
      ctx.createImageData(bigImageData.width, bigImageData.height);
      ctx.putImageData(bigImageData, 0, 0);
    }
    let dataURL = canvas.toDataURL("image/jpeg", 1);

    const enlaceDescarga = document.createElement("a");
    enlaceDescarga.href = dataURL || "";
    enlaceDescarga.download = "mi_dibujo.jpg";

    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);
  }

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

    loadFile(files[0]);
    setDisplays((prev) => {
      return { ...prev, canvas: true, form: false };
    });
  }

  function handleUploadFormClick() {
    inputUploadRef.current?.click();
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
            onInput={handleFormInput}
            id="form-upload"
          >
            <label
              htmlFor="imagenInput"
              className="drop-container"
              id="dropcontainer"
              onDrop={handleDrop}
              onDragOver={(event) => event.preventDefault()}
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
