import { Menu } from "lucide-react";
import toolbar from "../BottomToolbar.module.css";
import React from "react";

export default function ButtonMenu({ onClick }: { onClick: () => void }) {
  return (
    <button
      title="Go to main menu"
      className={toolbar.buttonFlow}
      onClick={onClick}
    >
      <Menu></Menu>
    </button>
  );
}
