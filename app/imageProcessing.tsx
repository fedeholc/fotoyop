export { imgToBW, hexToRgb };

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
