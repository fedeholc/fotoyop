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
    //console.log(files);
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

  async function handleProbar2() {
    const canvas = document.getElementById(
      "collage__canvas"
    ) as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    ctx?.createImageData(400, 500);
    if (ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 400, 500);
      ctx.fillStyle = "red";
      ctx.fillRect(10, 10, 150, 100);
    }
    if (collageImages) {
      const imgd = await imageB64ToImageData(collageImages[0].src, 200, 200);
      ctx?.putImageData(imgd as ImageData, 0, 0);
      const imgd2 = await imageB64ToImageData(collageImages[1].src, 200, 200);

      ctx?.putImageData(imgd2 as ImageData, 0, 250);
    }
  }
  async function handleProbar() {
    const canvas = document.getElementById(
      "collage__canvas"
    ) as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (collageImages) {
      let width = Math.max(collageImages[0].width, collageImages[1].width);
      const imgd = await imageB64ToImageData(
        collageImages[0].src,
        collageImages[0].width,
        collageImages[0].height
      );
      const imgd2 = await imageB64ToImageData(
        collageImages[1].src,
        collageImages[1].width,
        collageImages[1].height
      );

      let gap = (imgd.height + imgd2.height) * 0.05;
      let maxWidth = Math.min(imgd.width, imgd2.width);
      let maxHeight = imgd.height + imgd2.height + gap;

      canvas.width = maxWidth;
      canvas.height = maxHeight;

      ctx?.createImageData(maxWidth, maxHeight);
      ctx!.fillStyle = "white";
      ctx!.fillRect(0, 0, maxWidth, maxHeight);

      ctx?.putImageData(imgd as ImageData, 0, 0);
      ctx?.putImageData(imgd2 as ImageData, 0, imgd.height + gap);

      /*     setDisplays((prev) => {
        return {
          canvas: true,
          form: false,
          resizeTrigger: !prev.resizeTrigger,
          collage: true,
        };
      }); */

      /*  const newImage = new window.Image();
      newImage.src = canvas.toDataURL("image/jpeg", 1) as string;
      newImage.onload = () => {
        const { newWidth, newHeight } = calcResizeToWindow(
          newImage.width,
          newImage.height,
          windowDimensions,
          mainCanvasConfig
        );
      }; */

      /*      drawImageB64OnCanvas(
        canvas.toDataURL("image/jpeg", 1) as string,
        smallCanvasRef.current as HTMLCanvasElement,
        canvas.width,
        canvas.height
      ); */

      loadB64Procedure(canvas.toDataURL("image/jpeg", 1) as string);

      //smallCanvasRef.current?.getContext("2d")?.drawImage(canvas, 0, 0);

      /*  let downloadDataURL = canvas.toDataURL("image/jpeg", 1);
      const enlaceDescarga = document.createElement("a");
      enlaceDescarga.href = downloadDataURL || "";
      enlaceDescarga.download = "image.jpg";

      document.body.appendChild(enlaceDescarga);
      enlaceDescarga.click();
      document.body.removeChild(enlaceDescarga); */
    }
  }

  async function loadB64Procedure(originalImageB64: string) {
    setDisplays((prev) => {
      return {
        canvas: true,
        form: false,
        resizeTrigger: !prev.resizeTrigger,
        collage: false,
      };
    });

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

  const CollageCanvasRef = useRef<HTMLCanvasElement>(null);

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
              Drop 2 files here
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
            multiple={true}
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
      <button onClick={handleProbar}>probar</button>
      <div className="collage__container">
        <canvas
          width={600}
          height={600}
          id="collage__canvas"
          ref={CollageCanvasRef}
        ></canvas>
      </div>
    </div>
  );
}
