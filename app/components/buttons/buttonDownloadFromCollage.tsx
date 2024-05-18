import { useContext } from "react";
import { ToolbarContext } from "../../providers/ToolbarProvider";
import { Download } from "lucide-react";
import toolbar from "../BottomToolbar.module.css";
import { CollageContext } from "@/app/providers/CollageProvider";

export default function ButtonDownloadFromCollage() {
  const { handleDownloadFromCollage } = useContext(CollageContext);
  return (
    <button
      title="Download file"
      className={toolbar.buttonWithIcon}
      onClick={handleDownloadFromCollage}
    >
      <Download></Download>
      <span>Download</span>
    </button>
  );
}
