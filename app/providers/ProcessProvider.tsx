import { createContext, useState, Dispatch, SetStateAction } from "react";
import { ProcessFunction, ImageProcess } from "../types";
export const ProcessContext = createContext({
  processList: [] as ProcessFunction[],
  undoImageList: [] as ImageData[],
  currentProcess: null as ImageProcess | null,
  setProcessList: (() => {}) as Dispatch<SetStateAction<ProcessFunction[]>>,
  setUndoImageList: (() => {}) as Dispatch<SetStateAction<ImageData[]>>,
  setCurrentProcess: (() => {}) as Dispatch<
    SetStateAction<ImageProcess | null>
  >,
});

export default function ProcessProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [processList, setProcessList] = useState<ProcessFunction[]>([]);
  const [undoImageList, setUndoImageList] = useState<ImageData[]>([]);
  const [currentProcess, setCurrentProcess] = useState<ImageProcess | null>(
    null
  );

  return (
    <ProcessContext.Provider
      value={{
        processList,
        setProcessList,
        undoImageList,
        setUndoImageList,
        currentProcess,
        setCurrentProcess,
      }}
    >
      {children}
    </ProcessContext.Provider>
  );
}
