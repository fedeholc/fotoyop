import { Square } from "lucide-react";
import toolbar from "../toolbar.module.css";

export default function ButtonBorder({ onClick }: { onClick: () => void }) {
  return (
    <button
      title="Edit borders"
      className={toolbar.buttonWithIcon}
      onClick={onClick}
    >
      <Square></Square>
      <span>Borders</span>
    </button>
  );
}
