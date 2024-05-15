import React, { useContext } from "react";
import sideToolbar from "./sideToolbar.module.css";
import { ToolbarContext } from "@/app/providers/ToolbarProvider";
import ButtonGrayscale from "../buttons/buttonGrayscale";
import ToolbarGroup from "./ToolbarGroup";

export default function TbGrayScale() {
  const { handleToGrayscale } = useContext(ToolbarContext);

  return (
    <ToolbarGroup groupTitle="GrayScale">
      <div className={sideToolbar.toolbarRow}>
        <div className={sideToolbar.rowButtons}>
          <ButtonGrayscale onClick={handleToGrayscale}></ButtonGrayscale>
        </div>
      </div>
    </ToolbarGroup>
  );
}
