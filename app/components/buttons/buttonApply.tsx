import { Check } from "lucide-react";
import toolbar from "../toolbar.module.css";

export default function ButtonApply({ onClick }: { onClick: () => void }) {
  return (
    <button
      title="Apply changes"
      className={toolbar.buttonOnlyIcon}
      onClick={onClick}
    >
      <Check></Check>
    </button>
  );
}
