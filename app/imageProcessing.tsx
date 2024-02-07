export {
  imgToBW,
  hexToRgb,
  getAdaptedSize,
  getImageFromFile,
  drawImageB64OnCanvas,
};

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
