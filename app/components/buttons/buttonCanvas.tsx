import { Ratio } from "lucide-react";
import toolbar from "../BottomToolbar.module.css";

export default function ButtonCanvas({ onClick }: { onClick: () => void }) {
  return (
    <button
      title="Edit borders"
      className={toolbar.buttonWithIcon}
      onClick={onClick}
    >
      <Ratio />
      <span>Canvas</span>
    </button>
  );
}
