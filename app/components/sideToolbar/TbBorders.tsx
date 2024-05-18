import React, { useContext } from "react";
import sideToolbar from "./sideToolbar.module.css";
import { ImageContext } from "@/app/providers/ImageProvider";
import { BorderContext } from "@/app/providers/BorderProvider";
import ToolbarGroup from "./ToolbarGroup";
import BorderColorInputs from "./BorderColorInputs";
import BorderPercentInputs from "./BorderPercentInputs";
import BorderPixelInputs from "./BorderPixelInputs";
import ButtonApply from "../buttons/buttonApply";
import ButtonDiscard from "../buttons/buttonDiscard";

export default function TbBorders() {
  const { handleApplyBorder, handleDiscardBorder } = useContext(BorderContext);
  const { originalImg } = useContext(ImageContext);

  return (
    <ToolbarGroup groupTitle="Borders">
      <div className={sideToolbar.toolbarRow}>
        <div className={sideToolbar.rowTitle}>Color</div>
        <BorderColorInputs />
      </div>
      <div className={sideToolbar.toolbarRow}>
        <div className={sideToolbar.rowTitle}>Border in percent</div>
        <BorderPercentInputs maxRange="100" />
      </div>
      <div className={sideToolbar.toolbarRow}>
        <div className={sideToolbar.rowTitle}>Border in pixels</div>
        {originalImg?.src && (
          <BorderPixelInputs maxRange={(originalImg.width / 2).toString()} />
        )}
      </div>
      <div className={sideToolbar.toolbarRow}>
        <div className={sideToolbar.rowButtons}>
          <ButtonApply onClick={handleApplyBorder}></ButtonApply>
          <ButtonDiscard onClick={handleDiscardBorder}></ButtonDiscard>
        </div>
      </div>
    </ToolbarGroup>
  );
}
