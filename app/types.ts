
export enum ImageProcess {
  Border = "Border",
  Grayscale = "Grayscale",
}

/**
 * Define la configuración del canvas principal.
 */
export type CanvasConfig = {
  maxWidth: number;
  maxHeight: number;
};

//? Sería mejor usar enums?
//? al parecer la ventaja de los strings literals es que se pueden componer juntando con otros. Tal vez podría tener un tipo de opciones para bordes y otro tipo de opciones para otras transformaciones. ¿Se podría hacer que cada funcion acepte las opciones que le correspondan nada más mientras que el tipo de la función (ImageDataTransformFunction) acepte cualquier opción?

const processOptionsKeys = {
  BorderPercent: "BorderPercent",
  BorderPixels: "BorderPixels",
  BorderColor: "BorderColor",
} as const;

//este tipo son las keys de processOptionsKeys
type ProcesssOptionsKeysType = keyof typeof processOptionsKeys;

//este tipo es un par key-value con las keys de processOptionsKeys y valores string
export type ProcessOptionsType = {
  [key in ProcesssOptionsKeysType]?: string;
};


/**
 * Tipo de función que toma un ImageData y devuelve otro ImageData transformado.
 */
export type ProcessFunction = (
  inputImageData: ImageData,
  options?: ProcessOptionsType
) => ImageData;

/**
 * Define los estados de visibilidad de las diferentes secciones de la aplicación.
 */
export type DisplaySections = {
  form: boolean;
  canvas: boolean;
};
