"use client";
import { ImageContext } from "../providers/ImageProvider";
import { useContext, useRef } from "react";
import {
  getImageFromFile,
  drawImageB64OnCanvas,
  imageB64ToImageData,
} from "../imageProcessing";
import { ProcessContext } from "../providers/ProcessProvider";
import useWindowsSize from "./hooks/useWindowsSize";
import { appConfig } from "../App";
import { calcResizeToWindow, getCollageGapPx } from "../imageProcessing";
import upForm from "./UploadForm.module.css";
import { CollageContext } from "../providers/CollageProvider";
import { Orientation } from "../types";

export default function UploadForm({}) {
  /**
   * Handler del input cuando se sube un archivo.
   * @param event
   */
  async function handleUploadFormInput(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    const files = (event.target as HTMLFormElement).files;

    //Un solo archivo --> edición simple
    if (files.length == 1) {
      await loadFileProcedure(files[0] as File);

      setDisplays((prev) => {
        return {
          canvas: true,
          form: false,
          resizeTrigger: !prev.resizeTrigger,
          collage: false,
        };
      });
      setBottomToolbarDisplay({
        mainMenu: true,
        edit: false,
        border: false,
        borderPx: false,
        borderPc: false,
        canvas: false,
        collage: false,
        flow: false,
        arrange: false,
      });

      setCollageFiles(null);
      setCollageImages(null);
    }

    //Máss de un archivo --> collage
    if (files.length > 1) {
      await loadMultipleFilesProcedure(files as File[]);

      setDisplays((prev) => {
        return {
          canvas: false,
          form: false,
          resizeTrigger: !prev.resizeTrigger,
          collage: true,
        };
      });
      setBottomToolbarDisplay({
        mainMenu: true,
        edit: false,
        border: false,
        borderPx: false,
        borderPc: false,
        canvas: false,
        collage: false,
        flow: false,
        arrange: false,
      });

      setOriginalImg(null);
    }

    //todo: probar si con este agregado de setDisplays acá se puede quitar el resizeTrigger
  }

  /**
   * Pasos a seguir cuando se carga un archivo de imagen.
   * @param file - archivo de imagen
   * @returns
   */
  async function loadFileProcedure(file: File) {
    let originalImageB64: string;
    setDisplays((prev) => {
      return {
        canvas: true,
        form: false,
        resizeTrigger: !prev.resizeTrigger,
        collage: false,
      };
    });
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
          appConfig,
          mobileToolbarRef
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
          appConfig.canvasMaxWidth,
          appConfig.canvasMaxHeight
        )) as ImageData,
      ]);
    }
  }

  async function loadMultipleFilesProcedure(files: File[]) {
    setDisplays((prev) => {
      return {
        canvas: true,
        form: false,
        resizeTrigger: !prev.resizeTrigger,
        collage: true,
      };
    });
    let collageImagesB64: string[] = [];
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
      setCollageFiles(files);
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

      setCollageImages(imageElements);
    }
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
  async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
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

    //TODO: revisar por qué acá no esta lo mismo que cuando se sube haciendo click (el SetDisplays y demás)
    if (files.length === 1) {
      await loadFileProcedure(files[0]);
      setDisplays((prev) => {
        return {
          canvas: true,
          form: false,
          resizeTrigger: !prev.resizeTrigger,
          collage: false,
        };
      });
      setBottomToolbarDisplay({
        mainMenu: true,
        edit: false,
        border: false,
        borderPx: false,
        borderPc: false,
        canvas: false,
        collage: false,
        flow: false,
        arrange: false,
      });

      setCollageFiles(null);
      setCollageImages(null);
    }
    if (files.length > 1) {
      await loadMultipleFilesProcedure(files);

      setDisplays((prev) => {
        return {
          canvas: false,
          form: false,
          resizeTrigger: !prev.resizeTrigger,
          collage: true,
        };
      });
      setBottomToolbarDisplay({
        mainMenu: true,
        edit: false,
        border: false,
        borderPx: false,
        borderPc: false,
        canvas: false,
        collage: false,
        flow: false,
        arrange: false,
      });

      setOriginalImg(null);
    }
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

  const {
    setOriginalFile,
    setOriginalImg,
    smallCanvasRef,
    displays,
    setDisplays,
    mobileToolbarRef,
    setCollageFiles,
    setCollageImages,
    setBottomToolbarDisplay,
  } = useContext(ImageContext);

  const windowDimensions = useWindowsSize(displays, mobileToolbarRef);
  const inputUploadRef = useRef<HTMLInputElement | null>(null);

  const { setUndoImageList } = useContext(ProcessContext);

  return (
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
          multiple={true}
        ></input>
      </div>
      <span className={`${upForm.dropInfo} ${upForm.unselectable}`}>
        <div>Upload 1 file for single edit</div>
        <div>or more for collage creation</div>
      </span>
      <span className={`${upForm.dropInfo} ${upForm.unselectable}`}></span>
    </form>
  );
}
