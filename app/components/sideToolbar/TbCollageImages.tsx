import React, { useContext } from "react";
import { ImageContext } from "../../providers/ImageProvider";
import sideToolbar from "./sideToolbar.module.css";
import ToolbarGroup from "./ToolbarGroup";
import collage from "../CollageCanvas.module.css";

export default function TbCollageImages() {
  const { collageImages } = useContext(ImageContext);
  return (
    <ToolbarGroup closedRendering={false} groupTitle="Collage Images">
      <div className={`${collage.imagesGroup} ${sideToolbar.toolbarRow}`}>
        <div className={collage.imagesList}>
          {collageImages &&
            collageImages.map((image) => {
              return (
                <span key={image.src}>
                  <img src={image.src}></img>
                </span>
              );
            })}
        </div>
      </div>
    </ToolbarGroup>
  );
}
