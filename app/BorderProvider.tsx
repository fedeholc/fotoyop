import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { ImageContext } from "./ImageProvider";
import { ProcessContext } from "./ProcessProvider";
import { ProcessOptionsType } from "./types";
import { mainCanvasConfig } from "./App";
import { ImageProcess } from "./types";
import {
  applyProcessFunction,
  drawImageDataOnCanvas,
  imgAddBorder,
} from "./imageProcessing";

export const BorderContext = createContext({
  inputBorderPixels: "0",
  inputBorderPercent: "0",
  inputBorderColor: "#ffffff",
  setInputBorderPixels: (() => {}) as Dispatch<SetStateAction<string>>,
  setInputBorderPercent: (() => {}) as Dispatch<SetStateAction<string>>,
  setInputBorderColor: (() => {}) as Dispatch<SetStateAction<string>>,
  handleInputBorderColor: (() => {}) as (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void,
  handleInputBorderPixelsRange: (() => {}) as (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void,
  handleBorderChange: (() => {}) as (
    borderOptions: ProcessOptionsType,
    smallCanvasRef: React.RefObject<HTMLCanvasElement>
  ) => void,
  handleInputBorderPixelsRangeMouseUp: (() => {}) as () => void,
  handleInputBorderPixelsText: (() => {}) as (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => void,
});

export default function BorderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [inputBorderPixels, setInputBorderPixels] = useState<string>("0");
  const [inputBorderPercent, setInputBorderPercent] = useState<string>("0");
  const [inputBorderColor, setInputBorderColor] = useState<string>("#ffffff");

  const {
    originalFile,
    originalImg,
    setOriginalFile,
    setOriginalImg,
    smallCanvasRef,
  } = useContext(ImageContext);

  const {
    processList,
    setProcessList,
    undoImageList,
    setUndoImageList,
    currentProcess,
    setCurrentProcess,
  } = useContext(ProcessContext);

  function handleInputBorderColor(e: React.ChangeEvent<HTMLInputElement>) {
    setInputBorderColor(e.target.value);
  }
  /**
   *
   * @param event - evento del input box de borde en pixels
   */
  function handleInputBorderPixelsText(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) {
    setInputBorderPercent("0");
    setInputBorderPixels((event.target as HTMLInputElement).value);
    handleBorderChange(
      {
        BorderColor: inputBorderColor,
        BorderPixels: (event.target as HTMLInputElement).value,
        BorderPercent: "0",
      },
      smallCanvasRef
    );
  }
  /**
   *
   * @param event - evento del input de rango de borde en pixels
   */
  function handleInputBorderPixelsRange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setInputBorderPercent("0");
    setInputBorderPixels(event.target.value);
  }

  /**
   * Handler del Mouse Up del input de rango de borde en pixels.
   * Al mover el range, cuando se suelta el botón del mouse, se aplica el borde.
   */
  function handleInputBorderPixelsRangeMouseUp() {
    setInputBorderPercent("0");
    handleBorderChange(
      {
        BorderColor: inputBorderColor,
        BorderPixels: inputBorderPixels,
        BorderPercent: "0",
      },
      smallCanvasRef
    );
  }

  function handleBorderChange(
    borderOptions: ProcessOptionsType,
    smallCanvasRef: React.RefObject<HTMLCanvasElement>
  ) {
    if (!originalFile) {
      return;
    }
    // El borderOptions como viene lo uso para guardar en processList, ya que el borde en pixels se aplica tal cual a la imagen final con la resolución original. Pero para el small canvas, que es el que se muestra, el borde en pixels se tiene que ajustar a la resolución del canvas.
    let smallCanvasBorderOptions = { ...borderOptions };
    let newBorderPixels = 0;
    if (parseInt(inputBorderPixels) > 0) {
      if (undoImageList[0].width > undoImageList[0].height) {
        newBorderPixels =
          (parseInt(inputBorderPixels) * mainCanvasConfig.maxWidth) /
          originalImg!.width;
      } else {
        newBorderPixels =
          (parseInt(inputBorderPixels) * mainCanvasConfig.maxHeight) /
          originalImg!.height;
      }
    }
    smallCanvasBorderOptions.BorderPixels = newBorderPixels.toString();

    // Puede pasar que el cambio de borde se haga por primera vez o que ya se esté trabajando en eso y no sea la primera modificación. La idea es que si ya se hicieron modificaciones y se vuelve a modificar, se descarta la última modificación y se agrega la nueva, de forma tal que no se acumulen bordes. Por ejemplo, si se aplica un borde de 10 pixel y luego se mueve el rango a 20, se descarta el de 10 y se aplica el de 20. Todo esto hasta que se haga click en Apply.

    // Si es primera modificación del borde, se agrega el proceso a processList y se guarda el snapshot de la imagen en undoImageList.
    if (currentProcess === null || undoImageList.length <= 1) {
      setCurrentProcess(ImageProcess.Border);
      let newImageData = applyProcessFunction(
        smallCanvasRef.current,
        imgAddBorder,
        smallCanvasBorderOptions
      );
      setUndoImageList([...undoImageList, newImageData]);
      setProcessList([
        ...processList,
        (imageData) => imgAddBorder(imageData, borderOptions),
      ]);
    }

    // Si ya se vienen haciendo modificaciones al borde (aún no aplicadas) se descarta la última modificación y se agrega la nueva.
    if (currentProcess === ImageProcess.Border && undoImageList.length > 1) {
      const newUndoImageList = [...undoImageList];
      newUndoImageList.pop();
      drawImageDataOnCanvas(
        newUndoImageList[newUndoImageList.length - 1],
        smallCanvasRef.current!
      );

      //version sin hacer resize (no genera flickeo)
      let newImageData = applyProcessFunction(
        smallCanvasRef.current,
        imgAddBorder,
        smallCanvasBorderOptions
      );

      setUndoImageList([...newUndoImageList, newImageData]);

      const tempProcessList = [...processList];
      tempProcessList.pop();
      setProcessList([
        ...tempProcessList,
        (imageData) => imgAddBorder(imageData, borderOptions),
      ]);
    }
  }

  return (
    <BorderContext.Provider
      value={{
        inputBorderPixels,
        inputBorderPercent,
        inputBorderColor,
        setInputBorderPixels,
        setInputBorderPercent,
        setInputBorderColor,
        handleInputBorderColor,
        handleInputBorderPixelsRange,
        handleBorderChange,
        handleInputBorderPixelsRangeMouseUp,
        handleInputBorderPixelsText,
      }}
    >
      {children}
    </BorderContext.Provider>
  );
}
