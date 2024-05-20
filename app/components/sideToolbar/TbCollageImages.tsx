import React, { useContext } from "react";
import { ImageContext } from "../../providers/ImageProvider";
import sideToolbar from "./sideToolbar.module.css";
import ToolbarGroup from "./ToolbarGroup";
import collage from "../CollageCanvas.module.css";
import { ArrowUp, ArrowDown } from "lucide-react";
import toolbar from "../BottomToolbar.module.css";

export default function TbCollageImages() {
  const { collageImages, setCollageImages, setCollageFiles, collageFiles } =
    useContext(ImageContext);

  function handleMoveUp(index: number) {
    const newImages = [...collageImages!];
    const aux = newImages[index];
    newImages[index] = newImages[index - 1];
    newImages[index - 1] = aux;
    setCollageImages(newImages);
  }
  function handleMoveDown(index: number) {
    const newImages = [...collageImages!];
    const aux = newImages[index];
    newImages[index] = newImages[index + 1];
    newImages[index + 1] = aux;
    setCollageImages(newImages);
  }

  return (
    <ToolbarGroup closedRendering={false} groupTitle="Collage Images">
      <div className={`${collage.imagesGroup} ${sideToolbar.toolbarRow}`}>
        <div className={collage.imagesList}>
          {collageImages &&
            collageImages.map((image, index) => {
              return (
                <span
                  className={collage.imagesListRow}
                  key={`${image.src}${index}`}
                >
                  <img src={image.src}></img>
                  <div className={collage.imagesListButtons}>
                    {index > 0 && (
                      <button
                        title="Move Up"
                        className={toolbar.buttonOnlyIcon}
                        onClick={() => handleMoveUp(index)}
                      >
                        <ArrowUp></ArrowUp>
                      </button>
                    )}
                    {index < collageImages.length - 1 && (
                      <button
                        title="Move Down"
                        className={toolbar.buttonOnlyIcon}
                        onClick={() => handleMoveDown(index)}
                      >
                        <ArrowDown></ArrowDown>
                      </button>
                    )}
                  </div>
                </span>
              );
            })}
        </div>
      </div>
    </ToolbarGroup>
  );
}
