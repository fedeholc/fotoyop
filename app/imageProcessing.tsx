import { ProcessFunction, ProcessOptionsType } from "./types";

export {
  imgToBW,
  imgAddBorder,
  hexToRgb,
  getAdaptedSize,
  getImageFromFile,
  drawImageB64OnCanvas,
  applyProcessList,
  applyProcessFunction,
  processImgToCanvas,
  processToNewImageData,
  drawImageDataOnCanvas,
  imageB64ToImageData,
  imageDataToBase64,
};

function imageDataToBase64(imageData: ImageData): string {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.putImageData(imageData, 0, 0);
  }

  return canvas.toDataURL();
}

/**
 * Función que convierte un IMG en Canvas, aplicando una lista de procesos.
 * Utiliza un offscreen canvas para aplicar todos los procesos, luego se pasa a un canvas común que es lo que devuelve la función.
 * Devuelve uno común y no el offscreen porque uso la función para luego convertir el canvas a DataURL y generar el enlace de descarga de la imagen procesada, y el offscreen no tiene para pasar a DataURL.
 * @param imgElement - elemento Img a convertir
 * @param processList - lista de funciones de procesamiento
 * @returns {HTMLCanvasElement} - canvas con la imagen procesada
 */
function processImgToCanvas(
  imgElement: HTMLImageElement,
  processList: ProcessFunction[]
): HTMLCanvasElement {
  let newOffscreenCanvas = new OffscreenCanvas(
    imgElement?.width || 0,
    imgElement?.height || 0
  );
  let newCtx = newOffscreenCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  newCtx?.drawImage(
    imgElement as HTMLImageElement,
    0,
    0,
    imgElement?.width || 0,
    imgElement?.height || 0
  );

  applyProcessList(newOffscreenCanvas, processList);

  //canvas comun para poner la imagen a exportar
  let resultCanvas = document.createElement("canvas");
  if (newOffscreenCanvas) {
    resultCanvas.width = newOffscreenCanvas?.width;
    resultCanvas.height = newOffscreenCanvas?.height;
  }
  let ctx = resultCanvas.getContext("2d", {
    willReadFrequently: true,
  });

  let bigImageData = newOffscreenCanvas
    ?.getContext("2d", {
      willReadFrequently: true,
    })
    ?.getImageData(0, 0, newOffscreenCanvas?.width, newOffscreenCanvas?.height);

  if (ctx && bigImageData) {
    ctx.createImageData(bigImageData.width, bigImageData.height);
    ctx.putImageData(bigImageData, 0, 0);
  }
  return resultCanvas;
}

/**
 * Función que agrega un borde a una imagen.
 * @param imageData - datos de la imagen
 * @param options - opciones de bordes para el proceso
 * @returns - datos de la imagen con el borde agregado
 */
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

/**
 * Recibe un canvas con una imagen y le aplica una transformación, quedando el resultado aplicado sobre ese mismo canvas.
 * @param canvasRef - referencia al canvas que tiene la imagen que se quiere transformar
 * @param processFunction - función que toma un ImageData y devuelve otro ImageData transformado
 * @return
 */
function applyProcessFunction(
  canvas: OffscreenCanvas | HTMLCanvasElement | null,
  processFunction: ProcessFunction,
  options?: ProcessOptionsType
): ImageData {
  const ctx = canvas?.getContext("2d", {
    willReadFrequently: true,
  }) as CanvasRenderingContext2D;

  const imageData = ctx?.getImageData(
    0,
    0,
    canvas?.width || 0,
    canvas?.height || 0
  ) as ImageData;

  const newData = processFunction(imageData as ImageData, options);

  if (canvas) {
    canvas.width = newData.width;
    canvas.height = newData.height;
    ctx?.createImageData(newData.width, newData.height);
    ctx?.putImageData(newData, 0, 0);
  }

  return ctx.getImageData(0, 0, newData.width, newData.height);
}

function processToNewImageData(
  canvas: OffscreenCanvas | HTMLCanvasElement | null,
  processFunction: ProcessFunction,
  options?: ProcessOptionsType
): ImageData {
  const ctx = canvas?.getContext("2d", {
    willReadFrequently: true,
  }) as CanvasRenderingContext2D;

  const imageData = ctx?.getImageData(
    0,
    0,
    canvas?.width || 0,
    canvas?.height || 0
  ) as ImageData;

  const newData = processFunction(imageData as ImageData, options);

  return newData;
}

/**
 * Función que toma un canvas y una lista de funciones de transformación, y aplica cada función a la imagen del canvas.
 * @param canvas - canvas con la imagen a transformar y en el que se va a poner la imagen transformada
 * @param processList - lista de funciones de transformación
 */
