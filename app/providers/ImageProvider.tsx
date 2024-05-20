import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  createRef,
} from "react";
import { BottomToolbarDisplay, DisplaySections } from "../types";

export const ImageContext = createContext({
  originalImg: null as HTMLImageElement | null,
  originalFile: null as File | null,
  setOriginalImg: (() => {}) as Dispatch<
    SetStateAction<HTMLImageElement | null>
  >,
  setOriginalFile: (() => {}) as Dispatch<SetStateAction<File | null>>,
  smallCanvasRef: createRef<HTMLCanvasElement>(),
  collageCanvasRef: createRef<HTMLCanvasElement>(),

  displays: {} as DisplaySections,
  setDisplays: (() => {}) as Dispatch<SetStateAction<DisplaySections>>,
  bottomToolbarDisplay: {} as BottomToolbarDisplay,
  setBottomToolbarDisplay: (() => {}) as Dispatch<
    SetStateAction<BottomToolbarDisplay>
  >,

  mobileToolbarRef: createRef<HTMLDivElement>(),
  collageImages: null as HTMLImageElement[] | null,
  collageFiles: null as File[] | null,
  setCollageImages: (() => {}) as Dispatch<
    SetStateAction<HTMLImageElement[] | null>
  >,
  setCollageFiles: (() => {}) as Dispatch<SetStateAction<File[] | null>>,
});

export default function ImageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [originalImg, setOriginalImg] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [collageFiles, setCollageFiles] = useState<File[] | null>(null);
  const [collageImages, setCollageImages] = useState<HTMLImageElement[] | null>(
    null
  );
  const smallCanvasRef = useRef<HTMLCanvasElement>(null);
  const collageCanvasRef = useRef<HTMLCanvasElement>(null);

  const [displays, setDisplays] = useState<DisplaySections>({
    canvas: false,
    form: true,
    resizeTrigger: false,
    collage: false,
  });

  const [bottomToolbarDisplay, setBottomToolbarDisplay] =
    useState<BottomToolbarDisplay>({
      mainMenu: false,
      edit: false,
      border: false,
      borderPx: false,
      borderPc: false,
      canvas: false,
      collage: false,
      flow: false,
      arrange: false,
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
        collageCanvasRef,
        displays,
        setDisplays,
        mobileToolbarRef,
        collageImages,
        collageFiles,
        setCollageImages,
        setCollageFiles,
        bottomToolbarDisplay,
        setBottomToolbarDisplay,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}
