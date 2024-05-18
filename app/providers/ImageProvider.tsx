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
  containerRef: createRef<HTMLDivElement>(),

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
  getDownloadFileName: (() => {}) as () => string,
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
  const containerRef = useRef<HTMLDivElement>(null);

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
    });

  const mobileToolbarRef = useRef<HTMLDivElement>(null);

  function getDownloadFileName(): string {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours()
    ).padStart(2, "0")}.${String(now.getMinutes()).padStart(2, "0")}`;

    if (originalFile) {
      return `${originalFile.name.split(".")[0]} ${formattedDate}.jpg`;
    }

    if (collageFiles && collageFiles.length > 1) {
      return `Collage ${formattedDate}.jpg`;
    }
    return `Image ${formattedDate}.jpg`;
  }

  return (
    <ImageContext.Provider
      value={{
        originalImg,
        originalFile,
        setOriginalImg,
        setOriginalFile,
        smallCanvasRef,
        collageCanvasRef,
        containerRef,
        displays,
        setDisplays,
        mobileToolbarRef,
        collageImages,
        collageFiles,
        setCollageImages,
        setCollageFiles,
        bottomToolbarDisplay,
        setBottomToolbarDisplay,
        getDownloadFileName,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}
