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
import ButtonDownFromCollage from "../buttons/buttonDownloadFromCollage";
import ButtonSaveToEdit from "../buttons/buttonSaveToEdit";
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
      {originalImg && (
        <div className={sideToolbar.toolbar__top}>
          <ButtonUndo></ButtonUndo>
          <ButtonNew></ButtonNew>
          <ButtonDownload></ButtonDownload>
        </div>
      )}

      {collageImages && collageImages.length > 0 && (
        <div className={sideToolbar.toolbar__top}>
          <ButtonNew></ButtonNew>
          <ButtonDownFromCollage></ButtonDownFromCollage>
          <ButtonSaveToEdit></ButtonSaveToEdit>
          {/* TODO: hay que vaciar collageimages cuando se pasa de collage a edit */}
        </div>
      )}
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
