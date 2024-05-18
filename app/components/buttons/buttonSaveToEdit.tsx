import { useContext } from "react";
import { ToolbarContext } from "../../providers/ToolbarProvider";
import { ImageUp } from "lucide-react";
import toolbar from "../BottomToolbar.module.css";
import { CollageContext } from "@/app/providers/CollageProvider";

export default function ButtonDownload() {
  const { handleSaveToEdit } = useContext(CollageContext);
  return (
    <button
      title="Download file"
      className={toolbar.buttonWithIcon}
      onClick={() => handleSaveToEdit()}
    >
      <ImageUp></ImageUp>
      <span>Save & Edit</span>
    </button>
  );
}
