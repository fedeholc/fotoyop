import { useContext } from "react";
import { ToolbarContext } from "../../providers/ToolbarProvider";
import { Undo } from "lucide-react";
import toolbar from "../BottomToolbar.module.css";
import React from "react";
import { ImageContext } from "@/app/providers/ImageProvider";
import { BorderContext } from "@/app/providers/BorderProvider";

export default function ButtonUndoIcon() {
  const { handleUndo } = useContext(ToolbarContext);
  const {
    setInputCanvasColor,
    setInputAspectRatioX,
    setInputAspectRatioY,
    setSelectAspectRatio,
    setBorderPixels,
    setBorderPercent,
    setInputBorderColor,
  } = useContext(BorderContext);
  const { bottomToolbarDisplay } = useContext(ImageContext);
  return (
    <button
      title="Undo last change"
      className={toolbar.buttonFlow}
      onClick={() => {
        if (bottomToolbarDisplay.border) {
          setBorderPixels("0");
          setBorderPercent("0");
          setInputBorderColor("#ffffff");
        }
        if (bottomToolbarDisplay.canvas) {
          setInputCanvasColor("#ffffff");
          setInputAspectRatioX(0);
          setInputAspectRatioY(0);
          setSelectAspectRatio("");
        }
        handleUndo();
      }}
    >
      <Undo></Undo>
    </button>
  );
}
