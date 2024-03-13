import { Square } from "lucide-react";
import toolbar from "../toolbar.module.css";

export default function ButtonCanvas({ onClick }: { onClick: () => void }) {
  return (
    <button
      title="Edit borders"
      className={toolbar.buttonWithIcon}
      onClick={onClick}
    >
      <Square></Square>
      <span>Canvas</span>
    </button>
  );
}
