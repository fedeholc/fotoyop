import { ChevronLeft } from "lucide-react";
import toolbar from "../BottomToolbar.module.css";

export default function ButtonBack({ onClick }: { onClick: () => void }) {
  return (
    <button
      title="Back to previous menu"
      className={toolbar.buttonFlow}
      onClick={onClick}
    >
      <ChevronLeft></ChevronLeft>
    </button>
  );
}
