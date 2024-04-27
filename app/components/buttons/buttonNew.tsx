import { useContext } from "react";
import { ToolbarContext } from "../../providers/ToolbarProvider";
import { FilePlus } from "lucide-react";
import toolbar from "../BottomToolbar.module.css";

export default function ButtonNew() {
  const { handleNewImage } = useContext(ToolbarContext);
  return (
    <button
      title="New file"
      className={toolbar.buttonWithIcon}
      onClick={handleNewImage}
    >
      <FilePlus></FilePlus>
      <span>New</span>
    </button>
  );
}
