import { createContext, useState, Dispatch, SetStateAction, useRef,createRef } from "react";

export const ImageContext = createContext({
  originalImg: null as HTMLImageElement | null,
  originalFile: null as File | null,
  setOriginalImg: (() => {}) as Dispatch<
    SetStateAction<HTMLImageElement | null>
  >,
  setOriginalFile: (() => {}) as Dispatch<SetStateAction<File | null>>,
  smallCanvasRef: createRef<HTMLCanvasElement>(),
});

export default function ImageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [originalImg, setOriginalImg] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const smallCanvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <ImageContext.Provider
      value={{ originalImg, originalFile, setOriginalImg, setOriginalFile, smallCanvasRef }}
    >
      {children}
    </ImageContext.Provider>
  );
}
