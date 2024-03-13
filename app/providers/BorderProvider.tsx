import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { ImageContext } from "./ImageProvider";
import { ProcessContext } from "./ProcessProvider";
import { BorderOptionsType, CanvasOptions, ProcessFunction } from "../types";
import { mainCanvasConfig } from "../App";
import { ImageProcess } from "../types";
import {
  applyProcessFunction,
  drawImageDataOnCanvas,
  imgAddBorder,
  imgAddCanvas,
} from "../imageProcessing";

export const BorderContext = createContext({
  inputBorderPixels: "0",
  inputBorderPercent: "0",
  inputBorderColor: "#ffffff",
  inputAspectRatioX: 0,
  inputAspectRatioY: 0,
  setInputAspectRatioX: (() => {}) as Dispatch<SetStateAction<number>>,
  setInputAspectRatioY: (() => {}) as Dispatch<SetStateAction<number>>,
  setInputBorderPixels: (() => {}) as Dispatch<SetStateAction<string>>,
  setInputBorderPercent: (() => {}) as Dispatch<SetStateAction<string>>,
  setInputBorderColor: (() => {}) as Dispatch<SetStateAction<string>>,
  handleInputAspectRatioX: (() => {}) as (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => void,
  handleInputAspectRatioY: (() => {}) as (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => void,
  handleInputBorderColor: (() => {}) as (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void,
  handleInputBorderPixelsRange: (() => {}) as (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void,
  handleInputBorderPercentRange: (() => {}) as (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void,
  handleBorderChange: (() => {}) as (
    borderOptions: BorderOptionsType,
    smallCanvasRef: React.RefObject<HTMLCanvasElement>
  ) => void,
  handleInputBorderPixelsRangeMouseUp: (() => {}) as () => void,
  handleInputBorderPixelsText: (() => {}) as (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => void,
  handleInputBorderPercent: (() => {}) as (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void,
  handleInputBorderPercentText: (() => {}) as (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => void,
  handleInputBorderPercentRangeMouseUp: (() => {}) as () => void,
  handleApplyBorder: () => {},
  handleDiscardBorder: () => {},
  handleCanvasChange: (() => {}) as (
    borderXYOptions: CanvasOptions,
    smallCanvasRef: React.RefObject<HTMLCanvasElement>
  ) => void,
  handleApplyCanvas: () => {},
});

export default function BorderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [inputBorderPixels, setInputBorderPixels] = useState<string>("0");
  const [inputBorderPercent, setInputBorderPercent] = useState<string>("0");
  const [inputBorderColor, setInputBorderColor] = useState<string>("#ffffff");

  const [inputAspectRatioX, setInputAspectRatioX] = useState<number>(0);
  const [inputAspectRatioY, setInputAspectRatioY] = useState<number>(0);

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

  /**
   * Handler del Mouse Up del input de rango de borde en porcentaje.
   *
   */
  function handleInputBorderPercentRangeMouseUp() {
    setInputBorderPixels("0");
    handleBorderChange(
      {
        BorderColor: inputBorderColor,
        BorderPixels: "0",
        BorderPercent: inputBorderPercent,
      },
      smallCanvasRef
    );
  }

  /**
   *
   * @param event - evento del input de rango de borde en porcentaje
   */
  function handleInputBorderPercent(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setInputBorderPixels("0");
    setInputBorderPercent(event.target.value);
  }

  function handleInputBorderColor(e: React.ChangeEvent<HTMLInputElement>) {
    setInputBorderColor(e.target.value);
  }

  function handleInputAspectRatioX(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) {
    setInputAspectRatioX(parseInt((e.target as HTMLInputElement).value));
  }

  function handleInputAspectRatioY(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) {
    setInputAspectRatioY(parseInt((e.target as HTMLInputElement).value));
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

  function handleInputBorderPercentRange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setInputBorderPixels("0");
    setInputBorderPercent(event.target.value);
  }

  /**
   *
   * @param event - evento del input box de borde en porcentaje
   */
  function handleInputBorderPercentText(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) {
    setInputBorderPixels("0");
    setInputBorderPercent((event.target as HTMLInputElement).value);
    handleBorderChange(
      {
        BorderColor: inputBorderColor,
        BorderPixels: "0",
        BorderPercent: (event.target as HTMLInputElement).value,
      },
      smallCanvasRef
    );
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
    borderOptions: BorderOptionsType,
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
        imgAddBorder as ProcessFunction,
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
        imgAddBorder as ProcessFunction,
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

  function handleCanvasChange(
    options: CanvasOptions,
    smallCanvasRef: React.RefObject<HTMLCanvasElement>
  ) {
    if (!originalFile) {
      return;
    }

    // Si es primera modificación del canvas, se agrega el proceso a processList y se guarda el snapshot de la imagen en undoImageList.
    if (currentProcess === null || undoImageList.length <= 1) {
      setCurrentProcess(ImageProcess.Canvas);
      let newImageData = applyProcessFunction(
        smallCanvasRef.current,
        imgAddCanvas as ProcessFunction,
        options
      );
      setUndoImageList([...undoImageList, newImageData]);
      setProcessList([
        ...processList,
        (imageData) => imgAddCanvas(imageData, options),
      ]);
    }

    // Si ya se vienen haciendo modificaciones al canvas (aún no aplicadas) se descarta la última modificación y se agrega la nueva.
    //todo: ver, esto no se va a aplicar creo, no va a haber modificaciones sin aplicar como en borde
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
        imgAddCanvas as ProcessFunction,
        options
      );

      setUndoImageList([...newUndoImageList, newImageData]);

      const tempProcessList = [...processList];
      tempProcessList.pop();
      setProcessList([
        ...tempProcessList,
        (imageData) => imgAddCanvas(imageData, options),
      ]);
    }
  }

  /**
   * Handler del click en aplicar borde.
   */
  function handleApplyBorder() {
    setInputBorderColor("#ffffff");
    setInputBorderPercent("0");
    setInputBorderPixels("0");
    setCurrentProcess(null);
  }

  function handleApplyCanvas() {
    handleCanvasChange(
      {
        CanvasColor: inputBorderColor,
        ratioX: inputAspectRatioX,
        ratioY: inputAspectRatioY,
      },
      smallCanvasRef
    );

    setCurrentProcess(null);
  }

  /**
   * Handler del botón descartar borde. Descarta las últimas modificaciones recuperando el snapshot anterior.
   */
  function handleDiscardBorder() {
    const newUndoImageList = [...undoImageList];
    if (currentProcess === ImageProcess.Border && undoImageList.length > 1) {
      newUndoImageList.pop();
      setUndoImageList(newUndoImageList);

      drawImageDataOnCanvas(
        newUndoImageList[newUndoImageList.length - 1],
        smallCanvasRef.current!
      );

      const newProcessList = [...processList];
      newProcessList.pop();

      setProcessList(newProcessList);
    }

    setInputBorderColor("#ffffff");
    setInputBorderPercent("0");
    setInputBorderPixels("0");
    setCurrentProcess(null);
  }

  return (
    <BorderContext.Provider
      value={{
        inputBorderPixels,
        inputBorderPercent,
        inputBorderColor,
        inputAspectRatioX,
        inputAspectRatioY,
        setInputAspectRatioX,
        setInputAspectRatioY,
        handleInputAspectRatioX,
        handleInputAspectRatioY,
        setInputBorderPixels,
        setInputBorderPercent,
        setInputBorderColor,
        handleInputBorderColor,
        handleInputBorderPixelsRange,
        handleInputBorderPercentRange,
        handleBorderChange,
        handleInputBorderPixelsRangeMouseUp,
        handleInputBorderPixelsText,
        handleInputBorderPercent,
        handleInputBorderPercentText,
        handleInputBorderPercentRangeMouseUp,
        handleApplyBorder,
        handleDiscardBorder,
        handleApplyCanvas,
        handleCanvasChange,
      }}
    >
      {children}
    </BorderContext.Provider>
  );
}
