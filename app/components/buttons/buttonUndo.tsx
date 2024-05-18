import { useContext } from "react";
import { ToolbarContext } from "../../providers/ToolbarProvider";
import { Undo } from "lucide-react";
import toolbar from "../BottomToolbar.module.css";

export default function ButtonUndo() {
  const { handleUndo } = useContext(ToolbarContext);
  return (
    <button
      title="Undo last change"
      className={toolbar.buttonWithIcon}
      onClick={handleUndo}
    >
      <Undo></Undo>
      <span>Undo</span>
    </button>
  );
}
