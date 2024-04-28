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
  displays: {} as DisplaySections,
  setDisplays: (() => {}) as Dispatch<SetStateAction<DisplaySections>>,
  mobileToolbarRef: createRef<HTMLDivElement>(),
});

export default function ImageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [originalImg, setOriginalImg] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const smallCanvasRef = useRef<HTMLCanvasElement>(null);
  const [displays, setDisplays] = useState<DisplaySections>({
    canvas: false,
    form: true,
    resizeTrigger: false,
    collage: true,
  });
  const mobileToolbarRef = useRef<HTMLDivElement>(null);

  return (
    <ImageContext.Provider
      value={{
        originalImg,
        originalFile,
        setOriginalImg,
        setOriginalFile,
        smallCanvasRef,
        displays,
        setDisplays,
        mobileToolbarRef,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}
