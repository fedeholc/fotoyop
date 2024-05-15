import React, { useContext } from "react";
import { BorderContext } from "../../providers/BorderProvider";
import sideToolbar from "./sideToolbar.module.css";
import ToolbarGroup from "./ToolbarGroup";
import BorderColorInputs from "./BorderColorInputs";
import AspectRatioInputs from "./AspectRatioInputs";
import ButtonApply from "../buttons/buttonApply";
import ButtonDiscard from "../buttons/buttonDiscard";

export default function TbCanvas() {
  const { handleApplyCanvas, handleDiscardCanvas } = useContext(BorderContext);
  return (
    <ToolbarGroup groupTitle="Canvas">
      <div className={sideToolbar.toolbarRow}>
        <div className={sideToolbar.rowTitle}>Color</div>
        <BorderColorInputs />
      </div>

      <div className={sideToolbar.toolbarRow}>
        <div className={sideToolbar.rowTitle}>Aspect Ratio</div>
        <AspectRatioInputs />
      </div>
      <div className={sideToolbar.toolbarRow}>
        <div className={sideToolbar.rowButtons}>
          <ButtonApply onClick={handleApplyCanvas}></ButtonApply>
          <ButtonDiscard onClick={handleDiscardCanvas}></ButtonDiscard>
        </div>
      </div>
    </ToolbarGroup>
  );
}
