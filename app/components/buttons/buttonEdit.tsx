import { Pencil } from "lucide-react";
import toolbar from "../toolbar.module.css";

export default function ButtonEdit({ onClick }: { onClick: () => void }) {
  return (
    <button
      title="Edit file"
      className={toolbar.buttonWithIcon}
      onClick={onClick}
    >
      <Pencil></Pencil>
      <span>Edit</span>
    </button>
  );
}
