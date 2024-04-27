import { useContext } from "react";
import { ToolbarContext } from "../../providers/ToolbarProvider";
import { Download } from "lucide-react";
import toolbar from "../BottomToolbar.module.css";

export default function ButtonDownload() {
  const { handleDownload } = useContext(ToolbarContext);
  return (
    <button
      title="Download file"
      className={toolbar.buttonWithIcon}
      onClick={handleDownload}
    >
      <Download></Download>
      <span>Download</span>
    </button>
  );
}
