import React, { useContext } from "react";
import { ProcessContext } from "../../providers/ProcessProvider";
import sideToolbar from "./sideToolbar.module.css";
import ToolbarGroup from "./ToolbarGroup";
import { imageDataToBase64 } from "../../imageProcessing";

export default function TbChangesHistory() {
  const { undoImageList } = useContext(ProcessContext);
  return (
    <ToolbarGroup closedRendering={false} groupTitle="Changes History">
      <div className={`${sideToolbar.changesGroup} ${sideToolbar.toolbarRow}`}>
        {undoImageList && (
          <div className={sideToolbar.changesList}>
            {undoImageList.toReversed().map((img, index) => {
              return (
                <span key={index}>
                  <img src={`${imageDataToBase64(img)}`.toString()} />
                </span>
              );
            })}
          </div>
        )}
      </div>
    </ToolbarGroup>
  );
}
