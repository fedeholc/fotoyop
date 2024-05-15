//* IMPORTS
import { useContext } from "react";
//Providers
import { ImageContext } from "../../providers/ImageProvider";

//CSS
import sideToolbar from "./sideToolbar.module.css";
//Buttons
import ButtonUndo from "../buttons/buttonUndo";
import ButtonNew from "../buttons/buttonNew";
import ButtonDownload from "../buttons/buttonDownload";
//Edit Toolbar Groups
import TbImageInfo from "./TbImageInfo";
import TbBorders from "./TbBorders";
import TbGrayScale from "./TbGrayScale";
import TbChangesHistory from "./TbChangesHistory";
import TbCanvas from "./TbCanvas";
//Collage Toolbar Groups
import TbCollageImages from "./TbCollageImages";
import TbCollageOptions from "./TbCollageOptions";

export function SideToolbar() {
  const { originalImg, collageImages } = useContext(ImageContext);

  return (
    <>
      <div className={sideToolbar.toolbar__top}>
        <ButtonUndo></ButtonUndo>
        <ButtonNew></ButtonNew>
        <ButtonDownload></ButtonDownload>
      </div>
      {originalImg && (
        <div className={sideToolbar.groupContainer}>
          <TbImageInfo></TbImageInfo>
          <TbBorders></TbBorders>
          <TbCanvas></TbCanvas>
          <TbGrayScale></TbGrayScale>
          <TbChangesHistory></TbChangesHistory>
        </div>
      )}
      {collageImages && (
        <div className={sideToolbar.groupContainer}>
          <TbCollageImages></TbCollageImages>
          <TbCollageOptions></TbCollageOptions>
        </div>
      )}
      <br />
    </>
  );
}
