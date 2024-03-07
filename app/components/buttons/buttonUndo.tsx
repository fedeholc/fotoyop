import { useContext } from "react";
import { ToolbarContext } from "../../providers/ToolbarProvider";
import { Undo } from "lucide-react";
import toolbar from "../toolbar.module.css";

export default function ButtonUndo() {
  const { handleUndo } = useContext(ToolbarContext);
  return (
    <button className={toolbar.buttonWithIcon} onClick={handleUndo}>
      <Undo size={16}></Undo>
      <span>Undo</span>
    </button>
  );
}
