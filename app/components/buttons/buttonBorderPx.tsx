import toolbar from "../BottomToolbar.module.css";

export default function ButtonBorderPx({ onClick }: { onClick: () => void }) {
  return (
    <button
      title="Edit border in pixels"
      className={toolbar.buttonOnlyIcon}
      onClick={onClick}
    >
      px
    </button>
  );
}
