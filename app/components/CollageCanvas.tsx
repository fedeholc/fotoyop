"use client";
import { ImageContext } from "../providers/ImageProvider";
import { useContext, useRef, useState } from "react";
import {
  getImageFromFile,
  drawImageB64OnCanvas,
  imageB64ToImageData,
} from "../imageProcessing";

import { ProcessContext } from "../providers/ProcessProvider";
import useWindowsSize from "./hooks/useWindowsSize";
import { mainCanvasConfig } from "../App";
import { calcResizeToWindow } from "../imageProcessing";
import upForm from "./UploadForm.module.css";

//TODO: definir el inicio del programa
//? poner visble los botones? dos dropzones distintos? o uno solo y que si hay más de un archivo sea para collage?

export default function CollageCanvas() {
  /*   const { originalImg, smallCanvasRef, displays, mobileToolbarRef } =
    useContext(ImageContext);
  const windowDimensions = useWindowsSize(displays, mobileToolbarRef);
  const { undoImageList } = useContext(ProcessContext); */

  /*   useEffect(() => {
    if (!smallCanvasRef.current) {
      return;
    }
    smallCanvasRef.current.getContext("2d", {
      willReadFrequently: true,
    });
  }, [smallCanvasRef]); */

  /*  useEffect(() => {
    if (smallCanvasRef.current && originalImg && undoImageList.length > 0) {
      const { newWidth, newHeight } = calcResizeToWindow(
        undoImageList[undoImageList.length - 1].width,
        undoImageList[undoImageList.length - 1].height,
        windowDimensions,
        mainCanvasConfig
      );

      document
        .querySelector(".canvas__container")
        ?.setAttribute("style", `width: ${newWidth}px; height: ${newHeight}px`); //todo: usar una ref?
    }
  }, [windowDimensions, undoImageList]); */

  /**
   * Handler del input cuando se sube un archivo.
   * @param event
   */
  async function handleUploadFormInput(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    const files = (event.target as HTMLFormElement).files;
    await loadMultipleFilesProcedure(files as File[]);
    /* setDisplays((prev) => {
      return {
        canvas: true,
        form: false,
        resizeTrigger: !prev.resizeTrigger,
        collage: false,
      };
    }); */
    /* 
    //todo: probar si con este agregado de setDisplays acá se puede quitar el resizeTrigger */
  }

  /**
   * Pasos a seguir cuando se carga un archivo de imagen.
   * @param file - archivo de imagen
   * @returns
   */
  async function loadFileProcedure(file: File) {
    let originalImageB64: string;
    /* setDisplays((prev) => {
      return {
        canvas: true,
        form: false,
        resizeTrigger: !prev.resizeTrigger,
        collage: false,
      };
    }); */
    try {
      originalImageB64 = (await getImageFromFile(file as File)) as string;
    } catch (error) {
      console.error("Error:", error);
      return;
    }

    if (originalImageB64) {
      setOriginalFile(file);

      const newImageElement = new window.Image();
      newImageElement.src = originalImageB64;
      newImageElement.onload = () => {
        const { newWidth, newHeight } = calcResizeToWindow(
          newImageElement.width,
          newImageElement.height,
          windowDimensions,
          mainCanvasConfig
        );

        drawImageB64OnCanvas(
          originalImageB64,
          smallCanvasRef.current as HTMLCanvasElement,
          newWidth,
          newHeight
        );
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

  async function loadMultipleFilesProcedure(files: File[]) {
    /* setDisplays((prev) => {
      return {
        canvas: true,
        form: false,
        resizeTrigger: !prev.resizeTrigger,
        collage: false,
      };
    }); */
    let collageImagesB64: string[] = [];
    console.log(files);
    try {
      for (let i = 0; i < files.length; i++) {
        collageImagesB64.push(
          (await getImageFromFile(files[i] as File)) as string
        );
      }
    } catch (error) {
      console.error("Error:", error);
      return;
    }

    if (files && collageImagesB64) {
      setCollagesFiles(files);
      let imageElements: HTMLImageElement[] = [];

      collageImagesB64.forEach(async (callageImageB64) => {
        const newImageElement = new window.Image();
        newImageElement.src = callageImageB64;
        newImageElement.onload = () => {
          //? creo que por ahora no es necesario
          /* const { newWidth, newHeight } = calcResizeToWindow(
            newImageElement.width,
            newImageElement.height,
            windowDimensions,
            mainCanvasConfig
          ); */
          /* drawImageB64OnCanvas(
            originalImageB64,
            smallCanvasRef.current as HTMLCanvasElement,
            newWidth,
            newHeight
          ); */
        };
        imageElements.push(newImageElement);
      });

      setCollagesImages(imageElements);

      /* setUndoImageList([
        (await imageB64ToImageData(
          originalImageB64,
          mainCanvasConfig.maxWidth,
          mainCanvasConfig.maxHeight
        )) as ImageData,
      ]); */
    }
    console.log(collageImagesB64);
    console.log(files);
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

    //TODO: Revisar elprocedimiento para este caso
    loadMultipleFilesProcedure(files);
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

  //TODO: acá seguramente haya que usar otros elementos
  const {
    setOriginalFile,
    setOriginalImg,
    smallCanvasRef,
    displays,
    setDisplays,
    mobileToolbarRef,
  } = useContext(ImageContext);

  const [collageFiles, setCollagesFiles] = useState<File[] | null>(null);
  const [collageImages, setCollagesImages] = useState<
    HTMLImageElement[] | null
  >(null);

  const windowDimensions = useWindowsSize(displays, mobileToolbarRef);
  const inputUploadRef = useRef<HTMLInputElement | null>(null);

  const { setUndoImageList } = useContext(ProcessContext);

  return (
    <div>
      <form
        onClick={handleUploadFormClick}
        onInput={handleUploadFormInput}
        data-testid="formUpload"
        id="form-upload"
      >
        <div
          className={upForm.dropContainer}
          id="dropcontainer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className={upForm.dropTitleGroup}>
            <span className={`${upForm.dropTitle} ${upForm.unselectable}`}>
              Drop files here
            </span>
            <br />
            <br />
            <span className={`${upForm.dropTitle} ${upForm.unselectable}`}>
              or
            </span>
            <br />
            <br />
            <span className={`${upForm.dropTitle} ${upForm.unselectable}`}>
              click / tap to upload
            </span>
            <br />
          </div>
          <input
            type="file"
            id="input-upload"
            data-testid="inputUpload"
            accept="image/*"
            style={{ display: "none" }}
            ref={inputUploadRef}
          ></input>
        </div>
      </form>
      <p>hola</p>
      {collageImages &&
        collageImages.map((image) => {
          return (
            <img
              id="imagen1"
              style={{ maxWidth: "200px", maxHeight: "200px" }}
              src={image.src}
            ></img>
          );
        })}

      <img
        id="imagen1"
        style={{ maxWidth: "200px", maxHeight: "200px" }}
        //src={originalImg?.src}
      ></img>
      <img
        id="imagen2"
        style={{ maxWidth: "200px", maxHeight: "200px" }}
        //src={originalImg?.src}
      ></img>
    </div>
  );
}
