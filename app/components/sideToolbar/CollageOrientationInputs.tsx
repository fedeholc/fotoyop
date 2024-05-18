import { Orientation } from "@/app/types";
import { useContext } from "react";
import { CollageContext } from "../../providers/CollageProvider";
import { useId } from "react";

export default function CollageOrientationInputs() {
  const { previewOrientation, setPreviewOrientation, handleOrientation } =
    useContext(CollageContext);

  return (
    <>
      <input
        type="radio"
        name="stCollage"
        value="vertical"
        id="stVertical"
        onChange={() => {
          setPreviewOrientation(Orientation.vertical);
          handleOrientation(Orientation.vertical);
        }}
        checked={previewOrientation === Orientation.vertical}
      />
      <label htmlFor="stVertical">Vertical</label>
      <input
        type="radio"
        name="stCollage"
        value="horizontal"
        id="stHorizontal"
        onChange={() => {
          setPreviewOrientation(Orientation.horizontal);
          handleOrientation(Orientation.horizontal);
        }}
        checked={previewOrientation === Orientation.horizontal}
      />
      <label htmlFor="stHorizontal">Horizontal</label>
    </>
  );
}
