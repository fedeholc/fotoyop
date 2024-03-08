import { X } from "lucide-react";
import toolbar from "../toolbar.module.css";

export default function ButtonDiscard({ onClick }: { onClick: () => void }) {
  return (
    <button
      title="Discard changes"
      className={toolbar.buttonOnlyIcon}
      onClick={onClick}
    >
      <X></X>
    </button>
  );
}
