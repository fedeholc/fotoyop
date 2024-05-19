import { Save } from "lucide-react";
import toolbar from "../BottomToolbar.module.css";

export default function ButtonApply({ onClick }: { onClick: () => void }) {
  return (
    <button
      title="Apply changes"
      className={toolbar.buttonFlow}
      onClick={onClick}
    >
      <Save></Save>
    </button>
  );
}