function applyProcessList(
  canvas: OffscreenCanvas | HTMLCanvasElement | null,
  processList: ProcessFunction[]
) {
  const ctx = canvas?.getContext("2d", {
    willReadFrequently: true,
  }) as CanvasRenderingContext2D;

  let imageData = ctx?.getImageData(
    0,
    0,
    canvas?.width || 0,
    canvas?.height || 0
  ) as ImageData;

  processList.forEach((processFunction) => {
    imageData = processFunction(imageData);
  });

  if (canvas) {
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx?.createImageData(imageData.width, imageData.height);
    ctx?.putImageData(imageData, 0, 0);
  }
}

/**
 * Función que toma una imagenB64 y la dibuja en un canvas, adaptando el tamaño del canvas considerando el tamaño máximo que puede tener, el tamaño de la imagen y si es horizontal o vertical. Si la imagen es horizontal, el ancho del canvas es el máximo y el alto se ajusta proporcionalmente. Si la imagen es vertical, el alto del canvas es el máximo y el ancho se ajusta proporcionalmente.
 * @param imageB64
 * @param canvas
 * @param canvasMaxWidth
 * @param canvasMaxHeight
 */
function drawImageB64OnCanvas(
  imageB64: string,
  canvas: HTMLCanvasElement,
  canvasMaxWidth: number,
  canvasMaxHeight: number
) {
  const imgElement = new window.Image();
  imgElement.src = imageB64;
  imgElement.onload = function () {
    const aspectRatio = imgElement.width / imgElement.height;

    if (aspectRatio > 1) {
      canvas.width = canvasMaxWidth;
      canvas.height = canvasMaxWidth / aspectRatio;
    } else {
      canvas.height = canvasMaxHeight;
      canvas.width = canvasMaxHeight * aspectRatio;
    }

    canvas
      .getContext("2d")
      ?.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
  };
}

//TODO: Limitar el tamaño al máximo del canvas.
async function imageB64ToImageData(
  imageB64: string,
  canvasMaxWidth: number,
  canvasMaxHeight: number
): Promise<ImageData> {
  const canvas = document.createElement("canvas");
  const imgElement = new window.Image();

  const loadImage = new Promise<void>((resolve, reject) => {
    imgElement.onload = function () {
      const aspectRatio = imgElement.width / imgElement.height;

      if (aspectRatio > 1) {
        canvas.width = canvasMaxWidth;
        canvas.height = canvasMaxWidth / aspectRatio;
      } else {
        canvas.height = canvasMaxHeight;
        canvas.width = canvasMaxHeight * aspectRatio;
      }

      canvas
        .getContext("2d")
        ?.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

      resolve();
    };

    imgElement.onerror = function () {
      reject(new Error("Error al cargar la imagen"));
    };

    imgElement.src = imageB64;
  });

  await loadImage;
  return canvas
    .getContext("2d")
    ?.getImageData(0, 0, canvas.width, canvas.height)!;
}

function drawImageDataOnCanvas(image: ImageData, canvas: HTMLCanvasElement) {
  canvas.width = image.width;
  canvas.height = image.height;
  canvas
    .getContext("2d")
    ?.putImageData(image, 0, 0, 0, 0, image.width, image.height);
}

/**
 * función que toma un archivo y devuelve una promesa que resuelve en un string con la imagen en formato base64
 * @param file - archivo a convertir
 * @returns - promesa que resuelve en un string con la imagen en formato base64
 */
async function getImageFromFile(file: File): Promise<string> {
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

/**
 * Función que calcula el alto y ancho que debe tener un canvas para adaptarse a una imagen, teniendo en cuenta el tamaño máximo que puede tener el canvas y si la imagen es horizontal o vertical.
 * @param canvasMaxWidth
 * @param canvasMaxHeight
 * @param imageWidth
 * @param imageHeight
 * @returns
 */
function getAdaptedSize(
  canvasMaxWidth: number,
  canvasMaxHeight: number,
  imageWidth: number,
  imageHeight: number
): { width: number; height: number } {
  const aspectRatio = imageWidth / imageHeight;
  let width = 0,
    height = 0;

  //horizontal
  if (aspectRatio > 1) {
    width = canvasMaxWidth;
    height = canvasMaxWidth / aspectRatio;
  } else {
    height = canvasMaxHeight;
    width = canvasMaxHeight * aspectRatio;
  }
  return { width, height };
}

/**
 * Toma un imageData y lo convierte a escala de grises promediando los valores de los canales de color.
 * @param imageData - ImageData a transformar
 * @returns - ImageData en escala de grises
 */
function imgToBW(imageData: ImageData): ImageData {
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

/**
 * Función que convierte un color en formato hexadecimal a un objeto con los valores de los canales de color en formato RGB.
 * @param hexColor - color en formato hexadecimal
 * @returns - objeto con los valores de los canales de color en formato RGB
 */
function hexToRgb(hexColor: string): {
  red: number;
  green: number;
  blue: number;
} {
  let color = hexColor.charAt(0) === "#" ? hexColor.substring(1, 7) : hexColor;

  let red = parseInt(color.substring(0, 2), 16);
  let green = parseInt(color.substring(2, 4), 16);
  let blue = parseInt(color.substring(4, 6), 16);

  return { red, green, blue };
}
