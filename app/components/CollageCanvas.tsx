"use client";
import { ImageContext } from "../providers/ImageProvider";
import { useEffect, useContext, useRef, useState, useId } from "react";
import { createCollage } from "../imageProcessing";
import { Orientation } from "../types";

import { CollageContext } from "../providers/CollageProvider";

export default function CollageCanvas() {
  const { collageImages } = useContext(ImageContext);

 
  const { collageCanvasRef } = useContext(ImageContext);

  const [previewOrientation, setPreviewOrientation] = useState<Orientation>(
    Orientation.vertical
  );

  useEffect(() => {
    if (!collageCanvasRef.current) {
      return;
    }
    collageCanvasRef.current.getContext("2d", {
      willReadFrequently: true,
    });
  }, [collageCanvasRef]);

  useEffect(() => {
    if (collageImages && collageCanvasRef.current) {
       createCollage(
        collageCanvasRef.current,
        Orientation.vertical,
        collageImages
      );
    }
  }, [collageImages]);

  return (
    <div>
      <p> collage canvas</p>
      <div className="collage__container">
        <canvas
          width={200}
          height={200}
          id="collage__canvas"
          ref={collageCanvasRef}
        ></canvas>
      </div>
    </div>
  );
}
