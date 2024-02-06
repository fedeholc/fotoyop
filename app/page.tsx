"use client";
import styles from "./page.module.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { MutableRefObject, useEffect, useRef, useState } from "react";

import { CanvasConfig, ProcessOptionsType, ProcessFunction } from "./types";
import { Button } from "@radix-ui/themes";

export default function Home() {
  /*   const [mainCanvasConfig, setMainCanvasConfig] = useState<CanvasConfig>({
    maxWidth: 0,
    maxHeight: 0,
  }); */
  const mainCanvasConfig: CanvasConfig = {
    maxWidth: 900,
    maxHeight: 900,
  };

  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalImg, setOriginalImg] = useState<HTMLImageElement | null>(null);
  const [processList, setProcessList] = useState<ProcessFunction[]>([]);

  const smallCanvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagenPreviewRef = useRef<HTMLImageElement | null>(null);
  const smallCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offScreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setOriginalImg(new window.Image() as HTMLImageElement);
    if (smallCanvasRef.current) {
      //smallCanvasRef.current.width = mainCanvasConfig.maxWidth;
      //smallCanvasRef.current.height = mainCanvasConfig.maxHeight;
      smallCanvasCtxRef.current = smallCanvasRef.current.getContext("2d", {
        willReadFrequently: true,
      });
    }
  }, []); // quité mainCanvasConfig de las dependencias mientras no se use

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
          smallCanvasRef.current!.width = newWidth;
          smallCanvasRef.current!.height = newHeight;
          smallCanvasCtxRef.current?.drawImage(
            originalImage,
            0,
            0,
            newWidth,
            newHeight
          );

          if (offScreenCanvasRef.current) {
            offScreenCanvasRef.current.width = originalImage.width;
            offScreenCanvasRef.current.height = originalImage.height;
            offScreenCanvasRef.current
              ?.getContext("2d", {
                willReadFrequently: true,
              })
              ?.drawImage(
                originalImage,
                0,
                0,
                originalImage.width,
                originalImage.height
              );
          }
        };

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
    loadFile(file);
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
    processImage(smallCanvasRef, imgToBN);
    //transformarImagen(offScreenCanvasRef, imgToBN);
    setProcessList([...processList, imgToBN]);
  }

  function handleBorde() {
    /* Para pasar la función imgAddBorder con el objeto de opciones como segundo parámetro a transformarImagen, puedes usar una función de flecha para crear una nueva función que tome un solo argumento ImageData y llame a imgAddBorder con ese argumento y el objeto de opciones. 
    En este código, (imageData) => imgAddBorder(imageData, options) crea una nueva función que toma un solo argumento ImageData y llama a imgAddBorder con ese argumento y el objeto de opciones. Esta nueva función se pasa como segundo argumento a transformarImagen.
    De esta manera, cuando transformarImagen llama a la función que le pasaste, esa función a su vez llama a imgAddBorder con el ImageData y el objeto de opciones.*/
    processImage(
      smallCanvasRef,
      (imageData) => imgAddBorder(imageData, { BorderPercent: "10" }),
      true
    );
    /* transformarImagen(smallCanvasRef, (imageData) => imgAddBorder(imageData, { }) */
    //transformarImagen(offScreenCanvasRef, imgAddBorder);
    setProcessList([
      ...processList,
      (imageData) => imgAddBorder(imageData, { BorderPercent: "10" }),
    ]);
  }

  /**
   * Recibe una imagen en un canvas, y le aplica una transformación.
   * @param canvasRef - referencia al canvas que tiene la imagen que se quiere transformar
   * @param processFunction - función que toma un ImageData y devuelve otro ImageData transformado
   * @param keepMaxSize - si es true, mantiene el tamaño máximo del canvas (el ancho o la altura según cuál sea mayor), si es false, lo ajusta al tamaño de la imagen transformada. Es relevante para funciones de transformación que modifican el tamaño de la imágen, como puede ser agregar un borde.
   */
  function processImage(
    canvasRef: MutableRefObject<HTMLCanvasElement | null>,
    processFunction: ProcessFunction,
    keepMaxSize?: boolean
  ) {
    const ctx = canvasRef.current?.getContext("2d", {
      willReadFrequently: true,
    });
    const originalWidth = canvasRef.current?.width || 0;
    const originalHeight = canvasRef.current?.height || 0;

    const imageData = ctx?.getImageData(
      0,
      0,
      canvasRef.current?.width || 0,
      canvasRef.current?.height || 0
    );

    const newData = processFunction(imageData as ImageData);

    if (!keepMaxSize && canvasRef.current) {
      canvasRef.current.width = newData.width;
      canvasRef.current.height = newData.height;
      ctx?.createImageData(newData.width, newData.height);
      ctx?.putImageData(newData, 0, 0);
    }

    if (keepMaxSize && canvasRef.current) {
      // Si newData es más grande que el canvas original, escalarlo para que encaje
      if (newData.width > originalWidth || newData.height > originalHeight) {
        let finalWidth, finalHeight;

        //determinar tamaño final según orientación de la imagen
        if (originalWidth > originalHeight) {
          finalWidth = originalWidth;
          finalHeight = (originalWidth / newData.width) * newData.height;
        } else {
          finalHeight = originalHeight;
          finalWidth = (originalHeight / newData.height) * newData.width;
        }

        // Crear un canvas temporal y dibujar newData en él
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = newData.width;
        tempCanvas.height = newData.height;
        tempCanvas
          .getContext("2d", {
            willReadFrequently: true,
          })
          ?.putImageData(newData, 0, 0);

        // Dibujar el canvas temporal escalado en el canvas original
        canvasRef.current.width = finalWidth;
        canvasRef.current.height = finalHeight;
        ctx?.clearRect(0, 0, originalWidth, originalHeight);
        ctx?.drawImage(
          tempCanvas,
          0,
          0,
          newData.width,
          newData.height,
          0,
          0,
          finalWidth,
          finalHeight
        );
      } else {
        // Si newData es más pequeño que el canvas original, dibujarlo normalmente
        ctx?.putImageData(newData, 0, 0);
      }
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
    const canvasTemp = document.createElement("canvas") as HTMLCanvasElement;
    const ctxTemp = canvasTemp.getContext("2d", {
      willreadFrequently: true,
    }) as CanvasRenderingContext2D;

    let borderSize = 0,
      borderHeight = 0,
      borderWidth = 0;

    if (options?.BorderPercent) {
      borderSize = parseInt(options.BorderPercent);
      borderWidth = (imageData.width * borderSize) / 100;
      borderHeight = (imageData.height * borderSize) / 100;
    }

    if (options?.BorderPixels) {
      borderSize = parseInt(options.BorderPixels) * 2;
      borderWidth = borderSize;
      borderHeight = borderSize;
    }

    canvasTemp.width = imageData.width + borderWidth;
    canvasTemp.height = imageData.height + borderHeight;

    const backgroundImageData = ctxTemp?.createImageData(
      imageData.width + borderWidth || 0,
      imageData.height + borderHeight || 0
    );

    if (backgroundImageData) {
      for (let i = 0; i < backgroundImageData.data.length; i += 4) {
        backgroundImageData.data[i] = 128; // red
        backgroundImageData.data[i + 1] = 128; // green
        backgroundImageData.data[i + 2] = 128; // blue
        backgroundImageData.data[i + 3] = 255; // alpha (transparency)
      }

      ctxTemp?.putImageData(backgroundImageData, 0, 0);
      ctxTemp?.putImageData(imageData, borderWidth / 2, borderHeight / 2);
    }

    const resultImageData = ctxTemp?.getImageData(
      0,
      0,
      imageData.width + borderWidth,
      imageData.height + borderHeight
    ) as ImageData;

    return resultImageData;
  }

  function imgToBN(imageData: ImageData): ImageData {
    let imageDataCopy: ImageData | null = null;
    if (imageData) {
      imageDataCopy = new ImageData(
        new Uint8ClampedArray(imageData.data),
        imageData.width,
        imageData.height
      );
    }
    if (imageDataCopy) {
      const data = imageDataCopy.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
      }
    }
    return imageDataCopy as ImageData;
  }

  function handleDownload() {
    processList.forEach((transform) => {
      processImage(offScreenCanvasRef, transform);
    });

    const dataURL = offScreenCanvasRef.current?.toDataURL("image/jpeg", 1); // Especifica el formato JPEG

    const enlaceDescarga = document.createElement("a");
    enlaceDescarga.href = dataURL || "";
    enlaceDescarga.download = "mi_dibujo.jpg"; // Extensión del archivo

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

    if (files.length > 0) {
      loadFile(files[0]);
    }
  }
  return (
    <Theme
      accentColor="crimson"
      /*       appearance="dark"
       */ grayColor="sand"
      radius="large"
    >
      <main id="app" className={styles.main}>
        <div className="canvas__container">
          <canvas id="canvas-small" ref={smallCanvasRef}></canvas>
        </div>
        <form onInput={handleFormInput} id="form-upload">
          <label
            htmlFor="imagenInput"
            className="drop-container"
            id="dropcontainer"
            onDrop={handleDrop}
            onDragOver={(event) => event.preventDefault()}
          >
            <span className="drop-title">Drop files here</span>
            or <input type="file" id="input-upload" accept="image/*"></input>
          </label>

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
        </form>

        <div className="toolbar">
          <button type="button" id="btnBorde" onClick={() => handleBorde()}>
            borde
          </button>
          <button type="button" id="btnToBN" onClick={() => handleToBN()}>
            a BN
          </button>
          <Button
            type="button"
            variant="surface"
            id="btnDescargar"
            onClick={() => handleDownload()}
          >
            descargar
          </Button>
        </div>
        <canvas id="canvas2" hidden ref={offScreenCanvasRef}></canvas>
      </main>
    </Theme>
  );
}
