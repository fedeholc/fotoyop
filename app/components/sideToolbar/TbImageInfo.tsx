import React, { useContext } from "react";
import sideToolbar from "./sideToolbar.module.css";
import ToolbarGroup from "./ToolbarGroup";
import { ImageContext } from "@/app/providers/ImageProvider";

export default function TbImageInfo() {
  const { originalFile, originalImg } = useContext(ImageContext);

  return (
    <ToolbarGroup groupTitle="Image Information">
      <div className={sideToolbar.toolbarRow}>
        <div className={sideToolbar.imageInfoGroup}>
          <div>
            <strong>{originalFile?.name}</strong>
          </div>
          {originalFile && (
            <div>
              {originalImg?.width} x {originalImg?.height} pixels
            </div>
          )}
          {originalFile && (
            <div>{Math.floor(originalFile.size / 1000).toString()} Kbytes</div>
          )}
          <img
            id="imagenPreview"
            style={{
              maxWidth: "200px",
              maxHeight: "200px",
            }} /* TODO: ver si fijar acá o entro lado el max */
            src={originalImg?.src}
          ></img>
        </div>
      </div>
    </ToolbarGroup>
  );
}
