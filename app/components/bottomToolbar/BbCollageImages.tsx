import React, { useContext } from "react";
import { ImageContext } from "../../providers/ImageProvider";
import collage from "../CollageCanvas.module.css";
import { ArrowLeft, ArrowRight } from "lucide-react";
import toolbar from "../BottomToolbar.module.css";

export default function BtCollageImages() {
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
    <div className={collage.btImagesList}>
      {collageImages &&
        collageImages.map((image, index) => {
          return (
            <span
              className={collage.btImagesListCol}
              key={`${image.src}${index}`}
            >
              <img src={image.src}></img>
              <div className={collage.btImagesListButtons}>
                {index > 0 && (
                  <button
                    title="Move Left"
                    className={toolbar.buttonOnlyIcon}
                    onClick={() => handleMoveUp(index)}
                  >
                    <ArrowLeft></ArrowLeft>
                  </button>
                )}
                {index < collageImages.length - 1 && (
                  <button
                    title="Move Right"
                    className={toolbar.buttonOnlyIcon}
                    onClick={() => handleMoveDown(index)}
                  >
                    <ArrowRight></ArrowRight>
                  </button>
                )}
              </div>
            </span>
          );
        })}
    </div>
  );
}
