"use client";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import { CanvasConfig } from "./types";
import {
  getImageFromFile,
  drawImageB64OnCanvas,
  imageB64ToImageData,
} from "./imageProcessing";
import { BottomToolbar } from "./components/toolbar";
import { SideToolbar } from "./components/sideToolbar";
import { ImageContext } from "./providers/ImageProvider";
import { ProcessContext } from "./providers/ProcessProvider";
import { useContext } from "react";
import BorderProvider from "./providers/BorderProvider";
import ToolbarProvider from "./providers/ToolbarProvider";

export const mainCanvasConfig: CanvasConfig = {
  maxWidth: 600,
  maxHeight: 600,
};

export default function App() {
  const {
    originalFile,
    originalImg,
    setOriginalFile,
    setOriginalImg,
    smallCanvasRef,
    imagenPreviewRef,
    displays,
    setDisplays,
  } = useContext(ImageContext);

  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
    mobileToolbarHeight: 0,
    mobileToolbarWidth: 0,
  });

  const { setUndoImageList, undoImageList } = useContext(ProcessContext);

  const inputUploadRef = useRef<HTMLInputElement | null>(null);

  /**
   * Función que calcula un nuevo tamaño para la imagen del small canvas teniendo en cuenta el tamaño de la ventana.
   * @param imageWidth - ancho de la imagen original
   * @param imageHeight - alto de la imagen original
   * @returns - ancho y alto de la imagen redimensionada
   */
  function calcResize(
    imageWidth: number,
    imageHeight: number
  ): { newWidth: number; newHeight: number } {
    let ratio = imageWidth / imageHeight;
    let newWidth = 0;
    let newHeight = 0;

    console.log("imageWidth: ", imageWidth);
    console.log("imageHeight: ", imageHeight);
    console.log("windowDimensions: ", windowDimensions);
    console.log("ratio: ", ratio);
    // horizontal
    if (ratio > 1) {
      if (windowDimensions.width < mainCanvasConfig.maxWidth + 32) {
        newWidth = windowDimensions.width - 32;
      } else {
        newWidth = mainCanvasConfig.maxWidth - 32;
      }
      newHeight = newWidth / ratio;

      if (
        newHeight >
        windowDimensions.height - windowDimensions.mobileToolbarHeight - 32
      ) {
        newHeight =
          windowDimensions.height - windowDimensions.mobileToolbarHeight - 32; // 32 por el margin 1rem del canvas container
        newWidth = newHeight * ratio;
      }
    }
    // vertical
    else {
      if (
        windowDimensions.height - windowDimensions.mobileToolbarHeight - 32 <
        mainCanvasConfig.maxHeight
      ) {
        newHeight =
          windowDimensions.height - windowDimensions.mobileToolbarHeight - 32;
      } else {
        newHeight = mainCanvasConfig.maxHeight - 32;
      }
      newWidth = newHeight * ratio;

      if (newWidth > windowDimensions.width) {
        newWidth = windowDimensions.width;
        newHeight = newWidth / ratio;
      }
    }
    console.log("newWidth: ", newWidth);
    console.log("newHeight: ", newHeight);

    return { newWidth, newHeight };
  }

  useEffect(() => {
    setOriginalImg(new window.Image() as HTMLImageElement);
    if (smallCanvasRef.current) {
      smallCanvasRef.current.getContext("2d", {
        willReadFrequently: true,
      });
    }

    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
      mobileToolbarHeight:
        document.querySelector("#section__mobile")?.clientHeight || 0,
      mobileToolbarWidth:
        document.querySelector("#section__mobile")?.clientWidth || 0,
    });
  }, [displays]);
  //el useEffect depende de displays porque oculta/muestra el canvas

  // resize
  useEffect(() => {
    if (smallCanvasRef.current && originalImg && undoImageList.length > 0) {
      const { newWidth, newHeight } = calcResize(
        undoImageList[undoImageList.length - 1].width,
        undoImageList[undoImageList.length - 1].height
      );

      document
        .querySelector(".canvas__container")
        ?.setAttribute("style", `width: ${newWidth}px; height: ${newHeight}px`); //todo: usar una ref?
    }
  }, [windowDimensions, undoImageList]);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
        mobileToolbarHeight:
          document.querySelector("#section__mobile")?.clientHeight || 0,
        mobileToolbarWidth:
          document.querySelector("#section__mobile")?.clientWidth || 0,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * Pasos a seguir cuando se carga un archivo de imagen.
   * @param file - archivo de imagen
   * @returns
   */
  async function loadFileProcedure(file: File) {
    setDisplays((prev) => {
      return { canvas: true, form: false };
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
        /*      if (newImageElement.width > newImageElement.height) {
          inputBorderPixelsRef.current!.max = newImageElement.width.toString();
        } else {
          inputBorderPixelsRef.current!.max = newImageElement.height.toString();
        } */ //TODO: esto hay que pasarlo al useEffect de la toolbar

        const { newWidth, newHeight } = calcResize(
          newImageElement.width,
          newImageElement.height
        );

        drawImageB64OnCanvas(
          originalImageB64,
          smallCanvasRef.current as HTMLCanvasElement,
          newWidth,
          newHeight
        );

        if (imagenPreviewRef.current) {
          imagenPreviewRef.current.src = originalImageB64;
        }
      };
      setOriginalImg(newImageElement);
      setUndoImageList([
        (await imageB64ToImageData(
          originalImageB64,
          mainCanvasConfig.maxWidth,
          mainCanvasConfig.maxHeight
        )) as ImageData,
      ]);
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
                  <span className="drop-title unselectable">
                    Drop files here
                  </span>
                  <br />
                  <br />
                  <span className="drop-title unselectable">or</span>
                  <br />
                  <br />
                  <span className="drop-title unselectable">
                    click / tap to upload
                  </span>
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

        <ToolbarProvider>
          <BorderProvider>
            <section id="section__toolbar">
              <SideToolbar></SideToolbar>
            </section>
            <section id="section__mobile">
              <BottomToolbar></BottomToolbar>
            </section>
          </BorderProvider>
        </ToolbarProvider>
      </main>
    </div>
  );
}
