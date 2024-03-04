import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  createRef,
} from "react";
import { DisplaySections } from "../types";

export const ImageContext = createContext({
  originalImg: null as HTMLImageElement | null,
  originalFile: null as File | null,
  setOriginalImg: (() => {}) as Dispatch<
    SetStateAction<HTMLImageElement | null>
  >,
  setOriginalFile: (() => {}) as Dispatch<SetStateAction<File | null>>,
  smallCanvasRef: createRef<HTMLCanvasElement>(),
  imagenPreviewRef: createRef<HTMLImageElement>(),
  displays: {} as DisplaySections,
  setDisplays: (() => {}) as Dispatch<SetStateAction<DisplaySections>>,
});

export default function ImageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [originalImg, setOriginalImg] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const smallCanvasRef = useRef<HTMLCanvasElement>(null);
  const imagenPreviewRef = useRef<HTMLImageElement>(null);
  const [displays, setDisplays] = useState<DisplaySections>({
    canvas: false,
    form: true,
  });

  return (
    <ImageContext.Provider
      value={{
        originalImg,
        originalFile,
        setOriginalImg,
        setOriginalFile,
        smallCanvasRef,
        imagenPreviewRef,
        displays,
        setDisplays,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}
