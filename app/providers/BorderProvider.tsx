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
  putImageDataOnCanvas,
  imgAddBorder,
  imgAddCanvas,
} from "../imageProcessing";

export const BorderContext = createContext({
  BorderPixels: "0",
  BorderPercent: "0",
  inputBorderColor: "#ffffff",
  inputAspectRatioX: 0,
  inputAspectRatioY: 0,
  selectAspectRatio: "",
  setSelectAspectRatio: (() => {}) as Dispatch<SetStateAction<string>>,
  handleSelectAspectRatio: (() => {}) as (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void,
  setInputAspectRatioX: (() => {}) as Dispatch<SetStateAction<number>>,
  setInputAspectRatioY: (() => {}) as Dispatch<SetStateAction<number>>,
  setBorderPixels: (() => {}) as Dispatch<SetStateAction<string>>,
  setBorderPercent: (() => {}) as Dispatch<SetStateAction<string>>,
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

  handleBorderChange: (() => {}) as (
    borderOptions: BorderOptionsType,
    smallCanvasRef: React.RefObject<HTMLCanvasElement>
  ) => void,
  handleBorderPixelsRange: (() => {}) as (valor: string) => void,
  handleBorderPercentRange: (() => {}) as (valor: string) => void,

  handleApplyBorder: () => {},
  handleDiscardBorder: () => {},
  handleDiscardCanvas: () => {},
  handleCanvasChange: (() => {}) as (
    options: CanvasOptions,
    smallCanvasRef: React.RefObject<HTMLCanvasElement>
  ) => void,
  handleApplyCanvas: () => {},
});

export default function BorderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [BorderPixels, setBorderPixels] = useState<string>("0");
  const [BorderPercent, setBorderPercent] = useState<string>("0");
  const [inputBorderColor, setInputBorderColor] = useState<string>("#ffffff");

  const [inputAspectRatioX, setInputAspectRatioX] = useState<number>(0);
  const [inputAspectRatioY, setInputAspectRatioY] = useState<number>(0);

  const [selectAspectRatio, setSelectAspectRatio] = useState<string>("1:1");

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

  function handleSelectAspectRatio(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectAspectRatio(e.target.value);
    setInputAspectRatioX(0);
    setInputAspectRatioY(0);
  }

  function handleInputBorderColor(e: React.ChangeEvent<HTMLInputElement>) {
    setInputBorderColor(e.target.value);
  }

  function handleInputAspectRatioX(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) {
    setSelectAspectRatio("");
    setInputAspectRatioX(parseInt((e.target as HTMLInputElement).value));
  }

  function handleInputAspectRatioY(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) {
    setSelectAspectRatio("");

    setInputAspectRatioY(parseInt((e.target as HTMLInputElement).value));
  }

  /**
   * Handler del Mouse Up del input de rango de borde en porcentaje.
   *
   */
  function handleBorderPercentRange(valor: string) {
    setBorderPixels("0");
    setBorderPercent(valor);

    handleBorderChange(
      {
        BorderColor: inputBorderColor,
        BorderPixels: "0",
        BorderPercent: valor,
      },
      smallCanvasRef
    );
  }

  /**
   * Handler del Mouse Up del input de rango de borde en pixels.
   * Al mover el range, cuando se suelta el botón del mouse, se aplica el borde.
   */
  function handleBorderPixelsRange(valor: string) {
    setBorderPercent("0");
    setBorderPixels(valor);
    handleBorderChange(
      {
        BorderColor: inputBorderColor,
        BorderPixels: valor,
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
    if (parseInt(borderOptions.BorderPixels!) > 0) {
      if (undoImageList[0].width > undoImageList[0].height) {
        newBorderPixels =
          (parseInt(borderOptions.BorderPixels!) * mainCanvasConfig.maxWidth) /
          originalImg!.width;
      } else {
        newBorderPixels =
          (parseInt(borderOptions.BorderPixels!) * mainCanvasConfig.maxHeight) /
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
      putImageDataOnCanvas(
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
    if (currentProcess === ImageProcess.Canvas && undoImageList.length > 1) {
      const newUndoImageList = [...undoImageList];
      newUndoImageList.pop();
      putImageDataOnCanvas(
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
    handleBorderChange(
      {
        BorderColor: inputBorderColor,
        BorderPixels: BorderPixels,
        BorderPercent: BorderPercent,
      },
      smallCanvasRef
    );

    setInputBorderColor("#ffffff");
    setBorderPercent("0");
    setBorderPixels("0");
    setCurrentProcess(null);
  }

  function handleApplyCanvas() {
    if (
      selectAspectRatio === "" &&
      inputAspectRatioX > 0 &&
      inputAspectRatioY > 0
    ) {
      handleCanvasChange(
        {
          CanvasColor: inputBorderColor,
          ratioX: inputAspectRatioX,
          ratioY: inputAspectRatioY,
        },
        smallCanvasRef
      );
    } else {
      let arX = parseInt(selectAspectRatio.split(":")[0]);
      let arY = parseInt(selectAspectRatio.split(":")[1]);

      if (arX > 0 && arY > 0) {
        handleCanvasChange(
          {
            CanvasColor: inputBorderColor,
            ratioX: arX,
            ratioY: arY,
          },
          smallCanvasRef
        );
      }
    }

    setCurrentProcess(null);
  }

  function handleDiscardCanvas() {
    setInputBorderColor("#ffffff");
    setSelectAspectRatio("1:1");
    setInputAspectRatioX(0);
    setInputAspectRatioY(0);
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

      putImageDataOnCanvas(
        newUndoImageList[newUndoImageList.length - 1],
        smallCanvasRef.current!
      );

      const newProcessList = [...processList];
      newProcessList.pop();

      setProcessList(newProcessList);
    }

    setInputBorderColor("#ffffff");
    setBorderPercent("0");
    setBorderPixels("0");
    setCurrentProcess(null);
  }

  return (
    <BorderContext.Provider
      value={{
        BorderPixels,
        BorderPercent,
        inputBorderColor,
        inputAspectRatioX,
        inputAspectRatioY,
        selectAspectRatio,
        setSelectAspectRatio,
        handleSelectAspectRatio,
        setInputAspectRatioX,
        setInputAspectRatioY,
        handleInputAspectRatioX,
        handleInputAspectRatioY,
        setBorderPixels,
        setBorderPercent,
        setInputBorderColor,
        handleInputBorderColor,

        handleBorderChange,
        handleBorderPixelsRange,

        handleBorderPercentRange,
        handleApplyBorder,
        handleDiscardBorder,
        handleApplyCanvas,
        handleDiscardCanvas,
        handleCanvasChange,
      }}
    >
      {children}
    </BorderContext.Provider>
  );
}
