import { Component } from "lucide-react";
import toolbar from "../BottomToolbar.module.css";

export default function ButtonCollage({ onClick }: { onClick: () => void }) {
  return (
    <button
      title="Collage"
      className={toolbar.buttonWithIcon}
      onClick={onClick}
    >
      <Component />
      <span>Collage</span>
    </button>
  );
}
